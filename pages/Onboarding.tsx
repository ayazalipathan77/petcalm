import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Pet } from '../types';
import { TRIGGERS } from '../constants';
import { Dog, Cat, Camera, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (pet: Pet) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Pet>>({
    name: '',
    type: 'dog',
    breed: '',
    triggers: []
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      onComplete({
        id: Math.random().toString(36).substr(2, 9),
        age: 24,
        ...formData
      } as Pet);
    }
  };

  const toggleTrigger = (trigger: string) => {
    const current = formData.triggers || [];
    const newTriggers = current.includes(trigger)
      ? current.filter(t => t !== trigger)
      : [...current, trigger];
    setFormData({ ...formData, triggers: newTriggers });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-neutral-surface to-neutral-bg">
      {/* Progress Bar */}
      <div className="h-1.5 bg-neutral-200 w-full">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="flex-1 px-6 py-8 overflow-y-auto">
        {step === 1 && (
          <div className="flex flex-col items-center animate-fade-in text-center mt-10">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <span className="text-6xl">🐾</span>
            </div>
            <h1 className="text-3xl font-bold text-primary-dark mb-2">Welcome to PetCalm</h1>
            <p className="text-neutral-subtext mb-8 max-w-xs">
              Let's create a personalized calm plan for your furry friend.
            </p>
            <Button onClick={handleNext} size="lg" className="w-full max-w-xs shadow-xl shadow-primary/30">
              Get Started
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-bold text-neutral-text mb-6">Tell us about your pet</h2>
            
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setFormData({...formData, type: 'dog'})}
                className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${formData.type === 'dog' ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
              >
                <Dog size={32} className={formData.type === 'dog' ? 'text-primary' : 'text-neutral-400'} />
                <span className="font-medium text-sm">Dog</span>
              </button>
              <button 
                onClick={() => setFormData({...formData, type: 'cat'})}
                className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${formData.type === 'cat' ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
              >
                <Cat size={32} className={formData.type === 'cat' ? 'text-primary' : 'text-neutral-400'} />
                <span className="font-medium text-sm">Cat</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-subtext mb-1">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. Luna"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-subtext mb-1">Breed (Optional)</label>
                <input 
                  type="text" 
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. Golden Retriever"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-bold text-neutral-text mb-2">What triggers anxiety?</h2>
            <p className="text-neutral-subtext mb-6">Select all that apply to customize training.</p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {TRIGGERS.map((trigger) => {
                const isSelected = formData.triggers?.includes(trigger);
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
          </div>
        )}
      </div>

      {step > 1 && (
        <div className="p-6 bg-white border-t border-neutral-100">
          <Button 
            onClick={handleNext} 
            fullWidth 
            disabled={step === 2 && !formData.name}
          >
            {step === 3 ? "Complete Setup" : "Continue"}
          </Button>
        </div>
      )}
    </div>
  );
};