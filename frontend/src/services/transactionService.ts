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
}

export const transactionService = new TransactionService();
