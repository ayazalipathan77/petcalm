import React from 'react';
import { ViewState } from '../types';
import { Home, Music, BarChart2, User, AlertCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onPanic: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onPanic }) => {
  const leftItems = [
    { id: 'HOME', icon: Home, label: 'Home' },
    { id: 'SOUNDS', icon: Music, label: 'Sounds' },
  ];
  const rightItems = [
    { id: 'LOG', icon: BarChart2, label: 'Log' },
    { id: 'PROFILE', icon: User, label: 'Profile' },
  ];

  const renderNavItem = (item: { id: string; icon: React.FC<{ size: number; strokeWidth: number; fill?: string; className?: string }>; label: string }) => {
    const isActive = currentView === item.id;
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id as ViewState)}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors w-16 ${
          isActive ? 'text-primary' : 'text-neutral-subtext hover:text-primary-light'
        }`}
      >
        <div className={`mb-1 relative transition-transform ${isActive ? 'scale-110' : ''}`}>
          <Icon size={24} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? 'currentColor' : 'none'} className={isActive ? 'opacity-20' : ''} />
          {isActive && <Icon size={24} strokeWidth={2.5} className="absolute top-0 left-0" />}
        </div>
        <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-bg max-w-md mx-auto shadow-2xl overflow-hidden border-x border-neutral-200">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
        {children}
      </main>

      {/* Bottom Navigation with center SOS button */}
      <nav className="bg-white border-t border-neutral-100 px-2 pb-safe pt-2 z-50 relative">
        <div className="flex justify-between items-end">
          {/* Left items */}
          <div className="flex">
            {leftItems.map(renderNavItem)}
          </div>

          {/* Center raised SOS / Panic button */}
          <div className="flex flex-col items-center -mt-5 mb-1">
            <button
              onClick={() => { if (navigator.vibrate) navigator.vibrate(200); onPanic(); }}
              aria-label="SOS Panic Button"
              className="w-14 h-14 bg-status-warning rounded-full shadow-lg shadow-status-warning/40 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform border-4 border-white"
            >
              <AlertCircle size={26} strokeWidth={2.5} />
            </button>
            <span className="text-[9px] font-bold text-status-warning mt-0.5 uppercase tracking-wide">SOS</span>
          </div>

          {/* Right items */}
          <div className="flex">
            {rightItems.map(renderNavItem)}
          </div>
        </div>
      </nav>
    </div>
  );
};
