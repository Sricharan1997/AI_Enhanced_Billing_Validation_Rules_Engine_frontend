'use client';

import React from 'react';
import { ProcessingStatus } from '@/types';

interface AsyncProcessingIndicatorProps {
  status: ProcessingStatus;
  progress?: number;
  message?: string;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'card' | 'badge';
}

/**
 * Lightweight component to display async processing status
 * Suitable for inline display with loading animation
 */
export const AsyncProcessingIndicator: React.FC<AsyncProcessingIndicatorProps> = ({
  status,
  progress = 0,
  message,
  showProgress = true,
  size = 'md',
  variant = 'inline',
}) => {
  const getSizeClasses = (s: string): string => {
    switch (s) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-8 w-8';
      default:
        return 'h-6 w-6';
    }
  };

  const getStatusIcon = (): React.ReactNode => {
    switch (status) {
      case 'processing':
        return (
          <div className={`${getSizeClasses(size)} animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400`} />
        );
      case 'success':
        return (
          <svg
            className={`${getSizeClasses(size)} text-green-600 dark:text-green-400`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'error':
        return (
          <svg
            className={`${getSizeClasses(size)} text-red-600 dark:text-red-400`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'cancelled':
        return (
          <svg
            className={`${getSizeClasses(size)} text-yellow-600 dark:text-yellow-400`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusText = (): string => {
    switch (status) {
      case 'processing':
        return message || 'Processing...';
      case 'success':
        return message || 'Complete';
      case 'error':
        return message || 'Error';
      case 'cancelled':
        return message || 'Cancelled';
      default:
        return 'Idle';
    }
  };

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

  // Inline variant - compact horizontal layout
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2">
        <div className={getStatusColor(status)}>{getStatusIcon()}</div>
        <span className={`text-sm font-medium ${getStatusColor(status)}`}>
          {getStatusText()}
        </span>
        {showProgress && status === 'processing' && progress > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {progress}%
          </span>
        )}
      </div>
    );
  }

  // Badge variant - small badge display
  if (variant === 'badge') {
    const bgClasses = {
      processing: 'bg-blue-100 dark:bg-blue-900/30',
      success: 'bg-green-100 dark:bg-green-900/30',
      error: 'bg-red-100 dark:bg-red-900/30',
      cancelled: 'bg-yellow-100 dark:bg-yellow-900/30',
      idle: 'bg-gray-100 dark:bg-gray-900/30',
    }[status];

    return (
      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${bgClasses}`}>
        <div className={getStatusColor(status)}>{getStatusIcon()}</div>
        <span className={`text-xs font-semibold ${getStatusColor(status)}`}>
          {getStatusText()}
        </span>
      </div>
    );
  }

  // Card variant - larger card display with progress bar
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-3">
        <div className={`mt-1 ${getStatusColor(status)}`}>{getStatusIcon()}</div>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${getStatusColor(status)}`}>
            {getStatusText()}
          </p>
          {showProgress && status === 'processing' && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 dark:bg-blue-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AsyncProcessingIndicator;
