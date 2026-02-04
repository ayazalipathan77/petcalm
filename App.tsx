import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Sounds } from './pages/Sounds';
import { Training } from './pages/Training';
import { BehaviorLog } from './pages/BehaviorLog';
import { PanicMode } from './pages/PanicMode';
import { Profile } from './pages/Profile';
import { ViewState, Pet } from './types';

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

  const [view, setView] = useState<ViewState>(() => {
    return localStorage.getItem('pet_profile') ? 'HOME' : 'ONBOARDING';
  });

  const [isPanicMode, setIsPanicMode] = useState(false);

  const handleOnboardingComplete = (newPet: Pet) => {
    setPet(newPet);
    localStorage.setItem('pet_profile', JSON.stringify(newPet));
    setView('HOME');
  };

  const handleUpdatePet = (updatedPet: Pet) => {
    setPet(updatedPet);
    localStorage.setItem('pet_profile', JSON.stringify(updatedPet));
  };

  const renderContent = () => {
    if (!pet && view !== 'ONBOARDING') return null;

    switch (view) {
      case 'HOME':
        return <Home pet={pet!} onNavigate={setView} onPanic={() => setIsPanicMode(true)} />;
      case 'SOUNDS':
        return <Sounds />;
      case 'TRAINING':
        return <Training />;
      case 'LOG':
        return <BehaviorLog />;
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