export interface Transaction {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'passed' | 'failed' | 'warning';
  vendor: string;
  date: string;
  description?: string;
}

export interface TransactionResponse {
  data: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}
