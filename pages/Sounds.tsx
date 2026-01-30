import React, { useState } from 'react';
import { MOCK_SOUNDS } from '../constants';
import { Play, Pause, Heart, Lock } from 'lucide-react';

export const Sounds: React.FC = () => {
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Nature', 'Classical', 'Specialized'];

  const handlePlay = (id: string) => {
    if (activeSoundId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveSoundId(id);
      setIsPlaying(true);
    }
  };

  const filteredSounds = category === 'All' 
    ? MOCK_SOUNDS 
    : MOCK_SOUNDS.filter(s => s.category === category);

  return (
    <div className="pb-24 pt-6 px-6">
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
      <div className="grid grid-cols-2 gap-4">
        {filteredSounds.map(sound => (
          <div key={sound.id} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all" onClick={() => handlePlay(sound.id)}>
            <div className={`absolute inset-0 ${sound.color} opacity-50 group-hover:opacity-60 transition-opacity`}></div>
            {/* Abstract visual */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/30 rounded-full blur-xl"></div>
            </div>
            
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 {sound.isPremium && <Lock size={16} className="text-neutral-subtext" />}
                 <Heart size={16} className="text-white ml-auto" />
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
                <p className="text-[10px] text-neutral-subtext font-medium uppercase tracking-wide">{Math.floor(sound.duration / 60)} mins</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mini Player */}
      {activeSoundId && (
        <div className="fixed bottom-20 left-4 right-4 bg-neutral-text rounded-2xl p-4 shadow-2xl flex items-center gap-4 z-40 text-white animate-slide-up">
           <div className={`w-10 h-10 rounded-lg ${MOCK_SOUNDS.find(s => s.id === activeSoundId)?.color} opacity-80 animate-pulse`}></div>
           <div className="flex-1 min-w-0">
             <h4 className="font-bold text-sm truncate">{MOCK_SOUNDS.find(s => s.id === activeSoundId)?.title}</h4>
             <p className="text-xs text-gray-400">Playing now...</p>
           </div>
           <button onClick={() => setIsPlaying(!isPlaying)} className="p-2">
             {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
           </button>
        </div>
      )}
    </div>
  );
};
