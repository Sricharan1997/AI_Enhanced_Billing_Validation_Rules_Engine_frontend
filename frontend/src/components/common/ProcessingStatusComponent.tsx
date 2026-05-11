'use client';

import React from 'react';
import { ProcessingStatus } from '@/types';

interface ProcessingStatusComponentProps {
  status: ProcessingStatus;
  progress: number;
  currentAttempt: number;
  maxAttempts: number;
  estimatedTimeRemaining?: number;
  message?: string;
  error?: string;
  onCancel: () => void;
  onRetry: () => void;
  showDetails?: boolean;
}

/**
 * Component that displays the current AI processing status
 * with progress bar, estimated time, and action buttons
 */
export const ProcessingStatusComponent: React.FC<ProcessingStatusComponentProps> = ({
  status,
  progress,
  currentAttempt,
  maxAttempts,
  estimatedTimeRemaining,
  message,
  error,
  onCancel,
  onRetry,
  showDetails = true,
}) => {
  const getStatusColor = (s: ProcessingStatus): string => {
    switch (s) {
      case 'processing':
        return 'text-blue-600 dark:text-blue-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'cancelled':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBgColor = (s: ProcessingStatus): string => {
    switch (s) {
      case 'processing':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'cancelled':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getProgressBarColor = (s: ProcessingStatus): string => {
    switch (s) {
      case 'processing':
        return 'bg-blue-600 dark:bg-blue-400';
      case 'success':
        return 'bg-green-600 dark:bg-green-400';
      case 'error':
        return 'bg-red-600 dark:bg-red-400';
      case 'cancelled':
        return 'bg-yellow-600 dark:bg-yellow-400';
      default:
        return 'bg-gray-600 dark:bg-gray-400';
    }
  };

  const formatTimeRemaining = (ms?: number): string => {
    if (!ms) return 'Calculating...';
    const seconds = Math.ceil(ms / 1000);
    if (seconds < 60) return `${seconds}s remaining`;
    const minutes = Math.ceil(seconds / 60);
    return `${minutes}m remaining`;
  };

  const getStatusText = (): string => {
    switch (status) {
      case 'processing':
        return 'Processing...';
      case 'success':
        return 'Processing Complete';
      case 'error':
        return 'Processing Failed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Idle';
    }
  };

  return (
    <div
      className={`rounded-lg border p-6 ${getStatusBgColor(
        status
      )} transition-all duration-300`}
    >
      {/* Header with status text */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status === 'processing' && (
            <div className="h-3 w-3 animate-pulse rounded-full bg-blue-600 dark:bg-blue-400" />
          )}
          {status === 'success' && (
            <svg
              className="h-5 w-5 text-green-600 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {status === 'error' && (
            <svg
              className="h-5 w-5 text-red-600 dark:text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {status === 'cancelled' && (
            <svg
              className="h-5 w-5 text-yellow-600 dark:text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <h3 className={`text-lg font-semibold ${getStatusColor(status)}`}>
            {message || getStatusText()}
          </h3>
        </div>
        {status === 'processing' && (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {currentAttempt} / {maxAttempts} attempts
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {status === 'processing' && (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Progress
            </span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {progress}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full transition-all duration-500 ${getProgressBarColor(
                status
              )}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Estimated Time Remaining */}
      {status === 'processing' && estimatedTimeRemaining !== undefined && (
        <div className="mb-4 rounded bg-white/50 p-3 dark:bg-gray-800/50">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatTimeRemaining(estimatedTimeRemaining)}
          </p>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && error && (
        <div className="mb-4 rounded bg-white/50 p-3 dark:bg-gray-800/50">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Details Section */}
      {showDetails && status === 'processing' && (
        <div className="mb-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Current Attempt:</span>
            <span className="font-medium">
              {currentAttempt} of {maxAttempts}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Progress:</span>
            <span className="font-medium">{progress}%</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {status === 'processing' && (
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white/30 dark:text-gray-300 dark:hover:bg-white/40"
          >
            Cancel
          </button>
        )}
        {(status === 'error' || status === 'cancelled') && (
          <button
            onClick={onRetry}
            className="flex-1 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white/30 dark:text-gray-300 dark:hover:bg-white/40"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ProcessingStatusComponent;
