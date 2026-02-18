/**
 * Local notification scheduling for reminders.
 * Uses @capacitor/local-notifications when running as a native app.
 * Silently no-ops in the browser (where push isn't needed).
 */

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Reminder } from '../types';

// Capacitor weekday: 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat
const DAY_MAP: Record<string, number> = {
  Sun: 1, Mon: 2, Tue: 3, Wed: 4, Thu: 5, Fri: 6, Sat: 7,
};

function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNative()) return false;
  try {
    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  } catch {
    return false;
  }
}

/**
 * Schedule (or re-schedule) all notifications for a single reminder.
 * Each enabled day gets its own notification ID derived from the reminder id + day index.
 */
export async function scheduleReminder(reminder: Reminder): Promise<void> {
  if (!isNative() || !reminder.enabled) return;

  try {
    const [hour, minute] = reminder.time.split(':').map(Number);
    const notifications = reminder.days
      .filter((day) => DAY_MAP[day])
      .map((day, idx) => ({
        id: notifId(reminder.id, idx),
        title: '🐾 PetCalm Reminder',
        body: reminder.title,
        schedule: {
          on: { weekday: DAY_MAP[day], hour, minute },
          allowWhileIdle: true,
        },
        sound: undefined,
        smallIcon: 'ic_launcher',
      }));

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
    }
  } catch (err) {
    console.warn('[notifications] Failed to schedule:', err);
  }
}

/**
 * Cancel all notifications for a reminder (all its days).
 */
export async function cancelReminder(reminderId: string): Promise<void> {
  if (!isNative()) return;
  try {
    const notifications = Array.from({ length: 7 }, (_, idx) => ({
      id: notifId(reminderId, idx),
    }));
    await LocalNotifications.cancel({ notifications });
  } catch (err) {
    console.warn('[notifications] Failed to cancel:', err);
  }
}

/**
 * Sync all reminders: cancel everything then re-schedule enabled ones.
 * Call on app startup to ensure notifications match saved reminders.
 */
export async function syncReminders(reminders: Reminder[]): Promise<void> {
  if (!isNative()) return;
  for (const r of reminders) {
    await cancelReminder(r.id);
    if (r.enabled) {
      await scheduleReminder(r);
    }
  }
}

/** Generate a stable numeric notification ID from a string reminder ID + day index */
function notifId(reminderId: string, dayIndex: number): number {
  let hash = 0;
  for (let i = 0; i < reminderId.length; i++) {
    hash = (hash * 31 + reminderId.charCodeAt(i)) | 0;
  }
  // Keep positive, leave room for 7 day offsets
  return Math.abs(hash % 100_000) * 10 + dayIndex;
}
