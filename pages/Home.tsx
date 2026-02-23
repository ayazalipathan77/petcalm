import React, { useState, useEffect, useMemo } from 'react';
import { ScheduleItem } from '../types';
import { Pet, ViewState } from '../types';
import { Bell, Music, Play, Calendar, Plus, X, BookOpen, Footprints, Stethoscope, UtensilsCrossed, BrainCircuit, Sparkles, Crown } from 'lucide-react';
import { BottomSheet } from '../components/BottomSheet';
import { Button } from '../components/ui/Button';
import { PetSwitcher } from '../components/PetSwitcher';
import { DAILY_TIPS, MOCK_PROGRAMS, BREED_TIPS } from '../constants';
import { useMoodLogs, useSchedule, useReminders, useSetting, useIncidents } from '../services/db';
import { requestNotificationPermission, scheduleReminder, cancelReminder } from '../services/notifications';
import { getWeeklyReport } from '../services/geminiService';
import { usePro } from '../context/ProContext';

interface HomeProps {
  pet: Pet;
  pets: Pet[];
  activePetId: string | null;
  onSwitchPet: (id: string) => void;
  onNavigate: (view: ViewState) => void;
  onPanic: () => void;
}

export const Home: React.FC<HomeProps> = ({ pet, pets, activePetId, onSwitchPet, onNavigate, onPanic }) => {
  const { isPro, openPaywall } = usePro();
  const today = new Date().toISOString().split('T')[0];

  // Dexie hooks — filtered by active pet where applicable
  const { moodLogs, saveMood } = useMoodLogs();
  const { items: schedule, addItem: addScheduleItem, removeItem: removeScheduleItem } = useSchedule(activePetId);
  const { reminders, saveReminder, deleteReminder, toggleReminder } = useReminders(activePetId);
  const { value: trainingProgress } = useSetting<Record<string, number>>('training_progress', {});
  const { incidents } = useIncidents(activePetId);
  const { value: cachedWeeklyReport, save: saveWeeklyReport } = useSetting<string>('weekly_report_' + (activePetId ?? 'default'), '');
  const [weeklyReport, setWeeklyReport] = useState<string | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const todayLog = moodLogs.find(l => l.date === today);
  const [mood, setMood] = useState<number | null>(null);
  const currentMood = mood ?? todayLog?.mood ?? null;

  // Memoized 7-day chart data — only recomputes when moodLogs changes
  const chartDays = useMemo(() =>
    Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split('T')[0];
      return {
        key,
        dayLabel: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
        log: moodLogs.find(l => l.date === key),
      };
    }),
    [moodLogs]
  );

  // Find first in-progress training program
  const inProgressProgram = MOCK_PROGRAMS.find(p => {
    const idx = trainingProgress[p.id];
    return idx !== undefined && idx > 0 && idx < p.steps.length;
  });

  const handleMoodSelect = (value: number) => {
    if (navigator.vibrate) navigator.vibrate(50);
    setMood(value);
    saveMood({ date: today, mood: value as 1|2|3|4|5 });
  };

  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [newTime, setNewTime] = useState('09:00');
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState<ScheduleItem['icon']>('training');

  const handleAddScheduleItem = () => {
    if (!newLabel.trim()) return;
    const item: ScheduleItem = {
      id: Math.random().toString(),
      time: newTime,
      label: newLabel,
      icon: newIcon,
      petId: activePetId ?? undefined,
    };
    addScheduleItem(item);
    setShowAddSchedule(false);
    setNewLabel('');
    setNewTime('09:00');
    setNewIcon('training');
  };

  const scheduleIconMap: Record<ScheduleItem['icon'], { bg: string; color: string; Icon: any }> = {
    training: { bg: 'bg-orange-100', color: 'text-orange-600', Icon: BookOpen },
    sound: { bg: 'bg-blue-100', color: 'text-blue-600', Icon: Music },
    walk: { bg: 'bg-green-100', color: 'text-green-600', Icon: Footprints },
    vet: { bg: 'bg-rose-100', color: 'text-rose-600', Icon: Stethoscope },
    feeding: { bg: 'bg-amber-100', color: 'text-amber-600', Icon: UtensilsCrossed },
  };

  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  // Request notification permission on mount (native only, no-op in browser)
  useEffect(() => { requestNotificationPermission(); }, []);

  // Reminders UI state
  const [showReminders, setShowReminders] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [reminderDays, setReminderDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const addReminder = () => {
    if (!reminderTitle.trim()) return;
    const newReminder = {
      id: Math.random().toString(),
      title: reminderTitle,
      time: reminderTime,
      days: reminderDays,
      enabled: true,
      petId: activePetId ?? undefined,
    };
    saveReminder(newReminder);
    scheduleReminder(newReminder);
    setShowAddReminder(false);
    setReminderTitle('');
    setReminderTime('09:00');
    setReminderDays(['Mon', 'Wed', 'Fri']);
  };

  // Weekly report: auto-load cached, allow manual refresh
  useEffect(() => {
    if (cachedWeeklyReport) setWeeklyReport(cachedWeeklyReport);
  }, [cachedWeeklyReport]);

  const handleWeeklyReport = async () => {
    setIsLoadingReport(true);
    const result = await getWeeklyReport(moodLogs, incidents, pet.name);
    setWeeklyReport(result);
    saveWeeklyReport(result);
    setIsLoadingReport(false);
  };

  // Breed-specific tip — pick one deterministically based on date
  const breedTips = pet.breed ? (BREED_TIPS[pet.breed] ?? []) : [];
  const breedTip = breedTips.length > 0
    ? breedTips[Math.floor(Date.now() / 86400000) % breedTips.length]
    : null;

  const moodEmojis = ['😰', '😕', '😐', '🙂', '😊'];

  const isImage = (url?: string) => url && (url.startsWith('http') || url.startsWith('data:'));

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg overflow-hidden border-2 border-white shadow-sm">
             {isImage(pet.photoUrl) ? (
                <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
                <span>{pet.photoUrl || (pet.type === 'cat' ? '🐱' : '🐶')}</span>
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-text leading-tight">{pet.name}</h1>
            <p className="text-xs text-neutral-subtext">{new Date().getHours() < 12 ? 'Good Morning!' : new Date().getHours() < 17 ? 'Good Afternoon!' : 'Good Evening!'}</p>
            <PetSwitcher pets={pets} activePetId={activePetId} onSwitch={onSwitchPet} />
          </div>
        </div>
        <button onClick={() => setShowReminders(true)} className="relative p-2 text-neutral-subtext hover:text-primary transition-colors">
          <Bell size={24} />
          {reminders.some(r => r.enabled) && <span className="absolute top-1.5 right-2 w-2 h-2 bg-status-error rounded-full border border-white"></span>}
        </button>
      </header>

      {/* Reminders Panel */}
      <BottomSheet open={showReminders} onClose={() => { setShowReminders(false); setShowAddReminder(false); }}>
        <div className="px-6 pb-3 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-neutral-text">Reminders</h2>
          <button onClick={() => setShowReminders(false)} className="text-neutral-400 hover:text-neutral-text"><X size={20} /></button>
        </div>
        <div className="px-6 pb-4 overflow-y-auto flex-1">
          {reminders.length === 0 ? (
            <p className="text-sm text-neutral-subtext text-center py-8">No reminders yet. Add one to stay on track!</p>
          ) : (
            <div className="space-y-3">
              {reminders.map(r => (
                <div key={r.id} className={`p-4 rounded-xl border flex items-start gap-3 ${r.enabled ? 'border-primary/20 bg-primary/5' : 'border-neutral-200 opacity-60'}`}>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-neutral-text">{r.title}</h4>
                    <p className="text-xs text-neutral-subtext">{formatTime(r.time)} · {r.days.join(', ')}</p>
                  </div>
                  <button onClick={() => {
                    toggleReminder(r.id);
                    if (r.enabled) { cancelReminder(r.id); } else { scheduleReminder({ ...r, enabled: true }); }
                  }} className={`w-10 h-6 rounded-full relative transition-colors ${r.enabled ? 'bg-primary' : 'bg-neutral-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${r.enabled ? 'right-1' : 'left-1'}`} />
                  </button>
                  <button onClick={() => { cancelReminder(r.id); deleteReminder(r.id); }} className="text-neutral-400 hover:text-red-500 p-1"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        {!showAddReminder ? (
          <div className="px-6 pt-3 pb-8 border-t border-neutral-100 flex-shrink-0">
            <Button fullWidth onClick={() => setShowAddReminder(true)} className="flex items-center justify-center gap-2"><Plus size={16} /> Add Reminder</Button>
          </div>
        ) : (
          <div className="px-6 pt-3 pb-8 border-t border-neutral-100 space-y-3 flex-shrink-0">
            <input type="text" value={reminderTitle} onChange={e => setReminderTitle(e.target.value)} placeholder="e.g. Training Session" className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-gray-900 focus:border-primary outline-none text-sm" />
            <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-gray-900 focus:border-primary outline-none text-sm" />
            <div className="flex gap-1">
              {allDays.map(d => (
                <button key={d} onClick={() => setReminderDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${reminderDays.includes(d) ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                  {d.charAt(0)}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" fullWidth onClick={() => setShowAddReminder(false)}>Cancel</Button>
              <Button fullWidth onClick={addReminder} disabled={!reminderTitle.trim()}>Save</Button>
            </div>
          </div>
        )}
      </BottomSheet>

      <div className="p-6 space-y-6">

        {/* Daily Status */}
        <section className="bg-gradient-to-br from-primary-light/20 to-white p-5 rounded-2xl border border-primary/10 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-text mb-3">How is {pet.name} feeling?</h2>
          <div className="flex justify-between">
            {moodEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleMoodSelect(index + 1)}
                className={`text-2xl p-2 rounded-full transition-all transform ${
                  currentMood === index + 1
                    ? 'bg-white shadow-md scale-125'
                    : 'hover:bg-white/50 hover:scale-110 grayscale opacity-70 hover:grayscale-0 hover:opacity-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          {moodLogs.length > 1 && (
            <div className="mt-3 pt-3 border-t border-primary/10">
              <p className="text-[10px] text-neutral-subtext uppercase tracking-wider font-bold mb-2">Last 7 Days</p>
              <div className="flex gap-1 items-end">
                {chartDays.map(({ key, dayLabel, log }) => (
                  <div key={key} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-sm transition-all ${log ? 'bg-primary' : 'bg-neutral-200'}`}
                      style={{ height: log ? `${log.mood * 6}px` : '4px' }}
                    />
                    <span className="text-[8px] text-neutral-400">{dayLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Training Resume CTA */}
        {inProgressProgram && (
          <section className="bg-white border border-primary/20 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
              <Play size={20} fill="currentColor" className="ml-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-neutral-subtext font-bold uppercase tracking-wider">Continue Training</p>
              <h4 className="font-bold text-neutral-text text-sm truncate">{inProgressProgram.title}</h4>
              <p className="text-xs text-neutral-subtext">
                Step {trainingProgress[inProgressProgram.id] + 1} of {inProgressProgram.steps.length}
              </p>
            </div>
            <button
              onClick={() => onNavigate('TRAINING')}
              className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold flex-shrink-0 hover:bg-primary-dark transition-colors"
            >
              Resume
            </button>
          </section>
        )}

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('SOUNDS')}
            className="p-4 bg-secondary/10 rounded-2xl flex flex-col items-center justify-center gap-2 border border-secondary/20 active:scale-95 transition-all"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm">
              <Music size={24} fill="currentColor" className="opacity-20" />
              <Music size={24} className="absolute" />
            </div>
            <span className="font-semibold text-secondary-dark">Calming Sounds</span>
          </button>

          <button
            onClick={() => onNavigate('TRAINING')}
            className="p-4 bg-accent/10 rounded-2xl flex flex-col items-center justify-center gap-2 border border-accent/20 active:scale-95 transition-all"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-accent shadow-sm">
              <Play size={24} fill="currentColor" className="ml-1" />
            </div>
            <span className="font-semibold text-accent-dark">Training</span>
          </button>
        </section>

        {/* Today's Schedule */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-neutral-text">Today's Schedule</h2>
            <button onClick={() => setShowAddSchedule(true)} className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
              <Plus size={12} /> Add
            </button>
          </div>
          {schedule.length === 0 ? (
            <div className="bg-white/50 border border-dashed border-neutral-300 rounded-xl p-6 text-center">
              <p className="text-sm text-neutral-subtext mb-2">No activities scheduled</p>
              <button onClick={() => setShowAddSchedule(true)} className="text-xs font-bold text-primary">+ Add your first activity</button>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 hide-scrollbar">
              {schedule.map(item => {
                const { bg, color, Icon } = scheduleIconMap[item.icon];
                return (
                  <div key={item.id} className="min-w-[140px] p-4 bg-white rounded-xl border border-neutral-100 shadow-sm flex flex-col gap-2 relative group">
                    <button onClick={() => removeScheduleItem(item.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-all">
                      <X size={14} />
                    </button>
                    <span className="text-xs font-bold text-neutral-subtext">{formatTime(item.time)}</span>
                    <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center ${color}`}>
                      <Icon size={16} />
                    </div>
                    <p className="font-semibold text-sm">{item.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Schedule Sheet */}
          <BottomSheet open={showAddSchedule} onClose={() => setShowAddSchedule(false)}>
            <div className="px-6 pb-6 space-y-4">
              <h3 className="text-lg font-bold text-neutral-text">Add Activity</h3>
              <div>
                <label className="block text-sm text-neutral-subtext mb-1">Time</label>
                <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-gray-900 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm text-neutral-subtext mb-1">Activity</label>
                <input type="text" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="e.g. Morning Walk" className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-gray-900 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm text-neutral-subtext mb-2">Type</label>
                <div className="flex gap-2">
                  {(Object.keys(scheduleIconMap) as ScheduleItem['icon'][]).map(key => {
                    const { bg, color, Icon } = scheduleIconMap[key];
                    return (
                      <button key={key} onClick={() => setNewIcon(key)} className={`flex-1 p-2 rounded-xl flex flex-col items-center gap-1 border-2 transition-all ${newIcon === key ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}>
                        <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center ${color}`}><Icon size={14} /></div>
                        <span className="text-[10px] capitalize">{key}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3 pt-2 pb-4">
                <Button variant="ghost" fullWidth onClick={() => setShowAddSchedule(false)}>Cancel</Button>
                <Button fullWidth onClick={handleAddScheduleItem} disabled={!newLabel.trim()}>Add</Button>
              </div>
            </div>
          </BottomSheet>
        </section>

        {/* Weekly AI Report */}
        {moodLogs.length >= 3 && (
          <section>
            {weeklyReport ? (
              <div className="bg-gradient-to-br from-secondary/10 to-white p-5 rounded-2xl border border-secondary/20 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-secondary-dark font-bold text-sm">
                    <BrainCircuit size={16} />
                    Weekly Wellness Report
                  </div>
                  <button
                    onClick={() => { setWeeklyReport(null); saveWeeklyReport(''); }}
                    className="text-xs text-neutral-400 underline"
                  >
                    Refresh
                  </button>
                </div>
                <p className="text-sm text-neutral-text leading-relaxed whitespace-pre-line">{weeklyReport}</p>
              </div>
            ) : (
              <Button
                variant="ghost"
                fullWidth
                onClick={isPro ? handleWeeklyReport : openPaywall}
                isLoading={isLoadingReport}
                className="flex items-center justify-center gap-2 border border-secondary/30 text-secondary-dark"
              >
                {isPro ? <BrainCircuit size={16} /> : <Crown size={16} className="text-amber-500" />}
                {isPro ? 'Generate Weekly Report' : 'Weekly Report (Pro)'}
              </Button>
            )}
          </section>
        )}

        {/* Tip of the Day */}
        <section className="bg-accent/10 p-5 rounded-2xl border-l-4 border-accent relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white text-accent-dark text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Tip</span>
            </div>
            <p className="text-sm text-neutral-text font-medium leading-relaxed">
              {DAILY_TIPS[Math.floor(Date.now() / 86400000) % DAILY_TIPS.length]}
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 text-accent opacity-20">
            <Music size={80} />
          </div>
        </section>

        {/* Breed-Specific Tip */}
        {breedTip && (
          <section className="bg-primary/5 p-5 rounded-2xl border border-primary/15 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">{pet.breed} Tip</p>
              <p className="text-sm text-neutral-text leading-relaxed">{breedTip}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
