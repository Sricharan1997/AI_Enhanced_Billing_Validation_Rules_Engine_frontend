const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    return url.toString();
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    let data: unknown;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        typeof data === 'object' && data !== null && 'message' in data
          ? (data as Record<string, unknown>).message
          : `HTTP ${response.status}`;
      throw new Error(errorMessage as string);
    }

    return data as T;
  }

  /**
   * Poll for processing status of an AI operation
   * @param endpoint - The polling endpoint
   * @param resourceId - The ID of the resource being processed
   * @returns Promise with processing status and results
   */
  async pollStatus<T = unknown>(
    endpoint: string,
    resourceId: string
  ): Promise<{
    status: 'processing' | 'completed' | 'failed' | 'pending';
    progress?: number;
    data?: T;
    error?: string;
    estimatedTimeRemaining?: number;
  }> {
    try {
      const response = await this.get<{
        status: string;
        progress?: number;
        data?: T;
        error?: string;
        estimatedTimeRemaining?: number;
      }>(endpoint, {
        params: { resourceId },
      });
      return response as ReturnType<typeof this.pollStatus>;
    } catch (error) {
      throw new Error(
        `Polling failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Check the status of an AI processing request
   * @param transactionId - The transaction ID
   * @returns Promise with AI processing status
   */
  async checkAIProcessingStatus<T = unknown>(
    transactionId: string
  ): Promise<{
    status: 'processing' | 'completed' | 'failed' | 'pending';
    progress?: number;
    corrections?: T;
    aiInsights?: unknown;
    error?: string;
    processingStartedAt?: string;
    estimatedCompletionTime?: string;
  }> {
    return this.get(`/ai-processing/${transactionId}/status`);
  }

  /**
   * Trigger AI analysis on a transaction
   * @param transactionId - The transaction ID
   * @returns Promise with processing task ID
   */
  async startAIProcessing(transactionId: string): Promise<{
    taskId: string;
    status: 'initiated';
    estimatedDuration?: number;
  }> {
    return this.post(`/ai-processing/${transactionId}/analyze`);
  }

  /**
   * Trigger batch AI analysis
   * @param transactionIds - Array of transaction IDs
   * @returns Promise with batch processing task ID
   */
  async startBatchAIProcessing(transactionIds: string[]): Promise<{
    batchId: string;
    status: 'initiated';
    totalItems: number;
    estimatedDuration?: number;
  }> {
    return this.post('/ai-processing/batch/analyze', { transactionIds });
  }

  /**
   * Check batch processing status
   * @param batchId - The batch processing ID
   * @returns Promise with batch processing status
   */
  async checkBatchProcessingStatus(batchId: string): Promise<{
    status: 'processing' | 'completed' | 'failed' | 'pending';
    totalItems: number;
    processedItems: number;
    failedItems: number;
    progress: number;
    results?: unknown[];
    error?: string;
  }> {
    return this.get(`/ai-processing/batch/${batchId}/status`);
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, RequestOptions };
