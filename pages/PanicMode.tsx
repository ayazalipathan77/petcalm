import React, { useEffect, useRef, useState } from 'react';
import { X, Volume2, CheckCircle2, Hand } from 'lucide-react';
import { MOCK_SOUNDS } from '../constants';
import { isGeneratedNoise } from '../services/audioEngine';

type Technique = 'breathing-444' | 'breathing-478' | 'checklist' | 'ttouch';

interface PanicModeProps {
  onExit: () => void;
  petName: string;
}

const TECHNIQUES: { id: Technique; label: string }[] = [
  { id: 'breathing-444', label: '4-4-4' },
  { id: 'breathing-478', label: '4-7-8' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'ttouch', label: 'TTouch' },
];

const CHECKLIST_ITEMS = [
  'Secure your pet in a quiet, interior room',
  'Close blinds and reduce visual triggers',
  'Turn on white noise or calming sounds',
  'Offer a lick mat or frozen Kong',
  'Apply ThunderShirt if available',
  'Sit calmly nearby — don\'t force interaction',
  'Speak in a low, slow, monotone voice',
  'Wait for signs of relaxation before moving',
];

export const PanicMode: React.FC<PanicModeProps> = ({ onExit, petName }) => {
  const [technique, setTechnique] = useState<Technique>('breathing-444');
  const [stage, setStage] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [counter, setCounter] = useState(4);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(CHECKLIST_ITEMS.length).fill(false));
  const [ttouchTimer, setTtouchTimer] = useState(30);
  const [ttouchSide, setTtouchSide] = useState<'left' | 'right'>('left');
  const [ttouchRunning, setTtouchRunning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Breathing timing configs
  const timings = {
    'breathing-444': { inhale: 4, hold: 4, exhale: 4 },
    'breathing-478': { inhale: 4, hold: 7, exhale: 8 },
  };

  // Play calming audio on mount
  useEffect(() => {
    const calmSound = MOCK_SOUNDS.find(s => s.category === 'Nature' && !isGeneratedNoise(s.url)) || MOCK_SOUNDS[0];
    const audio = new Audio(calmSound.url);
    audio.loop = true;
    audio.volume = 0.8;
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => { audio.pause(); audioRef.current = null; };
  }, []);

  // Breathing timer
  useEffect(() => {
    if (technique !== 'breathing-444' && technique !== 'breathing-478') return;

    const timing = timings[technique];
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev === 1) {
          if (stage === 'inhale') {
            setStage('hold');
            return timing.hold;
          } else if (stage === 'hold') {
            setStage('exhale');
            return timing.exhale;
          } else {
            setStage('inhale');
            return timing.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, technique]);

  // Reset breathing state when switching techniques
  useEffect(() => {
    if (technique === 'breathing-444' || technique === 'breathing-478') {
      const timing = timings[technique];
      setStage('inhale');
      setCounter(timing.inhale);
    }
  }, [technique]);

  // TTouch ear slide timer
  useEffect(() => {
    if (!ttouchRunning) return;

    const timer = setInterval(() => {
      setTtouchTimer(prev => {
        if (prev <= 1) {
          if (ttouchSide === 'left') {
            setTtouchSide('right');
            return 30;
          } else {
            setTtouchRunning(false);
            setTtouchSide('left');
            return 30;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ttouchRunning, ttouchSide]);

  const toggleChecklist = (index: number) => {
    setCheckedItems(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const calmSound = MOCK_SOUNDS.find(s => s.category === 'Nature' && !isGeneratedNoise(s.url)) || MOCK_SOUNDS[0];

  const renderBreathing = () => {
    const isBreathing478 = technique === 'breathing-478';
    const label = isBreathing478 ? '4-7-8 Breathing' : '4-4-4 Breathing';
    const subtitle = isBreathing478 ? 'Deep vagal tone activation' : 'Box breathing';

    return (
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold mb-2">Breathe with {petName}</h2>
        <p className="text-white/70 text-sm mb-6">{label} — {subtitle}</p>

        <div className="relative flex items-center justify-center mb-12">
          <div className={`absolute rounded-full border-4 border-white/30 transition-all duration-[4000ms] ease-in-out ${
            stage === 'inhale' ? 'w-64 h-64 opacity-100' : stage === 'exhale' ? 'w-32 h-32 opacity-50' : 'w-64 h-64 opacity-100'
          }`}></div>

          <div className={`w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all duration-[4000ms] ease-in-out text-rose-500 font-bold text-4xl ${
            stage === 'inhale' ? 'scale-150' : stage === 'exhale' ? 'scale-100' : 'scale-150'
          }`}>
            {counter}
          </div>
        </div>

        <p className="text-2xl font-medium tracking-wide uppercase">
          {stage === 'inhale' ? 'Inhale...' : stage === 'hold' ? 'Hold...' : 'Exhale...'}
        </p>
      </div>
    );
  };

  const renderChecklist = () => (
    <div className="flex flex-col items-center text-center w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-2">Quick Calm Checklist</h2>
      <p className="text-white/70 text-sm mb-6">Step-by-step crisis response</p>

      <div className="w-full space-y-2 text-left">
        {CHECKLIST_ITEMS.map((item, i) => (
          <button
            key={i}
            onClick={() => toggleChecklist(i)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all ${
              checkedItems[i] ? 'bg-white/20' : 'bg-white/10'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
              checkedItems[i] ? 'bg-white text-rose-500' : 'border-2 border-white/50'
            }`}>
              {checkedItems[i] && <CheckCircle2 size={16} />}
            </div>
            <span className={`text-sm text-left leading-snug ${checkedItems[i] ? 'line-through opacity-60' : ''}`}>
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderTtouch = () => (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-2xl font-bold mb-2">TTouch Ear Slides</h2>
      <p className="text-white/70 text-sm mb-6">Gentle ear massage stimulates the vagus nerve</p>

      <div className="relative flex items-center justify-center mb-8">
        <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all ${
          ttouchRunning ? 'bg-white/20 animate-pulse' : 'bg-white/10'
        }`}>
          <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center text-rose-500">
            <Hand size={32} className="mb-1" />
            <span className="text-2xl font-bold">{ttouchTimer}s</span>
          </div>
        </div>
      </div>

      <p className="text-xl font-medium mb-2 uppercase tracking-wide">
        {ttouchSide === 'left' ? 'Left Ear' : 'Right Ear'}
      </p>
      <p className="text-white/70 text-sm mb-6 max-w-xs">
        Gently hold the ear base between thumb and forefinger. Slide from base to tip with light pressure. Repeat slowly.
      </p>

      <button
        onClick={() => {
          if (ttouchRunning) {
            setTtouchRunning(false);
            setTtouchTimer(30);
            setTtouchSide('left');
          } else {
            setTtouchRunning(true);
          }
        }}
        className="px-8 py-3 rounded-full font-bold text-sm transition-all bg-white text-rose-500 hover:scale-105 active:scale-95"
      >
        {ttouchRunning ? 'Reset' : 'Start Timer'}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-gradient-to-br from-rose-500 to-orange-400 text-white flex flex-col items-center justify-between p-6 animate-fade-in">
      {/* Header */}
      <div className="w-full flex justify-between items-start">
        {/* Technique Tabs */}
        <div className="flex gap-1.5 flex-wrap flex-1 mr-3">
          {TECHNIQUES.map(t => (
            <button
              key={t.id}
              onClick={() => setTechnique(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                technique === t.id
                  ? 'bg-white text-rose-500 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={onExit} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors flex-shrink-0">
          <X size={28} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center w-full overflow-y-auto py-4">
        {(technique === 'breathing-444' || technique === 'breathing-478') && renderBreathing()}
        {technique === 'checklist' && renderChecklist()}
        {technique === 'ttouch' && renderTtouch()}
      </div>

      {/* Sound Bar */}
      <div className="w-full bg-white/10 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
          <Volume2 size={24} />
        </div>
        <div>
          <p className="font-bold text-lg">Playing: {calmSound.title}</p>
          <p className="text-white/70 text-sm">Volume set to 80%</p>
        </div>
      </div>
    </div>
  );
};
