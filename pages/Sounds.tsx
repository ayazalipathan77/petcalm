import React, { useState, useEffect, useRef } from 'react';
import { MOCK_SOUNDS } from '../constants';
import { Play, Pause, Heart, Lock, Volume1, Sliders, X, Gauge, WifiOff, Timer, Zap } from 'lucide-react';
import { NoiseGenerator, isGeneratedNoise, getNoiseType } from '../services/audioEngine';
import { useSetting } from '../services/db';

export const Sounds: React.FC = () => {
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [category, setCategory] = useState('All');

  // Favorites via Dexie
  const { value: favorites, save: saveFavorites, loaded: favoritesLoaded } = useSetting<string[]>('sound_favorites', []);

  // Audio Controls State
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showControls, setShowControls] = useState(false);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const sleepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Dual Audio Engine
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const noiseRef = useRef<NoiseGenerator | null>(null);

  const activeSound = MOCK_SOUNDS.find(s => s.id === activeSoundId);
  const isNoise = activeSound ? isGeneratedNoise(activeSound.url) : false;

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    saveFavorites(updated);
  };

  const categories = ['All', 'Favorites', 'Nature', 'Classical', 'White Noise', 'Specialized'];
  const speeds = [0.5, 1.0, 1.25, 1.5];
  const timerOptions = [null, 15, 30, 60];

  const stopAll = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (noiseRef.current) { noiseRef.current.stop(); noiseRef.current = null; }
  };

  const startSleepTimer = (minutes: number | null) => {
    if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    if (minutes === null) { setSleepTimer(null); return; }
    setSleepTimer(minutes);
    sleepTimerRef.current = setInterval(() => {
      setSleepTimer(prev => {
        if (prev === null || prev <= 1) {
          if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
          stopAll();
          setIsPlaying(false);
          return null;
        }
        return prev - 1;
      });
    }, 60000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll();
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    };
  }, []);

  // Handle track changes
  useEffect(() => {
    const sound = MOCK_SOUNDS.find(s => s.id === activeSoundId);
    if (!sound) {
      stopAll();
      return;
    }

    // Stop previous audio
    stopAll();

    if (isGeneratedNoise(sound.url)) {
      // Web Audio API path
      const gen = new NoiseGenerator();
      noiseRef.current = gen;
      // Don't play yet - let the control effect handle it
    } else {
      // HTMLAudioElement path
      const audio = new Audio(sound.url);
      audio.loop = true;
      audioRef.current = audio;
    }
  }, [activeSoundId]);

  // Handle play/pause + volume + speed
  useEffect(() => {
    const sound = MOCK_SOUNDS.find(s => s.id === activeSoundId);
    if (!sound) return;

    if (isGeneratedNoise(sound.url)) {
      const gen = noiseRef.current;
      if (!gen) return;

      if (isPlaying) {
        if (gen.isPlaying) {
          gen.resume();
        } else {
          gen.play(getNoiseType(sound.url), volume / 100);
        }
      } else {
        gen.pause();
      }
      gen.setVolume(volume / 100);
    } else {
      const audio = audioRef.current;
      if (!audio) return;

      audio.volume = volume / 100;
      audio.playbackRate = playbackSpeed;

      if (isPlaying) {
        audio.play().catch(err => console.error("Playback failed:", err));
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, volume, playbackSpeed, activeSoundId]);

  const handlePlay = (id: string) => {
    if (activeSoundId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveSoundId(id);
      setIsPlaying(true);
      setShowControls(false);
    }
  };

  const filteredSounds = category === 'All'
    ? MOCK_SOUNDS
    : category === 'Favorites'
    ? MOCK_SOUNDS.filter(s => favorites.includes(s.id))
    : MOCK_SOUNDS.filter(s => s.category === category);

  return (
    <div className="pb-24 pt-6 px-6 relative min-h-full">
      <h1 className="text-2xl font-bold text-neutral-text mb-6">Calming Sounds</h1>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar mb-4">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              category === c
                ? 'bg-secondary text-white shadow-md'
                : 'bg-white text-neutral-subtext border border-neutral-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 pb-20">
        {filteredSounds.map(sound => {
          const isGenerated = isGeneratedNoise(sound.url);
          return (
            <div key={sound.id} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all" onClick={() => handlePlay(sound.id)}>
              <div className={`absolute inset-0 ${sound.color} opacity-50 group-hover:opacity-60 transition-opacity`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/30 rounded-full blur-xl"></div>
              </div>

              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   {sound.isPremium && <Lock size={16} className="text-neutral-subtext" />}
                   <button onClick={(e) => toggleFavorite(sound.id, e)} className="ml-auto">
                     <Heart size={16} className={favorites.includes(sound.id) ? 'text-rose-500 fill-rose-500' : 'text-white'} />
                   </button>
                </div>

                <div className="flex items-center justify-center">
                   <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform ${activeSoundId === sound.id && isPlaying ? 'scale-110' : 'scale-100'}`}>
                      {activeSoundId === sound.id && isPlaying ? (
                         <Pause size={20} className="text-secondary" fill="currentColor" />
                      ) : (
                         <Play size={20} className="text-secondary ml-1" fill="currentColor" />
                      )}
                   </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-neutral-text leading-tight mb-0.5">{sound.title}</h3>
                  <div className="flex justify-between items-center">
                      {isGenerated ? (
                        <div className="flex gap-1 text-[10px] text-secondary bg-white/50 px-1.5 py-0.5 rounded-full font-medium">
                          <Zap size={10} className="mt-0.5" /> Generated
                        </div>
                      ) : (
                        <p className="text-[10px] text-neutral-subtext font-medium uppercase tracking-wide">
                          {sound.duration >= 9999 ? '∞' : `${Math.floor(sound.duration / 60)} mins`}
                        </p>
                      )}
                      <div className="flex gap-1 text-[10px] text-neutral-500 bg-white/50 px-1.5 py-0.5 rounded-full">
                          <WifiOff size={10} className="mt-0.5" /> Offline
                      </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini Player & Controls */}
      {activeSoundId && (
        <div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center pointer-events-none">
           <div className="w-full max-w-md px-6 pointer-events-auto">
             <div className="relative">

               {/* Expandable Controls Panel */}
               {showControls && (
                 <div className="absolute bottom-full mb-3 left-0 right-0 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-neutral-200 animate-slide-up origin-bottom">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xs font-bold text-neutral-subtext uppercase tracking-wider">Audio Settings</h3>
                     <button onClick={() => setShowControls(false)} className="text-neutral-400 hover:text-neutral-text">
                       <X size={16} />
                     </button>
                   </div>

                   {/* Volume Slider */}
                   <div className="mb-4">
                     <div className="flex justify-between text-xs text-neutral-500 mb-2">
                        <span className="flex items-center gap-1"><Volume1 size={14} /> Volume</span>
                        <span className="font-medium">{volume}%</span>
                     </div>
                     <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                     />
                   </div>

                   {/* Speed Control - only for file-based sounds */}
                   {!isNoise && (
                     <div className="mb-4">
                        <div className="flex items-center gap-1 text-xs text-neutral-500 mb-2">
                          <Gauge size={14} /> Playback Speed
                        </div>
                        <div className="flex bg-neutral-100 p-1 rounded-xl">
                          {speeds.map(s => (
                            <button
                              key={s}
                              onClick={() => setPlaybackSpeed(s)}
                              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                playbackSpeed === s
                                  ? 'bg-white text-secondary shadow-sm'
                                  : 'text-neutral-400 hover:text-neutral-600'
                              }`}
                            >
                              {s}x
                            </button>
                          ))}
                        </div>
                     </div>
                   )}

                   {/* Sleep Timer */}
                   <div>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 mb-2">
                        <Timer size={14} /> Sleep Timer {sleepTimer !== null && <span className="text-secondary font-bold">({sleepTimer}m left)</span>}
                      </div>
                      <div className="flex bg-neutral-100 p-1 rounded-xl">
                        {timerOptions.map(t => (
                          <button
                            key={t ?? 'off'}
                            onClick={() => startSleepTimer(t)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                              sleepTimer === t || (t === null && sleepTimer === null)
                                ? 'bg-white text-secondary shadow-sm'
                                : 'text-neutral-400 hover:text-neutral-600'
                            }`}
                          >
                            {t === null ? 'Off' : `${t}m`}
                          </button>
                        ))}
                      </div>
                   </div>
                 </div>
               )}

               {/* Main Player Bar */}
               <div className="bg-neutral-text rounded-2xl p-3 pl-4 shadow-2xl flex items-center gap-3 text-white">
                  <div className={`w-10 h-10 rounded-lg ${activeSound?.color} opacity-80 flex items-center justify-center`}>
                    <div className={`w-2 bg-white/50 rounded-full animate-bounce ${isPlaying ? 'h-4' : 'h-1'}`} style={{animationDelay: '0ms'}}></div>
                    <div className={`w-2 bg-white/50 rounded-full animate-bounce mx-0.5 ${isPlaying ? 'h-6' : 'h-1'}`} style={{animationDelay: '150ms'}}></div>
                    <div className={`w-2 bg-white/50 rounded-full animate-bounce ${isPlaying ? 'h-3' : 'h-1'}`} style={{animationDelay: '300ms'}}></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{activeSound?.title}</h4>
                    <p className="text-[10px] text-gray-400 flex items-center gap-2">
                      {isNoise ? (
                        <span>Generated</span>
                      ) : (
                        <span>{playbackSpeed}x Speed</span>
                      )}
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span>Vol: {volume}%</span>
                      {sleepTimer !== null && (<><span className="w-1 h-1 bg-gray-600 rounded-full"></span><span>{sleepTimer}m</span></>)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowControls(!showControls)}
                      className={`p-2 rounded-full transition-colors ${showControls ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Sliders size={20} />
                    </button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-white text-neutral-text rounded-full hover:scale-105 active:scale-95 transition-all">
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                    </button>
                  </div>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
