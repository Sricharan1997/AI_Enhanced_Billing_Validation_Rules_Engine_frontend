export type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error' | 'cancelled';

export interface ProcessingResult<T> {
  data?: T;
  error?: string;
  retries?: number;
  totalAttempts?: number;
  estimatedTime?: number; // in milliseconds
  completedAt?: Date;
}

export interface AIProcessingState<T = unknown> {
  status: ProcessingStatus;
  progress?: number; // 0-100
  message?: string;
  result?: ProcessingResult<T>;
  startTime?: Date;
  estimatedTimeRemaining?: number; // in milliseconds
  currentAttempt?: number;
  maxAttempts?: number;
}

export interface PollingConfig {
  pollInterval?: number; // milliseconds, default 2000
  maxAttempts?: number; // default 30
  backoffMultiplier?: number; // default 1.5
  timeout?: number; // milliseconds, default 180000 (3 minutes)
  progressUpdateInterval?: number; // milliseconds
}
