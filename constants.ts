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
  'Other Construction',
  'Resource Guarding',
  'Multi-Pet Conflict',
  'Confinement/Crate',
  'Grooming/Handling'
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
    isPremium: true,
    color: 'bg-cyan-100',
    url: '/sounds/ocean-waves.mp3'
  },
  {
    id: '8',
    title: 'Creek Water',
    category: 'Nature',
    duration: 3600,
    isPremium: true,
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
    isPremium: true,
    color: 'bg-pink-100',
    url: 'generate:pink'
  },
  // --- Classical (self-hosted MP3s) ---
  {
    id: '11',
    title: 'Heartbeat (60 BPM)',
    category: 'Classical',
    duration: 1800,
    isPremium: true,
    color: 'bg-red-100',
    url: '/sounds/heartbeat.mp3'
  },
  {
    id: '12',
    title: 'Slow Piano (50 BPM)',
    category: 'Classical',
    duration: 1800,
    isPremium: true,
    color: 'bg-amber-100',
    url: '/sounds/soft-piano.mp3'
  },
  // --- Specialized (generated) ---
  {
    id: '5',
    title: 'Deep Sleep Frequencies',
    category: 'Specialized',
    duration: 9999,
    isPremium: true,
    color: 'bg-purple-100',
    url: 'generate:pink'
  },
  {
    id: '13',
    title: 'Purring Frequency (25 Hz)',
    category: 'Specialized',
    duration: 9999,
    isPremium: true,
    color: 'bg-orange-100',
    url: 'generate:purr'
  },
  {
    id: '14',
    title: 'Binaural Theta (5 Hz)',
    category: 'Specialized',
    duration: 9999,
    isPremium: true,
    color: 'bg-indigo-100',
    url: 'generate:binaural'
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
  {
    id: 'p5',
    title: 'Karen Overall Relaxation Protocol',
    description: 'A 15-day mat-based program teaching your pet to relax on cue, even amid distractions.',
    medicalContext: 'Gold-standard veterinary behaviorist protocol (U Penn). The mat becomes a classically conditioned safety cue via positive reinforcement without activating fear circuits.',
    category: 'Social',
    icon: 'leaf',
    completedStepIndex: 0,
    steps: [
      { id: 1, title: 'Mat Introduction', description: 'Place a mat on the floor. Reward your pet for stepping on it, then for sitting/lying on it. Use high-value treats only on the mat.', duration: '3 Days', tip: 'Use a specific mat ONLY for this protocol — it becomes a portable safe space.' },
      { id: 2, title: 'Handler Movement', description: 'While pet is on the mat, take small steps side-to-side. Reward the pet for staying. Gradually walk further away and return.', duration: '3 Days', tip: 'If they break position, just reset calmly. Never punish — end on success.' },
      { id: 3, title: 'Door & Visitor Distraction', description: 'Practice door opening/closing, doorbell ringing, and a person entering while your pet stays on the mat.', duration: '4 Days', tip: 'Have a helper ring the bell. Treat the pet for staying on the mat before they react.' },
      { id: 4, title: 'Full Environmental Challenge', description: 'Add clapping, jumping, dropping objects, and other everyday distractions while pet maintains relaxation on the mat.', duration: '3 Days', tip: 'Build intensity gradually. A yawn or soft sigh means your pet is genuinely relaxing.' },
      { id: 5, title: 'Generalization', description: 'Move the mat to different rooms, the car, the vet waiting room, or outdoor locations. Practice the full protocol in each new spot.', duration: '2 Days', tip: 'The mat is now a portable calm zone. Bring it everywhere your pet might feel anxious.' }
    ]
  },
  {
    id: 'p6',
    title: 'Stranger/Visitor Desensitization',
    description: 'Teaching your pet that visitors are safe through graduated exposure and counter-conditioning.',
    medicalContext: 'Sub-threshold exposure paired with high-value rewards changes the Conditioned Emotional Response (CER) from fear to neutral/positive. Never force greetings — the pet must choose to approach.',
    category: 'Social',
    icon: 'home',
    completedStepIndex: 0,
    steps: [
      { id: 1, title: 'Management Setup', description: 'Install a baby gate or use a leash so your pet can see visitors but cannot be forced into greetings. Set up a safe retreat area.', duration: '1 Day', tip: 'The gate gives your pet control. Control = reduced anxiety.' },
      { id: 2, title: 'Guest Instruction Protocol', description: 'Brief all visitors: enter calmly, avoid eye contact, ignore the pet, and toss treats on the floor (not toward the pet).', duration: '5 reps', tip: 'The guest predicts food appearing on the floor — without any social pressure.' },
      { id: 3, title: 'Counter-Conditioning at Distance', description: 'The moment a visitor appears, drop high-value treats near your pet. Guest visible = food appears. Guest gone = food stops.', duration: '3 mins', tip: 'This is classical conditioning: stranger predicts chicken. Timing is everything.' },
      { id: 4, title: 'Voluntary Approach', description: 'Allow your pet to approach the seated visitor on their own terms. Visitor offers calm petting on chest (not head) only if pet initiates.', duration: '5 mins', tip: 'If your pet retreats, let them. Every voluntary approach builds confidence.' }
    ]
  },
  {
    id: 'p7',
    title: 'Storm Phobia Protocol',
    description: 'Multi-sensory approach to thunderstorm anxiety — beyond just sound desensitization.',
    medicalContext: 'Storms involve sound, barometric pressure changes, electrostatic buildup, and visual stimuli (lightning). Pure sound DSCC is insufficient — this protocol addresses the full sensory package.',
    category: 'Noise',
    icon: 'sparkles',
    completedStepIndex: 0,
    steps: [
      { id: 1, title: 'Safe Den Construction', description: 'Create a covered den space (3 sides enclosed) with white noise, calming music, and an Adaptil/Feliway diffuser. Place familiar bedding inside.', duration: '1 Day', tip: 'Location matters: away from windows, interior room. Never lock the pet in — access must be voluntary.' },
      { id: 2, title: 'Sound Recording at Sub-Threshold', description: 'Play storm recordings at barely audible volume. Feed meals during playback. Pet should show zero stress signs.', duration: '5 mins', tip: 'If your pet stops eating, the volume is too high. Go lower.' },
      { id: 3, title: 'Multi-Sensory Pairing', description: 'Add flash simulation (TV flickering in another room) while sound plays at low volume. Continue feeding high-value treats.', duration: '5 mins', tip: 'Storms are not just sound. Pair multiple sensory elements together gradually.' },
      { id: 4, title: 'Pressure Wrap Integration', description: 'Practice putting on a ThunderShirt/pressure wrap during calm times. Then wear it during low-level storm playback sessions.', duration: '5 reps', tip: 'Introduce the wrap days before use in a stressor. Never first-time during a real storm.' },
      { id: 5, title: 'Real Storm Management', description: 'When a storm approaches: activate safe den, start calming music, apply pressure wrap, provide lick mat, stay calm. Use weather apps for advance notice.', duration: 'As needed', tip: 'Preparation is everything. Begin setup 30+ minutes before the storm arrives.' }
    ]
  },
  {
    id: 'p8',
    title: 'TTouch Massage for Anxiety',
    description: 'Light-pressure bodywork technique that engages the parasympathetic nervous system.',
    medicalContext: 'Tellington TTouch produces different brain wave patterns than conventional petting — simultaneously calming and maintaining alertness (ideal for learning). VCA-recognized behavioral tool.',
    category: 'Cooperative Care',
    icon: 'leaf',
    completedStepIndex: 0,
    steps: [
      { id: 1, title: 'Clouded Leopard Circle', description: 'Use finger pads (not tips) in a 1.25-circle clockwise motion on your pet\'s shoulder. Light pressure — just enough to move skin, not push through it.', duration: '5 mins', tip: 'Think of a clock face on your pet\'s skin. Start at 6, circle past 6 to 9. Lift and move to next spot.' },
      { id: 2, title: 'Ear Slides (Vagus Nerve)', description: 'Gently slide from the base to the tip of each ear using thumb and forefinger. Slow, steady strokes.', duration: '3 mins', tip: 'Ear slides are particularly calming — they stimulate acupuncture points connected to the vagus nerve.' },
      { id: 3, title: 'Full Body Mapping', description: 'Starting at the shoulders, work TTouch circles across the chest, along the back, and down the sides. Skip sensitive areas.', duration: '10 mins', tip: 'Watch for calming signals: yawning, blinking, lip licking, soft eyes = it\'s working.' },
      { id: 4, title: 'Tail & Paw Work', description: 'For tail-tuckers: gentle circles at the tail base. For paw-sensitive pets: TTouch circles on the top of the paw (not pads).', duration: '5 mins', tip: 'These are sensitive areas. Go slower, lighter pressure. Stop if the pet moves away.' },
      { id: 5, title: 'Pre-Stressor Routine', description: 'Before a known trigger (vet visit, storm, guests), do a 5-minute TTouch session: ear slides + shoulder circles + body scan.', duration: '5 mins', tip: 'Make this a ritual. Consistency builds a conditioned relaxation response over time.' }
    ]
  },
  {
    id: 'p9',
    title: 'Nose Work / Scent Enrichment',
    description: 'Confidence-building scent work that activates the parasympathetic nervous system.',
    medicalContext: 'Research shows sniffing (especially with lowered head) measurably reduces heart rate and cortisol. Every successful "find" produces dopamine, building confidence in fearful pets.',
    category: 'Social',
    icon: 'sparkles',
    completedStepIndex: 0,
    steps: [
      { id: 1, title: 'Box Search Basics', description: 'Place 5-8 boxes in a room. Hide a high-value treat in one box. Let your pet freely investigate and find the reward.', duration: '5 mins', tip: 'Let the pet work at their own pace. Never point, guide, or hurry them.' },
      { id: 2, title: 'Odor Introduction', description: 'Place birch essential oil on a cotton swab inside a small tin with holes. Pair the tin with food: pet sniffs tin = treat appears.', duration: '10 reps', tip: 'Birch oil is the standard K9 Nose Work starter odor. Use only 1-2 drops.' },
      { id: 3, title: 'Room Searches', description: 'Hide the scented tin in increasingly creative locations around a room — on shelves, behind furniture, in containers. Reward every find.', duration: '10 mins', tip: '15 minutes of scent work equals 60 minutes of physical exercise for mental fatigue.' },
      { id: 4, title: 'Novel Environment Confidence', description: 'Move the search to new rooms, the yard, or (for advanced dogs) outdoor areas. The searching behavior itself becomes a confidence builder.', duration: '10 mins', tip: 'Anxious dogs often transform during nose work — the self-directed success builds resilience.' }
    ]
  },
  {
    id: 'p10',
    title: 'Fear Free Vet Visit Prep',
    description: 'Complete protocol for reducing veterinary visit anxiety using Fear Free principles.',
    medicalContext: 'Based on Fear Free certification standards. Consent-based handling (chin rest/bucket game) gives the animal control, which is the fundamental antidote to helplessness-induced anxiety.',
    category: 'Cooperative Care',
    icon: 'leaf',
    completedStepIndex: 0,
    steps: [
      { id: 1, title: 'Carrier Acclimation', description: 'Leave carrier out with door open and familiar bedding inside. Feed meals in/near the carrier. Add Feliway/Adaptil spray. Goal: carrier = comfort zone.', duration: '1 Week', tip: 'For cats: spray Feliway 15 mins before carrier use. For dogs: Adaptil collar.' },
      { id: 2, title: 'Happy Visits', description: 'Visit the vet clinic just for treats. Walk in, get fed high-value food by staff, leave. No examination. Repeat weekly.', duration: '3 visits', tip: 'Call your vet ahead — most Fear Free practices encourage happy visits.' },
      { id: 3, title: 'Pre-Visit Medication Test', description: 'If prescribed gabapentin or trazodone, give a test dose at home on a normal day. Observe effects for 6-8 hours.', duration: '1 Day', tip: 'NEVER give a new medication for the first time on the day of a stressful event. Always test first.' },
      { id: 4, title: 'Exam Simulation', description: 'Practice cooperative care at home: chin rest on your hand, gentle ear lifting, paw handling, brief restraint. Reward throughout.', duration: '5 mins', tip: 'Teach a "chin rest" — while their chin rests on your hand, handling continues. If they lift their chin, you stop.' },
      { id: 5, title: 'Full Visit Protocol', description: 'Day of visit: give medication 90-120 mins prior, use pheromone spray in carrier, bring treats and a familiar blanket. Request minimal restraint.', duration: 'Visit day', tip: 'Ask for a quiet room, non-slip exam surface, and permission to feed treats during the exam.' }
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
  'Lick mats stimulate endorphin release through repetitive licking — great during storms or vet visits.',
  '15 minutes of snuffle mat activity provides mental fatigue equivalent to a 60-minute walk.',
  'Cats respond best to species-specific music with purring rhythms and birdsong melodies, not human music.',
  'Research shows reggae and soft rock are the most calming genres for dogs — rotate playlists to prevent habituation.',
  'Nose work builds confidence: every successful "find" produces a dopamine reward in anxious pets.',
  'Start carrier acclimation weeks before vet visits — leave the carrier open with treats inside daily.',
  'Pre-vet medication (gabapentin) should be test-dosed at home first, never on the day of a stressful visit.',
  'Karen Overall\'s mat protocol: the mat becomes a portable "safe space" your pet can use anywhere.',
  'TTouch ear slides stimulate acupuncture points connected to the vagus nerve — try them for instant calming.',
  'Place an Adaptil diffuser in your dog\'s safe space and replace the refill monthly for best results.',
  'DISHAA signs in senior pets (disorientation, sleep changes, new anxiety) may indicate cognitive decline — see your vet.',
  'Cooperative care: teach a "chin rest" so your pet can consent to handling. Chin down = continue. Chin up = stop.',
  'The 1-2-3 Pattern Game: count rhythmically while treating. Predictability is inherently calming for anxious pets.',
  'Resource guarding tip: provide N+1 of everything (bowls, beds, toys) in multi-pet households.',
];

export const BREED_TIPS: Record<string, string[]> = {
  // Dogs
  'Border Collie': [
    'Border Collies need 2+ hours of mental stimulation daily — nose work and puzzle feeders prevent anxiety-driven herding behaviors.',
    'Provide a "job" for your Border Collie: learning new tricks or agility drills dramatically reduces generalized anxiety.',
  ],
  'German Shepherd': [
    'German Shepherds are prone to separation anxiety. Crate training from puppyhood creates a reliable safe haven.',
    'Daily obedience training sessions (15 mins) satisfy a German Shepherd\'s working drive and reduce baseline anxiety.',
  ],
  'Labrador Retriever': [
    'Labs are highly food motivated — use high-value treats during desensitization to increase effectiveness.',
    'Labradors prone to storm anxiety often benefit from a ThunderShirt combined with a white noise machine.',
  ],
  'Golden Retriever': [
    'Golden Retrievers are sensitive to human emotions — keep your own energy calm during anxiety episodes.',
    'Goldens respond well to TTouch massage, especially ear slides, before known stressors like vet visits.',
  ],
  'French Bulldog': [
    'French Bulldogs are brachycephalic — avoid exercise in heat, which can amplify anxiety due to breathing difficulty.',
    'Frenchies can develop noise sensitivity early. Start sound desensitization by 12 weeks of age.',
  ],
  'Chihuahua': [
    'Chihuahuas often exhibit anxiety-driven reactivity. Avoid forcing interactions — let them approach on their own terms.',
    'Small dog anxiety is often under-treated. Chihuahuas benefit from the same behavior protocols as larger breeds.',
  ],
  'Poodle': [
    'Poodles are highly intelligent and thrive on mental enrichment. Boredom is a leading cause of anxiety in this breed.',
    'Standard Poodles are prone to separation anxiety — practice short absences before gradually extending them.',
  ],
  'Beagle': [
    'Beagles are scent hounds — nose work is particularly effective at reducing their anxiety and building confidence.',
    'Beagle howling during separation is often anxiety-driven. Treat dispensers can bridge short absences.',
  ],
  'Dachshund': [
    'Dachshunds can develop resource guarding anxiety. Provide N+1 resources in multi-pet homes.',
    'Dachshunds respond well to crate training with a covered, den-like environment that mimics a burrow.',
  ],
  'Shih Tzu': [
    'Shih Tzus are companion breeds and may show distress when left alone — gradual independence training helps.',
    'Regular grooming can be a trigger — start cooperative care (chin rest, handling exercises) from puppyhood.',
  ],
  // Cats
  'Siamese': [
    'Siamese cats are highly vocal when anxious — respond to vocalizations calmly to avoid reinforcing distress.',
    'Siamese cats benefit from environmental enrichment: window perches, puzzle feeders, and interactive play sessions.',
  ],
  'Maine Coon': [
    'Maine Coons are social cats that can develop separation anxiety — consider a companion pet if you\'re often away.',
    'Maine Coons respond well to routine. Consistent feeding and play schedules reduce baseline anxiety.',
  ],
  'Persian': [
    'Persian cats are stress-sensitive — minimize changes to their environment and routine.',
    'Persian cats benefit from Feliway diffusers, especially during household changes or introduction of new pets.',
  ],
  'Bengal': [
    'Bengal cats need 2+ hours of active play daily. Unmet energy needs manifest as anxiety and destructive behavior.',
    'Bengals are highly territorial — provide vertical space (cat trees, shelves) to reduce inter-cat conflict anxiety.',
  ],
  'Ragdoll': [
    'Ragdolls tend to freeze rather than flee when anxious. Watch for subtle stress signals like changed whisker position.',
    'Ragdolls do well with TTouch bodywork — their calm temperament makes them ideal cooperative care candidates.',
  ],
};

export const COMMUNITY_TIPS: string[] = [
  '"Frozen Kong with peanut butter + kibble is the only thing that calms my Border Collie during thunderstorms." — Border Collie owner',
  '"We put an old worn t-shirt in our dog\'s crate when we leave. The familiar scent keeps her calm for hours." — Golden Retriever owner',
  '"Playing YouTube fireplace videos with white noise helped our rescue cat through the first month in our home." — Cat adopter',
  '"The departure cue protocol changed everything. After 2 weeks, my dog stopped pacing when I picked up my keys." — Labrador owner',
  '"We do 10 minutes of nose work before any vet visit. It lowers anxiety before we even get in the car." — Beagle owner',
  '"Feliway diffuser + classical music playlist = our anxious Siamese went from hiding all day to joining us on the couch." — Siamese owner',
  '"Our vet prescribed gabapentin for vet visits. The test dose at home first was essential — it made him sleepy but calm." — Senior dog owner',
  '"TTouch ear slides before nail trims — my cat used to fight and now she just sits there. Took 3 weeks of practice." — Persian cat owner',
];

export const MOCK_INCIDENTS: Incident[] = [
  { id: 'i1', date: new Date(Date.now() - 86400000 * 2).toISOString(), trigger: 'Loud Noises', severity: 4, notes: 'Garbage truck startled him.' },
  { id: 'i2', date: new Date(Date.now() - 86400000 * 5).toISOString(), trigger: 'Separation', severity: 2, notes: 'Whined for 5 mins then settled.' },
  { id: 'i3', date: new Date(Date.now() - 86400000 * 10).toISOString(), trigger: 'Fireworks', severity: 5, notes: 'Panic attack during celebration.' },
];