# AI Polling and Async Processing Guide

This guide explains how to use the polling system, async processing indicators, and processing status components in the frontend application.

## Overview

The polling and async processing system consists of:
- **`useAIPolling` Hook**: Custom React hook for managing AI result polling
- **`AsyncProcessingIndicator` Component**: Lightweight component for displaying processing status
- **`ProcessingStatusComponent` Component**: Detailed status display with progress and time estimates
- **API Methods**: Extended API client with polling endpoints
- **Service Methods**: Transaction service methods for AI processing

## Quick Start

### 1. Basic Polling with Hook

```tsx
'use client';

import { useState } from 'react';
import { useAIPolling } from '@/hooks';

export function MyComponent() {
  const {
    status,
    progress,
    data,
    error,
    startPolling,
    cancel,
  } = useAIPolling();

  const handleStartAnalysis = async () => {
    await startPolling('/ai-processing', 'transaction-123');
  };

  return (
    <div>
      <button onClick={handleStartAnalysis}>Analyze</button>
      <button onClick={cancel} disabled={status !== 'processing'}>
        Cancel
      </button>
      <p>Status: {status}</p>
      <p>Progress: {progress}%</p>
    </div>
  );
}
```

### 2. Display Processing Status

```tsx
import { ProcessingStatusComponent } from '@/components/common';

<ProcessingStatusComponent
  status={status}
  progress={progress}
  currentAttempt={currentAttempt}
  maxAttempts={maxAttempts}
  estimatedTimeRemaining={estimatedTimeRemaining}
  onCancel={cancel}
  onRetry={retry}
/>
```

### 3. Lightweight Indicator

```tsx
import { AsyncProcessingIndicator } from '@/components/common';

// Inline variant (default)
<AsyncProcessingIndicator
  status={status}
  progress={progress}
  message="Analyzing transaction..."
  variant="inline"
  size="sm"
/>

// Badge variant
<AsyncProcessingIndicator
  status={status}
  variant="badge"
/>

// Card variant
<AsyncProcessingIndicator
  status={status}
  progress={progress}
  variant="card"
  showProgress={true}
/>
```

## Hook API: `useAIPolling`

### Hook Configuration

```ts
interface UseAIPollingOptions<T> {
  pollInterval?: number;           // Default: 2000ms
  maxAttempts?: number;            // Default: 30
  backoffMultiplier?: number;      // Default: 1.5
  timeout?: number;                // Default: 180000ms (3 minutes)
  progressUpdateInterval?: number; // Default: 1000ms
  onStatusChange?: (status) => void;
  onProgressUpdate?: (progress) => void;
  onSuccess?: (data) => void;
  onError?: (error) => void;
}
```

### Hook Return Type

```ts
interface UseAIPollingResult<T> {
  status: ProcessingStatus;              // 'idle' | 'processing' | 'success' | 'error' | 'cancelled'
  data?: T;                              // Result data
  error?: string;                        // Error message
  progress: number;                      // 0-100
  estimatedTimeRemaining?: number;       // milliseconds
  currentAttempt: number;                // Current attempt count
  maxAttempts: number;                   // Maximum attempts
  cancel: () => void;                    // Cancel polling
  retry: () => void;                     // Reset state for retry
  startPolling: (endpoint, resourceId) => Promise<T>; // Start polling
}
```

### Example with Configuration

```tsx
const {
  status,
  progress,
  data,
  error,
  estimatedTimeRemaining,
  currentAttempt,
  maxAttempts,
  cancel,
  startPolling,
} = useAIPolling({
  pollInterval: 3000,        // Poll every 3 seconds
  maxAttempts: 60,           // Try for up to 60 times
  backoffMultiplier: 1.2,    // Slower backoff
  timeout: 300000,           // 5 minute timeout
  onStatusChange: (newStatus) => {
    console.log('Status changed:', newStatus);
  },
  onProgressUpdate: (newProgress) => {
    console.log('Progress:', newProgress);
  },
  onSuccess: (result) => {
    console.log('Polling succeeded:', result);
  },
  onError: (error) => {
    console.log('Polling failed:', error);
  },
});
```

## Components

### ProcessingStatusComponent

**Props:**
```ts
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
  showDetails?: boolean; // Default: true
}
```

**Features:**
- Color-coded status indicators
- Animated progress bar
- Estimated time calculation
- Attempt counter
- Error display
- Cancel/Retry buttons

**Example:**
```tsx
<ProcessingStatusComponent
  status={status}
  progress={progress}
  currentAttempt={currentAttempt}
  maxAttempts={maxAttempts}
  estimatedTimeRemaining={estimatedTimeRemaining}
  message="Processing AI corrections..."
  onCancel={handleCancel}
  onRetry={handleRetry}
  showDetails={true}
/>
```

### AsyncProcessingIndicator

**Props:**
```ts
interface AsyncProcessingIndicatorProps {
  status: ProcessingStatus;
  progress?: number;
  message?: string;
  showProgress?: boolean;     // Default: true
  size?: 'sm' | 'md' | 'lg'; // Default: 'md'
  variant?: 'inline' | 'card' | 'badge'; // Default: 'inline'
}
```

**Variants:**
- **inline**: Compact horizontal display (default)
- **card**: Full card with progress bar
- **badge**: Small pill/badge format

**Examples:**
```tsx
// Inline (compact)
<AsyncProcessingIndicator
  status="processing"
  progress={45}
  message="Analyzing..."
  variant="inline"
  size="sm"
/>

// Badge
<AsyncProcessingIndicator
  status="success"
  variant="badge"
/>

// Card with progress
<AsyncProcessingIndicator
  status="processing"
  progress={75}
  variant="card"
  showProgress={true}
/>
```

## API Methods

### Core API Client Methods

**Poll generic endpoint:**
```ts
const status = await apiClient.pollStatus<T>(
  '/ai-processing',
  'resource-id'
);
// Returns: { status, progress?, data?, error?, estimatedTimeRemaining? }
```

**Check AI processing status:**
```ts
const status = await apiClient.checkAIProcessingStatus<T>(
  'transaction-123'
);
// Returns: { status, progress?, corrections?, aiInsights?, error?, ... }
```

**Start AI processing:**
```ts
const task = await apiClient.startAIProcessing('transaction-123');
// Returns: { taskId, status: 'initiated', estimatedDuration? }
```

**Batch processing:**
```ts
const batch = await apiClient.startBatchAIProcessing([
  'tx-1',
  'tx-2',
  'tx-3'
]);

const batchStatus = await apiClient.checkBatchProcessingStatus(
  batch.batchId
);
// Returns: { status, totalItems, processedItems, progress, results?, ... }
```

### Transaction Service Methods

**Start AI analysis:**
```ts
const task = await transactionService.startAIAnalysis('transaction-123');
// Returns: { taskId, status: 'initiated', estimatedDuration? }
```

**Check processing status:**
```ts
const status = await transactionService.checkAIProcessingStatus(
  'transaction-123'
);
// Returns: { status, progress?, corrections?, aiInsights?, error?, ... }
```

**Batch analysis:**
```ts
const batch = await transactionService.startBatchAIAnalysis([
  'tx-1',
  'tx-2'
]);

const batchStatus = await transactionService.checkBatchAnalysisStatus(
  batch.batchId
);
// Returns: { status, totalItems, processedItems, failedItems, progress, results?, ... }
```

**Poll with custom endpoint:**
```ts
const status = await transactionService.pollAIAnalysisStatus(
  'transaction-123',
  '/custom-polling-endpoint'
);
```

## Complete Example: AI Analysis Page

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useAIPolling } from '@/hooks';
import {
  ProcessingStatusComponent,
  AsyncProcessingIndicator,
} from '@/components/common';
import { transactionService } from '@/services';

export default function AIAnalysisPage() {
  const [transactionId, setTransactionId] = useState('');
  const [taskStarted, setTaskStarted] = useState(false);

  const {
    status,
    progress,
    data,
    error,
    currentAttempt,
    maxAttempts,
    estimatedTimeRemaining,
    cancel,
    retry,
    startPolling,
  } = useAIPolling<{
    corrections?: unknown;
    aiInsights?: unknown;
  }>({
    maxAttempts: 60,
    pollInterval: 2000,
    onSuccess: (result) => {
      console.log('Analysis complete:', result);
    },
    onError: (err) => {
      console.error('Analysis failed:', err);
    },
  });

  const handleStartAnalysis = async () => {
    try {
      setTaskStarted(true);
      // Start AI processing on the backend
      await transactionService.startAIAnalysis(transactionId);
      // Poll for results
      await startPolling('/ai-processing', transactionId);
    } catch (err) {
      console.error('Failed to start analysis:', err);
    }
  };

  const handleRetry = async () => {
    retry();
    try {
      await startPolling('/ai-processing', transactionId);
    } catch (err) {
      console.error('Retry failed:', err);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">AI Analysis</h1>
        <p className="mt-2 text-gray-600">
          Analyze transactions with AI-powered insights
        </p>
      </div>

      {/* Input Section */}
      {!taskStarted && (
        <div className="space-y-4">
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter transaction ID"
            className="rounded border px-3 py-2"
          />
          <button
            onClick={handleStartAnalysis}
            disabled={!transactionId}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
          >
            Start Analysis
          </button>
        </div>
      )}

      {/* Processing Status */}
      {taskStarted && (
        <ProcessingStatusComponent
          status={status}
          progress={progress}
          currentAttempt={currentAttempt}
          maxAttempts={maxAttempts}
          estimatedTimeRemaining={estimatedTimeRemaining}
          error={error}
          onCancel={cancel}
          onRetry={handleRetry}
        />
      )}

      {/* Results Section */}
      {status === 'success' && data && (
        <div className="rounded border border-green-200 bg-green-50 p-4">
          <h2 className="font-bold text-green-800">Analysis Complete</h2>
          <pre className="mt-4 overflow-auto rounded bg-white p-4 text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {/* Error Section */}
      {status === 'error' && (
        <div className="rounded border border-red-200 bg-red-50 p-4">
          <h2 className="font-bold text-red-800">Analysis Failed</h2>
          <p className="mt-2 text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
```

## Types

```ts
// Processing status types
type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error' | 'cancelled';

interface ProcessingResult<T> {
  data?: T;
  error?: string;
  retries?: number;
  totalAttempts?: number;
  estimatedTime?: number;
  completedAt?: Date;
}

interface AIProcessingState<T> {
  status: ProcessingStatus;
  progress?: number;
  message?: string;
  result?: ProcessingResult<T>;
  startTime?: Date;
  estimatedTimeRemaining?: number;
  currentAttempt?: number;
  maxAttempts?: number;
}
```

## Polling Strategy

The polling system uses **exponential backoff** to optimize API usage:

1. **Initial poll**: 2 seconds (default)
2. **Subsequent polls**: Previous interval × `backoffMultiplier` (capped at 30 seconds)
3. **Progress calculation**: Based on attempts and elapsed time
4. **Auto-cancel**: On timeout or max attempts exceeded

### Customizing Backoff

```tsx
const { startPolling } = useAIPolling({
  pollInterval: 1000,        // Start with 1 second
  maxAttempts: 120,          // 2 hours maximum
  backoffMultiplier: 1.1,    // Slow backoff: 1s, 1.1s, 1.21s, etc.
  timeout: 7200000,          // 2 hours
});
```

## Error Handling

The polling system handles various error scenarios:

- **Network errors**: Automatic retry with backoff
- **HTTP errors**: Logged and retried
- **Timeout**: Stops after `timeout` milliseconds
- **Max attempts**: Stops after `maxAttempts` polling requests
- **Cancelled**: User clicks cancel button

```tsx
const { error, status, cancel } = useAIPolling({
  onError: (errorMsg) => {
    // Handle specific errors
    if (errorMsg.includes('timeout')) {
      // Show timeout message
    } else if (errorMsg.includes('max attempts')) {
      // Show max attempts message
    }
  },
});
```

## Best Practices

1. **Configure appropriate timeouts**: Match your API's expected processing time
2. **Set reasonable poll intervals**: Balance responsiveness with server load
3. **Show progress to users**: Always display progress bars and estimates
4. **Handle cancellation**: Allow users to stop long-running operations
5. **Provide feedback**: Use toast notifications or status components
6. **Use batch processing**: For multiple items, use batch endpoints
7. **Cleanup on unmount**: The hook handles this automatically
8. **Cache results**: Avoid re-polling for the same data

## Common Use Cases

### Use Case 1: Single Transaction Analysis

```tsx
const { startPolling } = useAIPolling();
await startPolling('/ai-processing', transactionId);
```

### Use Case 2: Batch Processing

```tsx
const batch = await transactionService.startBatchAIAnalysis(txIds);
await startPolling('/ai-processing/batch', batch.batchId);
```

### Use Case 3: With User Feedback

```tsx
const { startPolling } = useAIPolling({
  onSuccess: () => showToast('Analysis complete!', 'success'),
  onError: (err) => showToast(`Failed: ${err}`, 'error'),
  onStatusChange: (status) => logEvent('analysis_status', { status }),
});
```

### Use Case 4: Integrated with Validation

```tsx
// Start validation
await transactionService.validateTransaction(txId);
// Poll for AI insights
const polling = useAIPolling();
await polling.startPolling('/ai-processing', txId);
// Combine results
const results = {
  validation: validationData,
  aiInsights: polling.data,
};
```

## Troubleshooting

### Polling never completes
- Check the backend endpoint returns correct `status` values
- Verify `maxAttempts` is sufficient for your use case
- Increase `pollInterval` if server is overloaded

### Progress stuck at 0%
- Ensure `progress` is returned from the API
- Check if `progress` field name matches expectations
- The hook estimates progress based on attempts if not provided

### High memory usage
- Reduce `progressUpdateInterval` if too frequent
- Ensure cleanup on component unmount
- Check for memory leaks in callbacks

### Timeout errors
- Increase `timeout` value
- Reduce `pollInterval` to check more frequently
- Check backend processing time estimates

## Related Files

- Hook: `/src/hooks/useAIPolling.ts`
- Components: `/src/components/common/ProcessingStatusComponent.tsx`, `/AsyncProcessingIndicator.tsx`
- API: `/src/services/api.ts`
- Service: `/src/services/transactionService.ts`
- Types: `/src/types/processing.ts`
