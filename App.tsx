import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Sounds } from './pages/Sounds';
import { Training } from './pages/Training';
import { BehaviorLog } from './pages/BehaviorLog';
import { PanicMode } from './pages/PanicMode';
import { Profile } from './pages/Profile';
import { ViewState, Pet, Incident, TrainingProgram } from './types';
import { MOCK_INCIDENTS, MOCK_PROGRAMS } from './constants';

const App: React.FC = () => {
  // Initialize state from local storage
  const [pet, setPet] = useState<Pet | null>(() => {
    const saved = localStorage.getItem('pet_profile');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse pet profile", e);
      return null;
    }
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('pet_incidents');
    try {
      return saved ? JSON.parse(saved) : MOCK_INCIDENTS;
    } catch (e) {
      console.error("Failed to parse incidents", e);
      return MOCK_INCIDENTS;
    }
  });

  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>(() => {
    const saved = localStorage.getItem('pet_training');
    try {
      return saved ? JSON.parse(saved) : MOCK_PROGRAMS;
    } catch (e) {
      console.error("Failed to parse training programs", e);
      return MOCK_PROGRAMS;
    }
  });

  const [view, setView] = useState<ViewState>(() => {
    return localStorage.getItem('pet_profile') ? 'HOME' : 'ONBOARDING';
  });

  const [isPanicMode, setIsPanicMode] = useState(false);

  // Persistence Effects
  useEffect(() => {
    if (pet) localStorage.setItem('pet_profile', JSON.stringify(pet));
  }, [pet]);

  useEffect(() => {
    localStorage.setItem('pet_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('pet_training', JSON.stringify(trainingPrograms));
  }, [trainingPrograms]);

  const handleOnboardingComplete = (newPet: Pet) => {
    setPet(newPet);
    setView('HOME');
  };

  const handleUpdatePet = (updatedPet: Pet) => {
    setPet(updatedPet);
  };

  const handleAddIncident = (newIncident: Incident) => {
    setIncidents(prev => [newIncident, ...prev]);
  };

  const handleUpdateProgram = (updatedProgram: TrainingProgram) => {
    setTrainingPrograms(prev => prev.map(p => p.id === updatedProgram.id ? updatedProgram : p));
  };

  const renderContent = () => {
    if (!pet && view !== 'ONBOARDING') return null;

    switch (view) {
      case 'HOME':
        return <Home pet={pet!} onNavigate={setView} onPanic={() => setIsPanicMode(true)} />;
      case 'SOUNDS':
        return <Sounds />;
      case 'TRAINING':
        return <Training programs={trainingPrograms} onUpdateProgram={handleUpdateProgram} />;
      case 'LOG':
        return <BehaviorLog incidents={incidents} onAddIncident={handleAddIncident} petName={pet!.name} />;
      case 'PROFILE':
        return <Profile pet={pet!} onUpdatePet={handleUpdatePet} />;
      default:
        return null;
    }
  };

  if (view === 'ONBOARDING') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      {isPanicMode && <PanicMode onExit={() => setIsPanicMode(false)} />}
      <Layout currentView={view} onNavigate={setView} onPanic={() => setIsPanicMode(true)}>
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;