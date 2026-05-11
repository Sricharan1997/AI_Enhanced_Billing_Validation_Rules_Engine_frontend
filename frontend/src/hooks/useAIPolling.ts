'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AIProcessingState, ProcessingStatus, PollingConfig } from '@/types';

interface UseAIPollingOptions<T> extends PollingConfig {
  onStatusChange?: (status: ProcessingStatus) => void;
  onProgressUpdate?: (progress: number) => void;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseAIPollingResult<T> {
  status: ProcessingStatus;
  data?: T;
  error?: string;
  progress: number;
  estimatedTimeRemaining?: number;
  currentAttempt: number;
  maxAttempts: number;
  cancel: () => void;
  retry: () => void;
  startPolling: (endpoint: string, resourceId: string) => Promise<T | undefined>;
}

/**
 * Custom hook for polling AI processing results
 * Handles automatic retries with exponential backoff and timeout
 */
export function useAIPolling<T = unknown>(
  options: UseAIPollingOptions<T> = {}
): UseAIPollingResult<T> {
  const {
    pollInterval = 2000,
    maxAttempts = 30,
    backoffMultiplier = 1.5,
    timeout = 180000, // 3 minutes
    progressUpdateInterval = 1000,
    onStatusChange,
    onProgressUpdate,
    onSuccess,
    onError,
  } = options;

  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number>();

  const pollIntervalRef = useRef<NodeJS.Timeout>();
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const isCancelledRef = useRef(false);
  const startTimeRef = useRef<Date>();
  const lastPollTimeRef = useRef<Date>();

  // Update status
  const updateStatus = useCallback(
    (newStatus: ProcessingStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    },
    [onStatusChange]
  );

  // Update progress
  const updateProgress = useCallback(
    (newProgress: number) => {
      const boundProgress = Math.min(Math.max(newProgress, 0), 100);
      setProgress(boundProgress);
      onProgressUpdate?.(boundProgress);
    },
    [onProgressUpdate]
  );

  // Calculate estimated time remaining
  const calculateEstimatedTime = useCallback(
    (attempt: number) => {
      if (startTimeRef.current && attempt > 0) {
        const elapsedTime = Date.now() - startTimeRef.current.getTime();
        const averageTimePerAttempt = elapsedTime / attempt;
        const remainingAttempts = maxAttempts - attempt;
        const estimated = averageTimePerAttempt * remainingAttempts;
        return Math.max(0, estimated);
      }
      return undefined;
    },
    [maxAttempts]
  );

  // Start polling
  const startPolling = useCallback(
    async (endpoint: string, resourceId: string): Promise<T | undefined> => {
      isCancelledRef.current = false;
      setCurrentAttempt(0);
      setProgress(0);
      setError(undefined);
      setData(undefined);
      startTimeRef.current = new Date();
      lastPollTimeRef.current = new Date();

      updateStatus('processing');
      updateProgress(10);

      let currentBackoff = pollInterval;
      let attempt = 0;
      const startTime = Date.now();

      return new Promise((resolve) => {
        const poll = async () => {
          if (isCancelledRef.current) {
            updateStatus('cancelled');
            if (pollIntervalRef.current) clearTimeout(pollIntervalRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            resolve(undefined);
            return;
          }

          // Check timeout
          if (Date.now() - startTime > timeout) {
            const errorMsg = 'AI processing timeout exceeded';
            setError(errorMsg);
            updateStatus('error');
            onError?.(errorMsg);
            if (pollIntervalRef.current) clearTimeout(pollIntervalRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            resolve(undefined);
            return;
          }

          // Check max attempts
          if (attempt >= maxAttempts) {
            const errorMsg = 'Maximum polling attempts exceeded';
            setError(errorMsg);
            updateStatus('error');
            onError?.(errorMsg);
            if (pollIntervalRef.current) clearTimeout(pollIntervalRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            resolve(undefined);
            return;
          }

          attempt++;
          setCurrentAttempt(attempt);

          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'}${endpoint}?resourceId=${resourceId}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            // Check if processing is complete
            if (result.status === 'completed' || result.status === 'success') {
              setData(result.data);
              updateProgress(100);
              updateStatus('success');
              onSuccess?.(result.data);
              if (pollIntervalRef.current) clearTimeout(pollIntervalRef.current);
              if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
              resolve(result.data);
              return;
            }

            // Update progress if available
            if (result.progress) {
              updateProgress(result.progress);
            } else {
              // Estimate progress based on attempts
              const estimatedProgress = Math.min(10 + (attempt / maxAttempts) * 80, 95);
              updateProgress(estimatedProgress);
            }

            // Update estimated time remaining
            const estimated = calculateEstimatedTime(attempt);
            setEstimatedTimeRemaining(estimated);

            // Schedule next poll with exponential backoff
            currentBackoff = Math.min(
              pollInterval * Math.pow(backoffMultiplier, attempt - 1),
              30000 // max 30 seconds between polls
            );

            lastPollTimeRef.current = new Date();
            pollIntervalRef.current = setTimeout(poll, currentBackoff);
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Polling failed';
            console.error('Polling error:', errorMsg);

            // Retry on error (not exceeded)
            if (attempt < maxAttempts) {
              currentBackoff = Math.min(
                pollInterval * Math.pow(backoffMultiplier, attempt),
                30000
              );
              lastPollTimeRef.current = new Date();
              pollIntervalRef.current = setTimeout(poll, currentBackoff);
            } else {
              setError(errorMsg);
              updateStatus('error');
              onError?.(errorMsg);
              if (pollIntervalRef.current) clearTimeout(pollIntervalRef.current);
              if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
              resolve(undefined);
            }
          }
        };

        // Start progress update interval
        progressIntervalRef.current = setInterval(() => {
          if (startTimeRef.current && status === 'processing') {
            const elapsed = Date.now() - startTimeRef.current.getTime();
            const estimated = calculateEstimatedTime(currentAttempt);
            setEstimatedTimeRemaining(estimated);
          }
        }, progressUpdateInterval);

        // Start polling
        poll();
      });
    },
    [
      pollInterval,
      maxAttempts,
      backoffMultiplier,
      timeout,
      progressUpdateInterval,
      updateStatus,
      updateProgress,
      calculateEstimatedTime,
      onSuccess,
      onError,
    ]
  );

  // Cancel polling
  const cancel = useCallback(() => {
    isCancelledRef.current = true;
    if (pollIntervalRef.current) clearTimeout(pollIntervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }, []);

  // Retry polling
  const retry = useCallback(() => {
    cancel();
    // Will need to be combined with startPolling in the component
    setCurrentAttempt(0);
    setProgress(0);
    setError(undefined);
    updateStatus('idle');
  }, [cancel, updateStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearTimeout(pollIntervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  return {
    status,
    data,
    error,
    progress,
    estimatedTimeRemaining,
    currentAttempt,
    maxAttempts,
    cancel,
    retry,
    startPolling,
  };
}
