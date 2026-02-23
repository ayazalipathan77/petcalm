import React, { useState, useEffect, useRef } from 'react';
import { MOCK_PROGRAMS } from '../constants';
import { TrainingProgram } from '../types';
import { ChevronRight, Sparkles, Home, Car, Lock, CheckCircle, ArrowLeft, Info, Leaf, PlayCircle, Timer, Pause, Crown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useSetting } from '../services/db';
import { shouldPromptReview, requestAppReview, markReviewPrompted } from '../services/appReview';
import { usePro } from '../context/ProContext';

const FREE_PROGRAM_LIMIT = 3; // p1, p2, p3 are free

// Parse "5 mins" → 300, "3 mins" → 180; returns null for reps/days
const parseDurationToSeconds = (duration: string): number | null => {
  const minsMatch = duration.match(/(\d+)\s*min/i);
  if (minsMatch) return parseInt(minsMatch[1]) * 60;
  const secsMatch = duration.match(/(\d+)\s*sec/i);
  if (secsMatch) return parseInt(secsMatch[1]);
  return null;
};

// Parse "10 reps" → 10; returns null for other formats
const parseReps = (duration: string): number | null => {
  const repsMatch = duration.match(/(\d+)\s*rep/i);
  return repsMatch ? parseInt(repsMatch[1]) : null;
};

// Parse "3 visits" → 3; returns null for other formats
const parseVisits = (duration: string): number | null => {
  const visitMatch = duration.match(/(\d+)\s*visit/i);
  return visitMatch ? parseInt(visitMatch[1]) : null;
};

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const Training: React.FC = () => {
  const { isPro, openPaywall } = usePro();
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const { value: savedProgress, save: saveProgress, loaded } = useSetting<Record<string, number>>('training_progress', {});

  const [localPrograms, setLocalPrograms] = useState<TrainingProgram[]>(MOCK_PROGRAMS);

  // Session timer (for minute-based steps)
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Rep / visit counter (for rep-based steps)
  const [repCount, setRepCount] = useState(0);

  // Apply saved progress once loaded from IndexedDB
  useEffect(() => {
    if (loaded && Object.keys(savedProgress).length > 0) {
      setLocalPrograms(MOCK_PROGRAMS.map(p => ({
        ...p,
        completedStepIndex: savedProgress[p.id] ?? p.completedStepIndex
      })));
    }
  }, [loaded, savedProgress]);

  // Reset timer + rep counter when current step changes
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
    setRepCount(0);
    if (selectedProgram) {
      const currentStep = selectedProgram.steps[selectedProgram.completedStepIndex];
      setTimerSeconds(currentStep ? parseDurationToSeconds(currentStep.duration) : null);
    }
  }, [selectedProgram?.id, selectedProgram?.completedStepIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startTimer = () => {
    if (timerSeconds === null || timerSeconds === 0) return;
    setTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!);
          setTimerRunning(false);
          if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
  };

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
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    // Prompt review after completing first step of any program
    if (stepIndex === 0 && shouldPromptReview(1)) {
      markReviewPrompted();
      setTimeout(requestAppReview, 2000);
    }
    const updated = localPrograms.map(p => {
      if (p.id === programId) {
        const newIndex = stepIndex === p.completedStepIndex ? p.completedStepIndex + 1 : p.completedStepIndex;
        const updatedProgram = { ...p, completedStepIndex: newIndex };
        if (selectedProgram?.id === programId) setSelectedProgram(updatedProgram);
        return updatedProgram;
      }
      return p;
    });
    setLocalPrograms(updated);
    // Persist to IndexedDB
    const progress: Record<string, number> = {};
    updated.forEach(p => { progress[p.id] = p.completedStepIndex; });
    saveProgress(progress);
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
              const stepDurationSecs = parseDurationToSeconds(step.duration);
              const stepReps = parseReps(step.duration);
              const stepVisits = parseVisits(step.duration);

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

                     {/* Countdown Timer — for minute-based steps */}
                     {isCurrent && stepDurationSecs !== null && (
                       <div className="mb-3">
                         <div className="flex items-center justify-between bg-neutral-50 rounded-xl px-4 py-2 border border-neutral-200">
                           <div className="flex items-center gap-2">
                             <Timer size={16} className={timerRunning ? 'text-primary' : 'text-neutral-400'} />
                             <span className={`font-mono text-lg font-bold ${timerSeconds === 0 ? 'text-status-success' : timerRunning ? 'text-primary' : 'text-neutral-text'}`}>
                               {timerSeconds !== null ? formatTime(timerSeconds) : formatTime(stepDurationSecs)}
                             </span>
                             {timerSeconds === 0 && <span className="text-xs text-status-success font-bold">Done!</span>}
                           </div>
                           <button
                             onClick={timerRunning ? pauseTimer : startTimer}
                             disabled={timerSeconds === 0}
                             className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                               timerSeconds === 0 ? 'bg-status-success/20 text-status-success' :
                               timerRunning ? 'bg-primary/10 text-primary hover:bg-primary/20' :
                               'bg-primary text-white hover:bg-primary-dark'
                             }`}
                           >
                             {timerRunning ? <Pause size={14} fill="currentColor" /> : <PlayCircle size={14} />}
                           </button>
                         </div>
                       </div>
                     )}

                     {/* Rep Counter — for rep-based steps */}
                     {isCurrent && stepDurationSecs === null && (stepReps !== null || stepVisits !== null) && (() => {
                       const target = stepReps ?? stepVisits!;
                       const label = stepReps !== null ? 'rep' : 'visit';
                       const done = repCount >= target;
                       return (
                         <div className="mb-3">
                           <div className="flex items-center justify-between bg-neutral-50 rounded-xl px-4 py-2 border border-neutral-200">
                             <div className="flex items-center gap-3">
                               <Timer size={16} className={done ? 'text-status-success' : 'text-neutral-400'} />
                               <div>
                                 <div className="flex items-center gap-1.5">
                                   <span className={`font-mono text-lg font-bold ${done ? 'text-status-success' : 'text-neutral-text'}`}>
                                     {repCount} / {target}
                                   </span>
                                   <span className="text-xs text-neutral-400">{label}s</span>
                                 </div>
                                 {/* progress bar */}
                                 <div className="w-24 h-1 bg-neutral-200 rounded-full mt-1">
                                   <div
                                     className={`h-full rounded-full transition-all ${done ? 'bg-status-success' : 'bg-primary'}`}
                                     style={{ width: `${Math.min((repCount / target) * 100, 100)}%` }}
                                   />
                                 </div>
                               </div>
                               {done && <span className="text-xs text-status-success font-bold">Done!</span>}
                             </div>
                             <div className="flex gap-2">
                               {repCount > 0 && (
                                 <button
                                   onClick={() => setRepCount(c => Math.max(0, c - 1))}
                                   className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-lg font-bold hover:bg-neutral-300 transition-colors"
                                 >
                                   −
                                 </button>
                               )}
                               <button
                                 onClick={() => {
                                   const next = Math.min(repCount + 1, target);
                                   setRepCount(next);
                                   if (next >= target && navigator.vibrate) navigator.vibrate([100, 50, 200]);
                                 }}
                                 disabled={done}
                                 className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${done ? 'bg-status-success/20 text-status-success' : 'bg-primary text-white hover:bg-primary-dark'}`}
                               >
                                 +
                               </button>
                             </div>
                           </div>
                         </div>
                       );
                     })()}

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
        {localPrograms.map((program, index) => {
           const isProLocked = !isPro && index >= FREE_PROGRAM_LIMIT;
           const isStarted = program.completedStepIndex > 0;
           const progress = (program.completedStepIndex / program.steps.length) * 100;

           return (
            <div
              key={program.id}
              onClick={() => isProLocked ? openPaywall() : setSelectedProgram(program)}
              className={`bg-white p-4 rounded-2xl border border-neutral-100 transition-all cursor-pointer group relative overflow-hidden ${
                isProLocked ? 'opacity-70' : 'hover:border-primary/30 hover:shadow-md'
              }`}
            >
              {isStarted && !isProLocked && (
                <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
              )}

              <div className="flex items-start gap-4 mb-3">
                <div className={`p-3 rounded-xl ${isProLocked ? 'bg-neutral-100 text-neutral-300' : isStarted ? 'bg-secondary/10 text-secondary' : 'bg-neutral-100 text-neutral-400'}`}>
                  {isProLocked ? <Lock size={20} /> : getIcon(program.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-neutral-text text-sm mb-1">{program.title}</h3>
                    {isProLocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Crown size={10} /> PRO
                      </span>
                    ) : isStarted ? (
                       <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">{Math.round(progress)}%</span>
                    ) : (
                       <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">Start</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-subtext line-clamp-2">{program.description}</p>
                </div>
              </div>

              <div className={`flex items-center gap-1 text-xs font-medium justify-end ${
                isProLocked ? 'text-amber-500 opacity-100' : 'text-primary opacity-0 group-hover:opacity-100 transition-opacity'
              }`}>
                {isProLocked ? <><Crown size={12} /> Unlock with Pro</> : <>View Curriculum <ChevronRight size={14} /></>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};
