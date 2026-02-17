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
  // --- Nature (self-hosted MP3s) ---
  {
    id: '1',
    title: 'Gentle Rain',
    category: 'Nature',
    duration: 1800,
    isPremium: false,
    color: 'bg-blue-100',
    url: '/sounds/gentle-rain.mp3'
  },
  {
    id: '4',
    title: 'Forest Birds',
    category: 'Nature',
    duration: 2400,
    isPremium: false,
    color: 'bg-emerald-100',
    url: '/sounds/forest-birds.mp3'
  },
  {
    id: '7',
    title: 'Ocean Waves',
    category: 'Nature',
    duration: 2400,
    isPremium: false,
    color: 'bg-cyan-100',
    url: '/sounds/ocean-waves.mp3'
  },
  {
    id: '8',
    title: 'Creek Water',
    category: 'Nature',
    duration: 3600,
    isPremium: false,
    color: 'bg-teal-100',
    url: '/sounds/creek-water.mp3'
  },
  // --- White Noise (generated via Web Audio API) ---
  {
    id: '9',
    title: 'Pure White Noise',
    category: 'White Noise',
    duration: 9999,
    isPremium: false,
    color: 'bg-gray-100',
    url: 'generate:white'
  },
  {
    id: '3',
    title: 'Brown Noise (Deep)',
    category: 'White Noise',
    duration: 9999,
    isPremium: false,
    color: 'bg-rose-100',
    url: 'generate:brown'
  },
  {
    id: '10',
    title: 'Pink Noise (Soft)',
    category: 'White Noise',
    duration: 9999,
    isPremium: false,
    color: 'bg-pink-100',
    url: 'generate:pink'
  },
  // --- Specialized (generated) ---
  {
    id: '5',
    title: 'Deep Sleep Frequencies',
    category: 'Specialized',
    duration: 9999,
    isPremium: false,
    color: 'bg-purple-100',
    url: 'generate:brown'
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

export const DAILY_TIPS = [
  'Playing white noise 15 minutes before a known trigger (like fireworks) can significantly reduce peak anxiety.',
  'Short, positive training sessions (5 minutes) are more effective than long ones. End on a success.',
  'A tired pet is a calm pet. Regular exercise before stressful events can lower baseline anxiety.',
  'Never punish anxious behavior — it increases fear. Reward calm behavior instead.',
  'Create a "safe space" your pet can retreat to. Let them choose when to use it.',
  'Consistency is key. Practice desensitization exercises at the same time each day.',
  'Frozen Kong toys stuffed with peanut butter can redirect anxiety into a positive activity.',
  'Classical music at low volume has been shown to reduce cortisol levels in dogs.',
  'Avoid comforting with excessive petting during panic — it can reinforce the fear response.',
  'Thundershirts and pressure wraps can reduce anxiety by up to 80% in some pets.',
  'Gradual exposure works. Increase trigger intensity by only 5-10% per session.',
  'Keep your own energy calm. Pets mirror their owner\'s emotional state.',
  'Scatter feeding (hiding kibble around the house) engages the brain and reduces stress.',
  'If your pet hides during storms, let them. Forcing them out increases panic.',
];

export const MOCK_INCIDENTS: Incident[] = [
  { id: 'i1', date: new Date(Date.now() - 86400000 * 2).toISOString(), trigger: 'Loud Noises', severity: 4, notes: 'Garbage truck startled him.' },
  { id: 'i2', date: new Date(Date.now() - 86400000 * 5).toISOString(), trigger: 'Separation', severity: 2, notes: 'Whined for 5 mins then settled.' },
  { id: 'i3', date: new Date(Date.now() - 86400000 * 10).toISOString(), trigger: 'Fireworks', severity: 5, notes: 'Panic attack during celebration.' },
];