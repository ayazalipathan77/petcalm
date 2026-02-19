import Dexie, { type Table } from 'dexie';
import { useState, useEffect, useCallback, useRef } from 'react';
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
    // v2: add petId indexes for multi-pet filtering
    this.version(2).stores({
      pets: 'id',
      incidents: 'id, date, trigger, severity, petId',
      moodLogs: 'date',
      scheduleItems: 'id, time, petId',
      reminders: 'id, petId',
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

/** Multi-pet management — replaces usePet() */
export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [activePetId, setActivePetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const all = await db.pets.toArray();
    setPets(all);
    // restore last active pet from settings, fallback to first
    const rec = await db.settings.get('active_pet_id');
    const stored = rec?.value as string | undefined;
    if (stored && all.find(p => p.id === stored)) {
      setActivePetId(stored);
    } else if (all.length > 0) {
      setActivePetId(all[0].id);
    } else {
      setActivePetId(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const activePet = pets.find(p => p.id === activePetId) ?? null;

  const savePet = useCallback(async (p: Pet) => {
    await db.pets.put(p);
    await load();
  }, [load]);

  const addPet = useCallback(async (p: Pet) => {
    await db.pets.put(p);
    await db.settings.put({ key: 'active_pet_id', value: p.id });
    await load();
  }, [load]);

  const setActivePet = useCallback(async (id: string) => {
    setActivePetId(id);
    await db.settings.put({ key: 'active_pet_id', value: id });
  }, []);

  const deletePetById = useCallback(async (id: string) => {
    await db.pets.delete(id);
    await db.incidents.where('petId').equals(id).delete();
    await db.scheduleItems.where('petId').equals(id).delete();
    await db.reminders.where('petId').equals(id).delete();
    await load();
  }, [load]);

  const deleteAllData = useCallback(async () => {
    await db.pets.clear();
    await db.incidents.clear();
    await db.moodLogs.clear();
    await db.scheduleItems.clear();
    await db.reminders.clear();
    await db.settings.clear();
    setPets([]);
    setActivePetId(null);
  }, []);

  return { pets, activePet, activePetId, loading, savePet, addPet, setActivePet, deletePetById, deleteAllData };
}

/** @deprecated Use usePets() instead. Kept for backward compatibility. */
export function usePet() {
  const { activePet: pet, loading, savePet, deleteAllData: deletePet } = usePets();
  return { pet, loading, savePet, deletePet };
}

/** CRUD for behavior incidents, optionally filtered by petId, with pagination */
export function useIncidents(petId?: string | null, pageSize: number = 20) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const currentPage = useRef(0);

  const load = useCallback(async (page: number) => {
    const take = (page + 1) * pageSize;
    let all: Incident[];
    if (petId) {
      all = await db.incidents.where('petId').equals(petId).reverse().sortBy('date');
    } else {
      all = await db.incidents.orderBy('date').reverse().toArray();
    }
    setHasMore(all.length > take);
    setIncidents(all.slice(0, take));
    currentPage.current = page;
  }, [petId, pageSize]);

  useEffect(() => { load(0); }, [load]);

  const loadMore = useCallback(() => load(currentPage.current + 1), [load]);

  const addIncident = useCallback(async (incident: Incident) => {
    await db.incidents.put(incident);
    await load(currentPage.current);
  }, [load]);

  const updateIncident = useCallback(async (incident: Incident) => {
    await db.incidents.put(incident);
    await load(currentPage.current);
  }, [load]);

  const deleteIncident = useCallback(async (id: string) => {
    await db.incidents.delete(id);
    await load(currentPage.current);
  }, [load]);

  return { incidents, hasMore, loadMore, addIncident, updateIncident, deleteIncident };
}

/** Mood log history (shared across all pets — one daily mood for the household) */
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

/** Schedule items, optionally filtered by petId */
export function useSchedule(petId?: string | null) {
  const [items, setItems] = useState<ScheduleItem[]>([]);

  const load = useCallback(async () => {
    let all: ScheduleItem[];
    if (petId) {
      all = await db.scheduleItems.where('petId').equals(petId).sortBy('time');
    } else {
      all = await db.scheduleItems.orderBy('time').toArray();
    }
    setItems(all);
  }, [petId]);

  useEffect(() => { load(); }, [load]);

  const addItem = useCallback(async (item: ScheduleItem) => {
    await db.scheduleItems.put(item);
    await load();
  }, [load]);

  const removeItem = useCallback(async (id: string) => {
    await db.scheduleItems.delete(id);
    await load();
  }, [load]);

  return { items, addItem, removeItem };
}

/** Reminders, optionally filtered by petId */
export function useReminders(petId?: string | null) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const load = useCallback(async () => {
    let all: Reminder[];
    if (petId) {
      all = await db.reminders.where('petId').equals(petId).toArray();
    } else {
      all = await db.reminders.toArray();
    }
    setReminders(all);
  }, [petId]);

  useEffect(() => { load(); }, [load]);

  const saveReminder = useCallback(async (r: Reminder) => {
    await db.reminders.put(r);
    await load();
  }, [load]);

  const deleteReminder = useCallback(async (id: string) => {
    await db.reminders.delete(id);
    await load();
  }, [load]);

  const toggleReminder = useCallback(async (id: string) => {
    const r = await db.reminders.get(id);
    if (r) {
      r.enabled = !r.enabled;
      await db.reminders.put(r);
      await load();
    }
  }, [load]);

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
