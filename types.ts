export type ViewState = 'ONBOARDING' | 'HOME' | 'SOUNDS' | 'TRAINING' | 'LOG' | 'PROFILE';

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
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  totalSteps: number;
  completedSteps: number;
  category: 'Noise' | 'Separation' | 'Social' | 'Travel';
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
