import React from 'react';
import { MOCK_PROGRAMS } from '../constants';
import { ChevronRight, Sparkles, Home, Car, Lock } from 'lucide-react';

export const Training: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles': return <Sparkles size={20} />;
      case 'home': return <Home size={20} />;
      case 'car': return <Car size={20} />;
      default: return <Sparkles size={20} />;
    }
  };

  return (
    <div className="pb-24 pt-6 px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-text mb-2">Training Programs</h1>
        <p className="text-neutral-subtext text-sm">Scientifically designed desensitization courses.</p>
      </div>

      {/* Featured / Active */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-neutral-subtext uppercase tracking-wider mb-3">In Progress</h2>
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
           <div className="flex justify-between items-start mb-4">
              <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                 {getIcon('sparkles')}
              </div>
              <span className="text-xs font-bold bg-neutral-100 px-2 py-1 rounded text-neutral-500">Step 3 of 8</span>
           </div>
           <h3 className="font-bold text-lg text-neutral-text mb-1">Fireworks Desensitization</h3>
           <p className="text-sm text-neutral-subtext mb-4">Next: Low volume introduction</p>
           
           <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
             <div className="bg-primary h-full rounded-full" style={{ width: '37%' }}></div>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-bold text-neutral-subtext uppercase tracking-wider">All Programs</h2>
        {MOCK_PROGRAMS.filter(p => p.id !== 'p1').map(program => (
          <div key={program.id} className="bg-white p-4 rounded-2xl border border-neutral-100 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer group">
            <div className={`p-3 rounded-xl ${program.completedSteps === 0 ? 'bg-neutral-100 text-neutral-400' : 'bg-secondary/10 text-secondary'}`}>
              {getIcon(program.icon)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-neutral-text text-sm">{program.title}</h3>
              <p className="text-xs text-neutral-subtext">{program.totalSteps} sessions • {program.description}</p>
            </div>
            {program.id === 'p2' ? (
                <Lock size={16} className="text-neutral-300" />
            ) : (
                <ChevronRight size={20} className="text-neutral-300 group-hover:text-primary transition-colors" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
