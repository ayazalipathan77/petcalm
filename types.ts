export type ViewState = 'ONBOARDING' | 'HOME' | 'SOUNDS' | 'TRAINING' | 'LOG' | 'GUIDE' | 'PROFILE' | 'PRIVACY';

export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  age: number; // in months
  photoUrl?: string;
  triggers: string[];
}

export interface Sound {
  id: string;
  title: string;
  category: 'White Noise' | 'Nature' | 'Classical' | 'Specialized';
  duration: number; // seconds
  isPremium: boolean;
  color: string;
  url: string;
}

export interface TrainingStep {
  id: number;
  title: string;
  description: string;
  duration: string; // e.g., "5 mins" or "10 reps"
  tip: string; // Clinical tip
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  medicalContext: string; // Why this works scientifically
  steps: TrainingStep[];
  completedStepIndex: number; // 0 to steps.length
  category: 'Noise' | 'Separation' | 'Social' | 'Travel' | 'Cooperative Care';
  icon: string;
}

export interface Incident {
  id: string;
  date: string;
  trigger: string;
  severity: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

export interface MoodLog {
  date: string;
  mood: 1 | 2 | 3 | 4 | 5; // 1 = Anxious, 5 = Calm
}

export interface ScheduleItem {
  id: string;
  time: string; // HH:MM format
  label: string;
  icon: 'training' | 'sound' | 'walk' | 'vet' | 'feeding';
}

export interface Reminder {
  id: string;
  title: string;
  time: string; // HH:MM format
  days: string[]; // e.g. ['Mon', 'Wed', 'Fri']
  enabled: boolean;
}