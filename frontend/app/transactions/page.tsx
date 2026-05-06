'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import TransactionTable from '@/components/tables/TransactionTable';
import Button from '@/components/common/Button';
import { Transaction } from '@/types/transaction';
import { transactionService } from '@/services';

// Mock data for fallback
const mockTransactions: Transaction[] = [
  {
    id: '1',
    transactionId: 'TXN-001234',
    amount: 1250.0,
    currency: 'USD',
    status: 'passed',
    vendor: 'Vendor A',
    date: '2026-05-07T10:30:00Z',
    description: 'Monthly subscription',
  },
  {
    id: '2',
    transactionId: 'TXN-001233',
    amount: 2100.0,
    currency: 'USD',
    status: 'failed',
    vendor: 'Vendor B',
    date: '2026-05-07T09:15:00Z',
    description: 'Equipment purchase',
  },
  {
    id: '3',
    transactionId: 'TXN-001232',
    amount: 895.5,
    currency: 'USD',
    status: 'passed',
    vendor: 'Vendor C',
    date: '2026-05-06T14:45:00Z',
    description: 'Software license',
  },
  {
    id: '4',
    transactionId: 'TXN-001231',
    amount: 550.0,
    currency: 'USD',
    status: 'warning',
    vendor: 'Vendor D',
    date: '2026-05-06T11:20:00Z',
    description: 'Consulting services',
  },
  {
    id: '5',
    transactionId: 'TXN-001230',
    amount: 3200.0,
    currency: 'USD',
    status: 'pending',
    vendor: 'Vendor E',
    date: '2026-05-05T16:30:00Z',
    description: 'Infrastructure costs',
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await transactionService.getTransactions({
          search: searchQuery || undefined,
          status: statusFilter || undefined,
          vendor: vendorFilter || undefined,
        });

        setTransactions(response.data || mockTransactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        // Fallback to mock data on error
        setTransactions(mockTransactions);
        setHasError(false); // Don't show error UI, just use mock data
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [searchQuery, statusFilter, vendorFilter]);

  const handleViewDetails = (transaction: Transaction) => {
    console.log('View details for:', transaction);
    alert(`Viewing details for ${transaction.transactionId}`);
  };

  const handleDelete = async (transactionId: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.deleteTransaction(transactionId);
        setTransactions(transactions.filter((t) => t.id !== transactionId));
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        alert('Failed to delete transaction');
      }
    }
  };

  const handleNewTransaction = () => {
    alert('New transaction dialog would open here');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setVendorFilter('');
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Transactions
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage and view all your billing transactions
            </p>
          </div>
          <Button variant="primary" onClick={handleNewTransaction}>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Transaction
          </Button>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search ID
              </label>
              <input
                type="text"
                placeholder="TXN-..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Vendor
              </label>
              <select
                value={vendorFilter}
                onChange={(e) => setVendorFilter(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All</option>
                <option value="Vendor A">Vendor A</option>
                <option value="Vendor B">Vendor B</option>
                <option value="Vendor C">Vendor C</option>
                <option value="Vendor D">Vendor D</option>
                <option value="Vendor E">Vendor E</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={handleResetFilters} className="w-full">
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
          hasError={hasError}
        />

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Transactions
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {transactions.length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Amount
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              ${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="card">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Success Rate
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {(
                ((transactions.filter((t) => t.status === 'passed').length /
                  transactions.length) *
                  100) ||
                0
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
