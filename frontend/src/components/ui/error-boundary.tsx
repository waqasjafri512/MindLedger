'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-10 text-center space-y-6">
          <div className="w-16 h-16 bg-red/10 rounded-full flex items-center justify-center">
            <AlertTriangle size={32} className="text-red" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-foreground mb-2">Something went wrong</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              An unexpected error occurred. Please try refreshing the page.
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-2.5 bg-gold text-white rounded-xl font-bold hover:bg-gold-dk transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
