import React from 'react';
import { ViewState } from '../types';
import { Home, Music, BookOpen, BarChart2, User, AlertCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onPanic: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onPanic }) => {
  const navItems = [
    { id: 'HOME', icon: Home, label: 'Home' },
    { id: 'SOUNDS', icon: Music, label: 'Sounds' },
    { id: 'TRAINING', icon: BookOpen, label: 'Training' },
    { id: 'LOG', icon: BarChart2, label: 'Log' },
    { id: 'PROFILE', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-neutral-bg max-w-md mx-auto shadow-2xl overflow-hidden border-x border-neutral-200">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
        {children}
      </main>

      {/* Floating Panic Button (Visible unless in panic mode - handled by parent) */}
      <div className="absolute bottom-24 right-4 z-40">
        <button
          onClick={() => { if (navigator.vibrate) navigator.vibrate(200); onPanic(); }}
          className="w-14 h-14 bg-status-warning rounded-full shadow-xl shadow-status-warning/30 flex items-center justify-center text-white animate-bounce-slow hover:scale-105 active:scale-95 transition-transform"
          aria-label="Panic Button"
        >
          <AlertCircle size={28} strokeWidth={2.5} />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-neutral-100 px-2 pb-safe pt-2 z-50">
        <div className="flex justify-between items-center">
          {navItems.map((item) => {
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
                <div className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? "currentColor" : "none"} className={isActive ? "opacity-20" : ""} />
                  {isActive && <Icon size={24} strokeWidth={2.5} className="absolute top-0 left-0" />}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
