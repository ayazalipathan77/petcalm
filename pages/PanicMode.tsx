import React, { useEffect, useRef, useState } from 'react';
import { X, Volume2 } from 'lucide-react';
import { MOCK_SOUNDS } from '../constants';
import { isGeneratedNoise } from '../services/audioEngine';

interface PanicModeProps {
  onExit: () => void;
  petName: string;
}

export const PanicMode: React.FC<PanicModeProps> = ({ onExit, petName }) => {
  const [stage, setStage] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [counter, setCounter] = useState(4);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play calming audio on mount - use first file-based Nature sound
  useEffect(() => {
    const calmSound = MOCK_SOUNDS.find(s => s.category === 'Nature' && !isGeneratedNoise(s.url)) || MOCK_SOUNDS[0];
    const audio = new Audio(calmSound.url);
    audio.loop = true;
    audio.volume = 0.8;
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => { audio.pause(); audioRef.current = null; };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev === 1) {
          if (stage === 'inhale') {
            setStage('hold');
            return 4;
          } else if (stage === 'hold') {
            setStage('exhale');
            return 4;
          } else {
            setStage('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage]);

  return (
    <div className="fixed inset-0 z-[60] bg-gradient-to-br from-rose-500 to-orange-400 text-white flex flex-col items-center justify-between p-8 animate-fade-in">
      <div className="w-full flex justify-end">
        <button onClick={onExit} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
          <X size={32} />
        </button>
      </div>

      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold mb-8">Breathe with {petName}</h2>
        
        {/* Breathing Animation Circle */}
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

      <div className="w-full bg-white/10 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
           <Volume2 size={24} />
        </div>
        <div>
          <p className="font-bold text-lg">Playing: {(MOCK_SOUNDS.find(s => s.category === 'Nature') || MOCK_SOUNDS[0]).title}</p>
          <p className="text-white/70 text-sm">Volume set to 80%</p>
        </div>
      </div>
    </div>
  );
};
