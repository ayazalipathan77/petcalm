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
import { usePet, migrateFromLocalStorage } from './services/db';

const App: React.FC = () => {
  const { pet, loading, savePet, deletePet } = usePet();
  const [view, setView] = useState<ViewState>('HOME');
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [migrated, setMigrated] = useState(false);

  // Run localStorage -> IndexedDB migration on first load
  useEffect(() => {
    migrateFromLocalStorage().then(() => setMigrated(true));
  }, []);

  // Set initial view based on pet existence
  useEffect(() => {
    if (!loading) {
      setView(pet ? 'HOME' : 'ONBOARDING');
    }
  }, [loading, pet]);

  const handleOnboardingComplete = async (newPet: Pet) => {
    await savePet(newPet);
    setView('HOME');
  };

  const handleUpdatePet = async (updatedPet: Pet) => {
    await savePet(updatedPet);
  };

  const handleResetPet = async () => {
    await deletePet();
    setView('ONBOARDING');
  };

  // Show nothing while loading/migrating
  if (loading || !migrated) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-bg max-w-md mx-auto">
        <div className="animate-pulse text-primary font-medium">Loading...</div>
      </div>
    );
  }

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
        return <BehaviorLog petName={pet!.name} />;
      case 'PROFILE':
        return <Profile pet={pet!} onUpdatePet={handleUpdatePet} onResetPet={handleResetPet} />;
      default:
        return null;
    }
  };

  if (view === 'ONBOARDING') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      {isPanicMode && <PanicMode onExit={() => setIsPanicMode(false)} petName={pet?.name || 'Your Pet'} />}
      <Layout currentView={view} onNavigate={setView} onPanic={() => setIsPanicMode(true)}>
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;
