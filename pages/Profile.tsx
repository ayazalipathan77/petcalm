import React, { useState, useRef } from 'react';
import { Pet, ViewState } from '../types';
import { Button } from '../components/ui/Button';
import { Camera, Save, Check, Trash2, Shield, BookOpen, Crown, Star } from 'lucide-react';
import { TRIGGERS } from '../constants';
import { usePro } from '../context/ProContext';

interface ProfileProps {
  pet: Pet;
  onUpdatePet: (pet: Pet) => void;
  onResetPet: () => void;
  onNavigate: (view: ViewState) => void;
}

const AVATARS = [
  '🐶', '🐱', '🐕', '🐈', '🐩', '🐾', '🐺', '🦊', '🦁', '🐯'
];

export const Profile: React.FC<ProfileProps> = ({ pet, onUpdatePet, onResetPet, onNavigate }) => {
  const { isPro, openPaywall } = usePro();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [name, setName] = useState(pet.name);
  const [breed, setBreed] = useState(pet.breed);
  const [age, setAge] = useState(pet.age);
  const [photoUrl, setPhotoUrl] = useState(pet.photoUrl || '');
  const [triggers, setTriggers] = useState<string[]>(pet.triggers || []);
  const [showSaved, setShowSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 400;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setPhotoUrl(reader.result as string); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhotoUrl(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const toggleTrigger = (trigger: string) => {
    if (triggers.includes(trigger)) {
      setTriggers(triggers.filter(t => t !== trigger));
    } else {
      setTriggers([...triggers, trigger]);
    }
  };

  const handleSave = () => {
    onUpdatePet({
      ...pet,
      name,
      breed,
      age,
      photoUrl,
      triggers
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const isImage = (url: string) => url.startsWith('data:') || url.startsWith('http');

  return (
    <div className="pb-24 pt-6 px-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold text-neutral-text mb-6">Pet Profile</h1>

      <div className="flex-1 overflow-y-auto hide-scrollbar -mx-6 px-6 pb-6">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-white shadow-lg flex items-center justify-center text-5xl overflow-hidden">
               {isImage(photoUrl) ? (
                 <img src={photoUrl} alt="Pet" className="w-full h-full object-cover" />
               ) : (
                 <span>{photoUrl || (pet.type === 'cat' ? '🐱' : '🐶')}</span>
               )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-3 bg-primary text-white rounded-full shadow-md hover:bg-primary-dark transition-colors"
            >
              <Camera size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <p className="text-xs text-neutral-subtext mt-3">Tap camera to upload custom photo</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xs font-bold text-neutral-subtext uppercase tracking-wider mb-3">Or Choose Avatar</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setPhotoUrl(avatar)}
                  className={`w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center text-3xl bg-white border transition-all ${
                    photoUrl === avatar ? 'border-primary bg-primary/10 ring-2 ring-primary/20 scale-110' : 'border-neutral-200 hover:border-primary/50'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-subtext mb-1">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-subtext mb-1">Breed</label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-subtext mb-1">Age (months)</label>
              <input
                type="number"
                min="1"
                max="300"
                value={age}
                onChange={(e) => setAge(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </section>

          <section>
            <label className="block text-sm font-medium text-neutral-subtext mb-3">Anxiety Triggers</label>
            <div className="grid grid-cols-2 gap-3">
              {TRIGGERS.map((trigger) => {
                const isSelected = triggers.includes(trigger);
                return (
                  <button
                    key={trigger}
                    onClick={() => toggleTrigger(trigger)}
                    className={`p-3 rounded-xl text-left text-sm font-medium transition-all relative overflow-hidden ${
                      isSelected 
                        ? 'bg-secondary text-white shadow-md' 
                        : 'bg-white text-neutral-text border border-neutral-200'
                    }`}
                  >
                    {trigger}
                    {isSelected && <Check size={16} className="absolute top-2 right-2 opacity-50" />}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Subscription Status */}
          <section className="pt-4 border-t border-neutral-200">
            {isPro ? (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Crown size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-800 text-sm">Pro Member</span>
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                    </div>
                    <p className="text-xs text-amber-600">All features unlocked</p>
                  </div>
                </div>
                <button
                  onClick={() => window.open('https://play.google.com/store/account/subscriptions', '_blank')}
                  className="text-xs text-amber-600 underline"
                >
                  Manage subscription in Play Store
                </button>
              </div>
            ) : (
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-neutral-text text-sm">Free Plan</p>
                    <p className="text-xs text-neutral-subtext">3 programs · basic sounds · 30-day log</p>
                  </div>
                </div>
                <Button fullWidth onClick={openPaywall} className="gap-2">
                  <Crown size={16} /> Upgrade to Pro
                </Button>
                <p className="text-center text-[10px] text-neutral-400 mt-2">7-day free trial · $34.99/yr or $4.99/mo</p>
              </div>
            )}
          </section>

          {/* Privacy & Legal */}
          <section className="pt-4 border-t border-neutral-200 space-y-3">
            <button
              onClick={() => onNavigate('GUIDE')}
              className="flex items-center gap-2 text-sm text-neutral-subtext hover:text-primary transition-colors"
            >
              <BookOpen size={16} /> Medical & Supplement Guide
            </button>
            <button
              onClick={() => onNavigate('PRIVACY')}
              className="flex items-center gap-2 text-sm text-neutral-subtext hover:text-primary transition-colors"
            >
              <Shield size={16} /> Privacy Policy
            </button>
          </section>

          {/* Reset / Start Over */}
          <section className="pt-4 border-t border-neutral-200">
            {!showResetConfirm ? (
              <button onClick={() => setShowResetConfirm(true)} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors">
                <Trash2 size={16} /> Reset Pet & Start Over
              </button>
            ) : (
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <p className="text-sm text-red-700 font-medium mb-3">This will delete all data including logs, training progress, moods, schedule, and reminders. This cannot be undone.</p>
                <div className="flex gap-3">
                  <Button variant="ghost" fullWidth onClick={() => setShowResetConfirm(false)}>Cancel</Button>
                  <button onClick={onResetPet} className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium text-sm hover:bg-red-600 transition-colors">Delete Everything</button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="pt-4 border-t border-neutral-100">
         <Button onClick={handleSave} fullWidth className="gap-2" disabled={showSaved}>
            {showSaved ? (
                <>Saved Successfully!</>
            ) : (
                <>
                    <Save size={20} />
                    Save Changes
                </>
            )}
          </Button>
      </div>
    </div>
  );
};