'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Button from '../common/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default function ErrorBoundary({
  children,
  fallback,
}: ErrorBoundaryProps) {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
  });

  const resetError = () => {
    setState({
      hasError: false,
      error: null,
    });
  };

  // Handle errors from event handlers
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Error caught by Error Boundary:', event.error);
      setState({
        hasError: true,
        error: event.error || new Error(event.message),
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setState({
        hasError: true,
        error:
          event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason)),
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (state.hasError && state.error) {
    if (fallback) {
      return fallback(state.error, resetError);
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-red-600 dark:text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Something went wrong
            </h1>
          </div>

          <p className="text-gray-600 dark:text-gray-400">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>

          <details className="cursor-pointer">
            <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Error details
            </summary>
            <pre className="mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-3 text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-40">
              {state.error.message}
              {'\n\n'}
              {state.error.stack}
            </pre>
          </details>

          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              onClick={resetError}
              className="flex-1"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
              className="flex-1"
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
