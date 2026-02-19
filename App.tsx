import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Sounds } from './pages/Sounds';
import { Training } from './pages/Training';
import { BehaviorLog } from './pages/BehaviorLog';
import { PanicMode } from './pages/PanicMode';
import { Profile } from './pages/Profile';
import { Guide } from './pages/Guide';
import { Privacy } from './pages/Privacy';
import { ViewState, Pet } from './types';
import { usePets, migrateFromLocalStorage } from './services/db';

const App: React.FC = () => {
  const { pets, activePet, activePetId, loading, savePet, addPet, setActivePet, deleteAllData } = usePets();
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
      setView(activePet ? 'HOME' : 'ONBOARDING');
    }
  }, [loading, activePet]);

  const handleOnboardingComplete = async (newPet: Pet) => {
    await addPet(newPet);
    setView('HOME');
  };

  const handleUpdatePet = async (updatedPet: Pet) => {
    await savePet(updatedPet);
  };

  const handleResetPet = async () => {
    await deleteAllData();
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
    if (!activePet && view !== 'ONBOARDING') return null;

    switch (view) {
      case 'HOME':
        return (
          <Home
            pet={activePet!}
            pets={pets}
            activePetId={activePetId}
            onSwitchPet={setActivePet}
            onNavigate={setView}
            onPanic={() => setIsPanicMode(true)}
          />
        );
      case 'SOUNDS':
        return <Sounds />;
      case 'TRAINING':
        return <Training />;
      case 'LOG':
        return <BehaviorLog petName={activePet!.name} petId={activePetId} />;
      case 'GUIDE':
        return <Guide />;
      case 'PROFILE':
        return (
          <Profile
            pet={activePet!}
            onUpdatePet={handleUpdatePet}
            onResetPet={handleResetPet}
            onNavigate={setView}
          />
        );
      case 'PRIVACY':
        return <Privacy />;
      default:
        return null;
    }
  };

  if (view === 'ONBOARDING') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      {isPanicMode && <PanicMode onExit={() => setIsPanicMode(false)} petName={activePet?.name || 'Your Pet'} />}
      <Layout currentView={view} onNavigate={setView} onPanic={() => setIsPanicMode(true)}>
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;
