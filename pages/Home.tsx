import React, { useState } from 'react';
import { Pet, ViewState } from '../types';
import { Bell, Music, Play, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface HomeProps {
  pet: Pet;
  onNavigate: (view: ViewState) => void;
  onPanic: () => void;
}

export const Home: React.FC<HomeProps> = ({ pet, onNavigate, onPanic }) => {
  const [mood, setMood] = useState<number | null>(null);

  const moodEmojis = ['😰', '😕', '😐', '🙂', '😊'];

  const isImage = (url?: string) => url && (url.startsWith('http') || url.startsWith('data:'));

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg overflow-hidden border-2 border-white shadow-sm">
             {isImage(pet.photoUrl) ? (
                <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
                <span>{pet.photoUrl || (pet.type === 'cat' ? '🐱' : '🐶')}</span>
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-text leading-tight">{pet.name}</h1>
            <p className="text-xs text-neutral-subtext">Good Morning!</p>
          </div>
        </div>
        <button className="relative p-2 text-neutral-subtext hover:text-primary transition-colors">
          <Bell size={24} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-status-error rounded-full border border-white"></span>
        </button>
      </header>

      <div className="p-6 space-y-6">
        
        {/* Daily Status */}
        <section className="bg-gradient-to-br from-primary-light/20 to-white p-5 rounded-2xl border border-primary/10 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-text mb-3">How is {pet.name} feeling?</h2>
          <div className="flex justify-between">
            {moodEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => setMood(index + 1)}
                className={`text-2xl p-2 rounded-full transition-all transform ${
                  mood === index + 1 
                    ? 'bg-white shadow-md scale-125' 
                    : 'hover:bg-white/50 hover:scale-110 grayscale opacity-70 hover:grayscale-0 hover:opacity-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onNavigate('SOUNDS')}
            className="p-4 bg-secondary/10 rounded-2xl flex flex-col items-center justify-center gap-2 border border-secondary/20 active:scale-95 transition-all"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm">
              <Music size={24} fill="currentColor" className="opacity-20" />
              <Music size={24} className="absolute" />
            </div>
            <span className="font-semibold text-secondary-dark">Calming Sounds</span>
          </button>
          
          <button 
            onClick={() => onNavigate('TRAINING')}
            className="p-4 bg-accent/10 rounded-2xl flex flex-col items-center justify-center gap-2 border border-accent/20 active:scale-95 transition-all"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-accent shadow-sm">
              <Play size={24} fill="currentColor" className="ml-1" />
            </div>
            <span className="font-semibold text-accent-dark">Training</span>
          </button>
        </section>

        {/* Today's Schedule */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-neutral-text">Today's Schedule</h2>
            <button className="text-xs font-semibold text-primary uppercase tracking-wider">See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 hide-scrollbar">
            <div className="min-w-[140px] p-4 bg-white rounded-xl border border-neutral-100 shadow-sm flex flex-col gap-2">
              <span className="text-xs font-bold text-neutral-subtext">09:00 AM</span>
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Calendar size={16} />
              </div>
              <p className="font-semibold text-sm">Morning Training</p>
            </div>
             <div className="min-w-[140px] p-4 bg-white rounded-xl border border-neutral-100 shadow-sm flex flex-col gap-2">
              <span className="text-xs font-bold text-neutral-subtext">02:00 PM</span>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Music size={16} />
              </div>
              <p className="font-semibold text-sm">Sound Therapy</p>
            </div>
          </div>
        </section>

        {/* Tip of the Day */}
        <section className="bg-accent/10 p-5 rounded-2xl border-l-4 border-accent relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white text-accent-dark text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Tip</span>
            </div>
            <p className="text-sm text-neutral-text font-medium leading-relaxed">
              Playing white noise 15 minutes before a known trigger (like fireworks) can significantly reduce peak anxiety.
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 text-accent opacity-20">
            <Music size={80} />
          </div>
        </section>
      </div>
    </div>
  );
};
