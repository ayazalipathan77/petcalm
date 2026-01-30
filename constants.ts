import { Sound, TrainingProgram, Incident } from './types';
import { Sparkles, CloudRain, Home, Car, Music, Cloud, Leaf } from 'lucide-react';

export const TRIGGERS = [
  'Fireworks',
  'Thunderstorms',
  'Separation',
  'Strangers',
  'Car Rides',
  'Vet Visits',
  'Loud Noises',
  'Other Construction'
];

export const MOCK_SOUNDS: Sound[] = [
  { id: '1', title: 'Gentle Rain & White Noise', category: 'Nature', duration: 1800, isPremium: false, color: 'bg-blue-100' },
  { id: '2', title: 'Calm Piano for Paws', category: 'Classical', duration: 1200, isPremium: false, color: 'bg-amber-100' },
  { id: '3', title: 'Box Fan & Heartbeat', category: 'Specialized', duration: 3600, isPremium: true, color: 'bg-rose-100' },
  { id: '4', title: 'Forest Breeze', category: 'Nature', duration: 2400, isPremium: false, color: 'bg-emerald-100' },
  { id: '5', title: 'Deep Sleep Frequencies', category: 'Specialized', duration: 5000, isPremium: true, color: 'bg-purple-100' },
];

export const MOCK_PROGRAMS: TrainingProgram[] = [
  { id: 'p1', title: 'Fireworks Desensitization', description: 'Gradual exposure to boom sounds.', totalSteps: 8, completedSteps: 3, category: 'Noise', icon: 'sparkles' },
  { id: 'p2', title: 'Separation Comfort', description: 'Building confidence when alone.', totalSteps: 12, completedSteps: 0, category: 'Separation', icon: 'home' },
  { id: 'p3', title: 'Car Ride Prep', description: 'Making travel less stressful.', totalSteps: 6, completedSteps: 6, category: 'Travel', icon: 'car' },
];

export const MOCK_INCIDENTS: Incident[] = [
  { id: 'i1', date: new Date(Date.now() - 86400000 * 2).toISOString(), trigger: 'Loud Noises', severity: 4, notes: 'Garbage truck startled him.' },
  { id: 'i2', date: new Date(Date.now() - 86400000 * 5).toISOString(), trigger: 'Separation', severity: 2, notes: 'Whined for 5 mins then settled.' },
  { id: 'i3', date: new Date(Date.now() - 86400000 * 10).toISOString(), trigger: 'Fireworks', severity: 5, notes: 'Panic attack during celebration.' },
];
