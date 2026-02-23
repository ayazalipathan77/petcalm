import React from 'react';
import { Pet } from '../types';
import { PlusCircle } from 'lucide-react';

interface PetSwitcherProps {
  pets: Pet[];
  activePetId: string | null;
  onSwitch: (id: string) => void;
  onAdd?: () => void;
}

const isImage = (url?: string) => url && (url.startsWith('http') || url.startsWith('data:'));

export const PetSwitcher: React.FC<PetSwitcherProps> = ({ pets, activePetId, onSwitch, onAdd }) => {
  return (
    <div className="flex gap-1.5 mt-1 items-center">
      {pets.map(p => (
        <button
          key={p.id}
          onClick={() => onSwitch(p.id)}
          title={p.name}
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs overflow-hidden border-2 transition-all ${
            p.id === activePetId
              ? 'border-primary shadow-sm scale-110'
              : 'border-neutral-200 opacity-60 hover:opacity-90'
          }`}
        >
          {isImage(p.photoUrl) ? (
            <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
          ) : (
            <span>{p.photoUrl || (p.type === 'cat' ? '🐱' : '🐶')}</span>
          )}
        </button>
      ))}
      {onAdd && (
        <button
          onClick={onAdd}
          title="Add another pet"
          className="w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 hover:text-primary transition-colors"
        >
          <PlusCircle size={16} />
        </button>
      )}
    </div>
  );
};
