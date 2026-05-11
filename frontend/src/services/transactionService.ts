import { apiClient } from './api';
import { Transaction, TransactionResponse } from '@/types/transaction';
import { handleApiError } from '@/utils/errorHandler';

export interface TransactionFilters {
  search?: string;
  status?: string;
  vendor?: string;
  page?: number;
  pageSize?: number;
}

class TransactionService {
  private baseEndpoint = '/transactions';

  async getTransactions(filters?: TransactionFilters): Promise<TransactionResponse> {
    try {
      const params = {
        ...(filters?.search && { search: filters.search }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.vendor && { vendor: filters.vendor }),
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 10,
      };

      const response = await apiClient.get<TransactionResponse>(
        this.baseEndpoint,
        { params }
      );

      return response;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('Error fetching transactions:', apiError);
      throw apiError;
    }
  }

  async getTransaction(id: string): Promise<Transaction> {
    try {
      const response = await apiClient.get<Transaction>(
        `${this.baseEndpoint}/${id}`
      );
      return response;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error(`Error fetching transaction ${id}:`, apiError);
      throw apiError;
    }
  }

  async createTransaction(data: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> {
    try {
      const response = await apiClient.post<Transaction>(
        this.baseEndpoint,
        data
      );
      return response;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('Error creating transaction:', apiError);
      throw apiError;
    }
  }

  async updateTransaction(
    id: string,
    data: Partial<Omit<Transaction, 'id' | 'date'>>
  ): Promise<Transaction> {
    try {
      const response = await apiClient.put<Transaction>(
        `${this.baseEndpoint}/${id}`,
        data
      );
      return response;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error(`Error updating transaction ${id}:`, apiError);
      throw apiError;
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      const apiError = handleApiError(error);
      console.error(`Error deleting transaction ${id}:`, apiError);
      throw apiError;
    }
  }

  async validateTransaction(id: string): Promise<Transaction> {
    try {
      const response = await apiClient.post<Transaction>(
        `${this.baseEndpoint}/${id}/validate`
      );
      return response;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error(`Error validating transaction ${id}:`, apiError);
      throw apiError;
    }
  }

  /**
   * Start AI analysis for a transaction
   * @param id - Transaction ID
   * @returns Processing task info
   */
  async startAIAnalysis(
    id: string
  ): Promise<{
    taskId: string;
    status: 'initiated';
    estimatedDuration?: number;
  }> {
    try {
      const response = await apiClient.post(
        `${this.baseEndpoint}/${id}/ai-analysis`
      );
      return response;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error(`Error starting AI analysis for transaction ${id}:`, apiError);
      throw apiError;
    }
  }

  /**
   * Check AI processing status for a transaction
   * @param id - Transaction ID
   * @returns Processing status and results
   */
  async checkAIProcessingStatus(id: string): Promise<{
    status: 'processing' | 'completed' | 'failed' | 'pending';
    progress?: number;
    corrections?: unknown;
    aiInsights?: unknown;
    error?: string;
    processingStartedAt?: string;
    estimatedCompletionTime?: string;
  }> {
    try {
      const response = await apiClient.checkAIProcessingStatus(id);
      return response;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error(
        `Error checking AI processing status for transaction ${id}:`,
        apiError
      );
      throw apiError;
    }
  }

  /**
   * Start batch AI analysis for multiple transactions
   * @param transactionIds - Array of transaction IDs
   * @returns Batch processing task info
   */
  async startBatchAIAnalysis(
    transactionIds: string[]
  ): Promise<{
    batchId: string;
    status: 'initiated';
    totalItems: number;
    estimatedDuration?: number;
  }> {
    try {
      const response = await apiClient.startBatchAIProcessing(transactionIds);
      return response;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('Error starting batch AI analysis:', apiError);
      throw apiError;
    }
  }

  /**
   * Check batch AI analysis status
   * @param batchId - Batch processing ID
   * @returns Batch processing status
   */
  async checkBatchAnalysisStatus(
    batchId: string
  ): Promise<{
    status: 'processing' | 'completed' | 'failed' | 'pending';
    totalItems: number;
    processedItems: number;
    failedItems: number;
    progress: number;
    results?: unknown[];
    error?: string;
  }> {
    try {
      const response = await apiClient.checkBatchProcessingStatus(batchId);
      return response;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error(`Error checking batch analysis status for ${batchId}:`, apiError);
      throw apiError;
    }
  }

  /**
   * Poll for AI analysis completion
   * @param id - Transaction ID
   * @param endpoint - Custom polling endpoint (optional)
   * @returns Processing status
   */
  async pollAIAnalysisStatus(
    id: string,
    endpoint: string = '/ai-processing'
  ): Promise<{
    status: 'processing' | 'completed' | 'failed' | 'pending';
    progress?: number;
    data?: unknown;
    error?: string;
    estimatedTimeRemaining?: number;
  }> {
    try {
      const response = await apiClient.pollStatus(endpoint, id);
      return response;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error(`Error polling AI analysis status for transaction ${id}:`, apiError);
      throw apiError;
    }
  }
}

export const transactionService = new TransactionService();
