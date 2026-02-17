import Dexie, { type Table } from 'dexie';
import { useState, useEffect, useCallback } from 'react';
import type { Pet, Incident, MoodLog, ScheduleItem, Reminder } from '../types';

// --- Database Schema ---

interface SettingRecord {
  key: string;
  value: any;
}

class PetCalmDB extends Dexie {
  pets!: Table<Pet>;
  incidents!: Table<Incident>;
  moodLogs!: Table<MoodLog>;
  scheduleItems!: Table<ScheduleItem>;
  reminders!: Table<Reminder>;
  settings!: Table<SettingRecord>;

  constructor() {
    super('PetCalmDB');
    this.version(1).stores({
      pets: 'id',
      incidents: 'id, date, trigger, severity',
      moodLogs: 'date',
      scheduleItems: 'id, time',
      reminders: 'id',
      settings: 'key',
    });
  }
}

export const db = new PetCalmDB();

// --- localStorage Migration ---

const MIGRATION_KEY = '_petcalm_migrated_to_idb';

export async function migrateFromLocalStorage(): Promise<void> {
  if (localStorage.getItem(MIGRATION_KEY)) return;

  try {
    // Migrate pet profile
    const petRaw = localStorage.getItem('pet_profile');
    if (petRaw) {
      const pet: Pet = JSON.parse(petRaw);
      await db.pets.put(pet);
    }

    // Migrate incidents
    const incidentsRaw = localStorage.getItem('behavior_incidents');
    if (incidentsRaw) {
      const incidents: Incident[] = JSON.parse(incidentsRaw);
      if (incidents.length > 0) await db.incidents.bulkPut(incidents);
    }

    // Migrate mood logs
    const moodRaw = localStorage.getItem('mood_logs');
    if (moodRaw) {
      const moods: MoodLog[] = JSON.parse(moodRaw);
      if (moods.length > 0) await db.moodLogs.bulkPut(moods);
    }

    // Migrate schedule
    const scheduleRaw = localStorage.getItem('daily_schedule');
    if (scheduleRaw) {
      const items: ScheduleItem[] = JSON.parse(scheduleRaw);
      if (items.length > 0) await db.scheduleItems.bulkPut(items);
    }

    // Migrate reminders
    const remindersRaw = localStorage.getItem('reminders');
    if (remindersRaw) {
      const reminders: Reminder[] = JSON.parse(remindersRaw);
      if (reminders.length > 0) await db.reminders.bulkPut(reminders);
    }

    // Migrate key-value settings (training_progress, sound_favorites)
    const trainingRaw = localStorage.getItem('training_progress');
    if (trainingRaw) {
      await db.settings.put({ key: 'training_progress', value: JSON.parse(trainingRaw) });
    }

    const favoritesRaw = localStorage.getItem('sound_favorites');
    if (favoritesRaw) {
      await db.settings.put({ key: 'sound_favorites', value: JSON.parse(favoritesRaw) });
    }

    // Mark migration complete and clean up localStorage
    localStorage.setItem(MIGRATION_KEY, '1');
    ['pet_profile', 'behavior_incidents', 'training_progress', 'mood_logs',
     'sound_favorites', 'daily_schedule', 'reminders'].forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.error('Migration from localStorage failed:', e);
  }
}

// --- React Hooks ---

/** Load and manage the pet profile */
export function usePet() {
  const [pet, setPetState] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.pets.toCollection().first().then(p => {
      setPetState(p ?? null);
      setLoading(false);
    });
  }, []);

  const savePet = useCallback(async (p: Pet) => {
    await db.pets.put(p);
    setPetState(p);
  }, []);

  const deletePet = useCallback(async () => {
    await db.pets.clear();
    await db.incidents.clear();
    await db.moodLogs.clear();
    await db.scheduleItems.clear();
    await db.reminders.clear();
    await db.settings.clear();
    setPetState(null);
  }, []);

  return { pet, loading, savePet, deletePet };
}

/** CRUD for behavior incidents */
export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const load = useCallback(async () => {
    const all = await db.incidents.orderBy('date').reverse().toArray();
    setIncidents(all);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addIncident = useCallback(async (incident: Incident) => {
    await db.incidents.put(incident);
    await load();
  }, [load]);

  const updateIncident = useCallback(async (incident: Incident) => {
    await db.incidents.put(incident);
    await load();
  }, [load]);

  const deleteIncident = useCallback(async (id: string) => {
    await db.incidents.delete(id);
    await load();
  }, [load]);

  return { incidents, addIncident, updateIncident, deleteIncident };
}

/** Mood log history */
export function useMoodLogs() {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);

  useEffect(() => {
    db.moodLogs.toArray().then(setMoodLogs);
  }, []);

  const saveMood = useCallback(async (log: MoodLog) => {
    await db.moodLogs.put(log);
    const all = await db.moodLogs.toArray();
    setMoodLogs(all);
  }, []);

  return { moodLogs, saveMood };
}

/** Schedule items */
export function useSchedule() {
  const [items, setItems] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    db.scheduleItems.orderBy('time').toArray().then(setItems);
  }, []);

  const addItem = useCallback(async (item: ScheduleItem) => {
    await db.scheduleItems.put(item);
    const all = await db.scheduleItems.orderBy('time').toArray();
    setItems(all);
  }, []);

  const removeItem = useCallback(async (id: string) => {
    await db.scheduleItems.delete(id);
    const all = await db.scheduleItems.orderBy('time').toArray();
    setItems(all);
  }, []);

  return { items, addItem, removeItem };
}

/** Reminders */
export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    db.reminders.toArray().then(setReminders);
  }, []);

  const saveReminder = useCallback(async (r: Reminder) => {
    await db.reminders.put(r);
    const all = await db.reminders.toArray();
    setReminders(all);
  }, []);

  const deleteReminder = useCallback(async (id: string) => {
    await db.reminders.delete(id);
    const all = await db.reminders.toArray();
    setReminders(all);
  }, []);

  const toggleReminder = useCallback(async (id: string) => {
    const r = await db.reminders.get(id);
    if (r) {
      r.enabled = !r.enabled;
      await db.reminders.put(r);
      const all = await db.reminders.toArray();
      setReminders(all);
    }
  }, []);

  return { reminders, saveReminder, deleteReminder, toggleReminder };
}

/** Generic key-value setting (training_progress, sound_favorites) */
export function useSetting<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    db.settings.get(key).then(rec => {
      if (rec) setValue(rec.value as T);
      setLoaded(true);
    });
  }, [key]);

  const save = useCallback(async (newValue: T) => {
    await db.settings.put({ key, value: newValue });
    setValue(newValue);
  }, [key]);

  return { value, save, loaded };
}
