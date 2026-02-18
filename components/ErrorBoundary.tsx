import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  declare state: State;
  declare props: Readonly<Props>;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[PetCalm] Unhandled error:', error, info.componentStack);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-neutral-bg p-8 text-center max-w-md mx-auto">
          <span className="text-6xl mb-6">🐾</span>
          <h2 className="text-xl font-bold text-neutral-text mb-2">Something went wrong</h2>
          <p className="text-sm text-neutral-subtext mb-8">
            PetCalm hit an unexpected error. Your data is safe — tap below to restart.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors shadow-md"
          >
            Restart App
          </button>
          {this.state.error && (
            <p className="mt-4 text-xs text-neutral-subtext opacity-60 break-all">
              {this.state.error.message}
            </p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
