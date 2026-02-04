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
  { 
    id: '1', 
    title: 'Gentle Rain & White Noise', 
    category: 'Nature', 
    duration: 1800, 
    isPremium: false, 
    color: 'bg-blue-100',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/17/audio_031f085732.mp3?filename=rain-and-thunder-16705.mp3' 
  },
  { 
    id: '2', 
    title: 'Calm Piano for Paws', 
    category: 'Classical', 
    duration: 1200, 
    isPremium: false, 
    color: 'bg-amber-100',
    url: 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_5b30612143.mp3?filename=piano-moment-11656.mp3'
  },
  { 
    id: '3', 
    title: 'Box Fan (Brown Noise)', 
    category: 'Specialized', 
    duration: 3600, 
    isPremium: true, 
    color: 'bg-rose-100',
    url: 'https://cdn.pixabay.com/download/audio/2022/11/04/audio_c35272a76f.mp3?filename=brown-noise-12543.mp3'
  },
  { 
    id: '4', 
    title: 'Forest Breeze', 
    category: 'Nature', 
    duration: 2400, 
    isPremium: false, 
    color: 'bg-emerald-100',
    url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_07885d5360.mp3?filename=forest-birds-6762.mp3'
  },
  { 
    id: '5', 
    title: 'Deep Sleep Frequencies', 
    category: 'Specialized', 
    duration: 5000, 
    isPremium: true, 
    color: 'bg-purple-100',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/09/audio_c8c8a73467.mp3?filename=meditation-10657.mp3'
  },
];

export const MOCK_PROGRAMS: TrainingProgram[] = [
  { 
    id: 'p1', 
    title: 'Noise Desensitization (DSCC)', 
    description: 'Systematic exposure to phobic sounds (Fireworks/Thunder) paired with high-value rewards.', 
    medicalContext: 'Based on "Open Bar/Closed Bar" conditioning. The goal is to change the emotional response (CER) from fear to anticipation of food.',
    category: 'Noise', 
    icon: 'sparkles',
    completedStepIndex: 1,
    steps: [
      { id: 1, title: 'Establish Safe Haven', description: 'Create a sound-insulated area (bathroom/closet) with white noise.', duration: '1 Day', tip: 'Do not force the pet to stay here; make it a choice.' },
      { id: 2, title: 'Sub-Threshold Playback', description: 'Play trigger sound at 1% volume. Pet should show NO reaction.', duration: '5 mins', tip: 'If ears pin back or panting starts, stop. You are too loud.' },
      { id: 3, title: 'Counter-Conditioning', description: 'Feed high-value treats (chicken/cheese) ONLY while sound plays.', duration: '3 mins', tip: 'Sound on = Chicken appears. Sound off = Chicken disappears.' },
      { id: 4, title: 'Volume Increment', description: 'Increase volume by 5%. Repeat treating.', duration: '5 mins', tip: 'Go slow. If reaction occurs, go back 2 steps.' },
      { id: 5, title: 'Variable Context', description: 'Play sounds in different rooms at low volume.', duration: '5 mins', tip: 'Generalization is key to success.' }
    ]
  },
  { 
    id: 'p2', 
    title: 'Separation: Departure Cues', 
    description: 'Uncoupling departure triggers (keys, shoes) from the actual act of leaving.', 
    medicalContext: 'Separation anxiety is a panic disorder. We use systematic desensitization to make "leaving signals" meaningless (boring) to the pet.',
    category: 'Separation', 
    icon: 'home',
    completedStepIndex: 0,
    steps: [
      { id: 1, title: 'The Key Jingle', description: 'Pick up keys, jingle them, put them down. Do NOT leave.', duration: '10 reps', tip: 'Repeat until the pet stops looking up when keys jingle.' },
      { id: 2, title: 'The Shoe Put-On', description: 'Put on shoes, walk to the couch, sit down.', duration: '5 reps', tip: 'We are breaking the prediction that Shoes = Isolation.' },
      { id: 3, title: 'Door Bore', description: 'Open the door, stand for 1 second, close it. Stay inside.', duration: '10 reps', tip: 'Ignore the pet completely during this exercise.' },
      { id: 4, title: 'Micro-Absence', description: 'Step outside, close door, return immediately (3 seconds).', duration: '5 reps', tip: 'Return BEFORE the pet starts whining/pacing.' }
    ]
  },
  { 
    id: 'p3', 
    title: 'Cooperative Care: Vet Prep', 
    description: 'Teaching the pet to accept handling and restraint voluntarily.', 
    medicalContext: 'Utilizes "Fear Free" handling concepts. Gives the animal a sense of control/consent via start buttons (eye contact or chin rest).',
    category: 'Cooperative Care', 
    icon: 'leaf',
    completedStepIndex: 2,
    steps: [
      { id: 1, title: 'Touch & Treat', description: 'Touch a non-sensitive area (shoulder), immediately treat.', duration: '10 reps', tip: 'Touch predicts the treat.' },
      { id: 2, title: 'Paw Handling', description: 'Slide hand down leg. If pet pulls away, stop. If they stay, treat.', duration: '2 mins', tip: 'Never grab. Ask for the paw.' },
      { id: 3, title: 'Tool Desensitization', description: 'Show nail clipper/syringe. Treat. Hide tool.', duration: '10 reps', tip: 'The sight of the tool predicts the snack.' },
      { id: 4, title: 'Restraint Simulation', description: 'Lightly hug/hold for 2 seconds. Treat while holding.', duration: '5 reps', tip: 'Release before the pet struggles.' }
    ]
  },
  { 
    id: 'p4', 
    title: 'Car Travel Acclimatization', 
    description: 'Reducing motion sickness and travel anxiety.', 
    medicalContext: 'Combines counter-conditioning for anxiety with physical acclimation for the vestibular system.',
    category: 'Travel', 
    icon: 'car',
    completedStepIndex: 0,
    steps: [
      { id: 1, title: 'The Parked Picnic', description: 'Sit in parked car (engine off) with pet. Feed a meal.', duration: '15 mins', tip: 'Create a positive association with the vehicle space.' },
      { id: 2, title: 'Engine Idle', description: 'Turn engine on. Feed treats. Turn engine off.', duration: '5 mins', tip: 'Vibration can be scary. Pair it with food.' },
      { id: 3, title: 'Driveway Back & Forth', description: 'Move car 10 feet. Park. Treat.', duration: '5 reps', tip: 'Acclimates the inner ear to movement.' },
      { id: 4, title: 'Around the Block', description: 'Drive around one block. Return home immediately.', duration: '2 mins', tip: 'End the trip before nausea sets in.' }
    ]
  },
];

export const MOCK_INCIDENTS: Incident[] = [
  { id: 'i1', date: new Date(Date.now() - 86400000 * 2).toISOString(), trigger: 'Loud Noises', severity: 4, notes: 'Garbage truck startled him.' },
  { id: 'i2', date: new Date(Date.now() - 86400000 * 5).toISOString(), trigger: 'Separation', severity: 2, notes: 'Whined for 5 mins then settled.' },
  { id: 'i3', date: new Date(Date.now() - 86400000 * 10).toISOString(), trigger: 'Fireworks', severity: 5, notes: 'Panic attack during celebration.' },
];