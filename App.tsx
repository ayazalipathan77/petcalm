import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Sounds } from './pages/Sounds';
import { Training } from './pages/Training';
import { BehaviorLog } from './pages/BehaviorLog';
import { PanicMode } from './pages/PanicMode';
import { ViewState, Pet } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('ONBOARDING');
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [pet, setPet] = useState<Pet | null>(null);

  const handleOnboardingComplete = (newPet: Pet) => {
    setPet(newPet);
    setView('HOME');
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
        return (
            <div className="flex flex-col items-center justify-center h-full text-neutral-subtext">
                <div className="w-20 h-20 bg-neutral-200 rounded-full mb-4"></div>
                <h2 className="text-xl font-bold">Profile Settings</h2>
                <p>Coming in v1.1</p>
            </div>
        );
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
