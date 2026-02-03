import React, { useState } from 'react';
import { MOCK_PROGRAMS } from '../constants';
import { TrainingProgram } from '../types';
import { ChevronRight, Sparkles, Home, Car, Lock, CheckCircle, ArrowLeft, Info, Leaf, PlayCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Training: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [localPrograms, setLocalPrograms] = useState(MOCK_PROGRAMS);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles': return <Sparkles size={20} />;
      case 'home': return <Home size={20} />;
      case 'car': return <Car size={20} />;
      case 'leaf': return <Leaf size={20} />;
      default: return <Sparkles size={20} />;
    }
  };

  const handleCompleteStep = (programId: string, stepIndex: number) => {
    // In a real app, this would save to backend
    const updated = localPrograms.map(p => {
      if (p.id === programId) {
        // Only advance if we are completing the current active step
        const newIndex = stepIndex === p.completedStepIndex ? p.completedStepIndex + 1 : p.completedStepIndex;
        const updatedProgram = { ...p, completedStepIndex: newIndex };
        if (selectedProgram?.id === programId) setSelectedProgram(updatedProgram);
        return updatedProgram;
      }
      return p;
    });
    setLocalPrograms(updated);
  };

  if (selectedProgram) {
    const progress = (selectedProgram.completedStepIndex / selectedProgram.steps.length) * 100;
    
    return (
      <div className="bg-neutral-bg min-h-full pb-24">
        {/* Detail Header */}
        <div className="bg-white px-6 py-6 border-b border-neutral-100 sticky top-0 z-30 shadow-sm">
          <button 
            onClick={() => setSelectedProgram(null)}
            className="flex items-center text-neutral-subtext text-sm mb-4 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Programs
          </button>
          
          <div className="flex items-start justify-between gap-4">
            <div>
               <h1 className="text-2xl font-bold text-neutral-text leading-tight mb-2">{selectedProgram.title}</h1>
               <div className="flex items-center gap-2">
                 <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                   {selectedProgram.category}
                 </span>
                 <span className="text-xs text-neutral-400">
                   {selectedProgram.steps.length} Steps
                 </span>
               </div>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
               {getIcon(selectedProgram.icon)}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Scientific Context */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-8">
            <div className="flex items-start gap-3">
               <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
               <div>
                 <h3 className="text-sm font-bold text-blue-800 mb-1">Clinical Context</h3>
                 <p className="text-sm text-blue-700 leading-relaxed opacity-90">
                   {selectedProgram.medicalContext}
                 </p>
               </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-neutral-text">Curriculum</h2>
            <span className="text-xs font-bold text-primary">{Math.round(progress)}% Complete</span>
          </div>

          {/* Steps Timeline */}
          <div className="relative space-y-8 pl-4">
            {/* Vertical Line */}
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-neutral-200"></div>

            {selectedProgram.steps.map((step, index) => {
              const isLocked = index > selectedProgram.completedStepIndex;
              const isCompleted = index < selectedProgram.completedStepIndex;
              const isCurrent = index === selectedProgram.completedStepIndex;

              return (
                <div key={step.id} className={`relative flex gap-4 ${isLocked ? 'opacity-50 grayscale' : ''}`}>
                  {/* Status Indicator */}
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 bg-neutral-bg
                    ${isCompleted ? 'border-primary bg-primary text-white' : isCurrent ? 'border-primary text-primary' : 'border-neutral-300 text-neutral-300'}
                  `}>
                    {isCompleted ? <CheckCircle size={14} /> : isLocked ? <Lock size={12} /> : <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 p-4 rounded-xl border ${isCurrent ? 'bg-white border-primary shadow-md ring-1 ring-primary/10' : 'bg-white border-neutral-200'}`}>
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-neutral-text">{step.title}</h3>
                        <span className="text-[10px] font-bold bg-neutral-100 px-2 py-0.5 rounded text-neutral-500 whitespace-nowrap">
                          {step.duration}
                        </span>
                     </div>
                     <p className="text-sm text-neutral-subtext mb-3 leading-relaxed">{step.description}</p>
                     
                     <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex gap-2 mb-4">
                        <Sparkles size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-800 font-medium italic">"{step.tip}"</p>
                     </div>

                     {isCurrent && (
                       <Button 
                         size="sm" 
                         fullWidth 
                         onClick={() => handleCompleteStep(selectedProgram.id, index)}
                         className="flex items-center gap-2"
                       >
                         Mark Complete <ChevronRight size={14} />
                       </Button>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="pb-24 pt-6 px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-text mb-2">Training Programs</h1>
        <p className="text-neutral-subtext text-sm">Scientifically backed DSCC protocols.</p>
      </div>

      <div className="space-y-4">
        {localPrograms.map(program => {
           const isStarted = program.completedStepIndex > 0;
           const progress = (program.completedStepIndex / program.steps.length) * 100;
           
           return (
            <div 
              key={program.id} 
              onClick={() => setSelectedProgram(program)}
              className="bg-white p-4 rounded-2xl border border-neutral-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
            >
              {isStarted && (
                <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
              )}
              
              <div className="flex items-start gap-4 mb-3">
                <div className={`p-3 rounded-xl ${isStarted ? 'bg-secondary/10 text-secondary' : 'bg-neutral-100 text-neutral-400'}`}>
                  {getIcon(program.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-neutral-text text-sm mb-1">{program.title}</h3>
                    {isStarted ? (
                       <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">{Math.round(progress)}%</span>
                    ) : (
                       <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">Start</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-subtext line-clamp-2">{program.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                View Curriculum <ChevronRight size={14} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};