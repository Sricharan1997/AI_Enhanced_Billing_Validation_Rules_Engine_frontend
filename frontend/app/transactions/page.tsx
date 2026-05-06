'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import TransactionTable from '@/components/tables/TransactionTable';
import Button from '@/components/common/Button';
import { DuplicateTransactionWarning, SearchBar, FilterDropdown } from '@/components/common';
import { Transaction } from '@/types/transaction';
import { transactionService } from '@/services';
import { formatErrorMessage } from '@/utils/errorHandler';
import { ValidationDetailsModal } from '@/components/modals';

// Mock data for fallback
const mockTransactions: Transaction[] = [
  {
    id: '1',
    transactionId: 'TXN-001234',
    amount: 1250.0,
    currency: 'USD',
    status: 'passed',
    validationStatus: 'valid',
    vendor: 'Vendor A',
    date: '2026-05-07T10:30:00Z',
    description: 'Monthly subscription',
    validationDetails: [
      {
        rule: 'Amount Verification',
        message: 'Transaction amount matches invoice',
        severity: 'info',
        timestamp: '2026-05-07T10:31:00Z',
      },
      {
        rule: 'Vendor Authentication',
        message: 'Vendor identity verified against whitelist',
        severity: 'info',
        timestamp: '2026-05-07T10:31:05Z',
      },
    ],
  },
  {
    id: '2',
    transactionId: 'TXN-001233',
    amount: 2100.0,
    currency: 'USD',
    status: 'failed',
    validationStatus: 'invalid',
    vendor: 'Vendor B',
    date: '2026-05-07T09:15:00Z',
    description: 'Equipment purchase',
    validationDetails: [
      {
        rule: 'Amount Verification',
        message: 'Transaction amount exceeds approved budget threshold',
        severity: 'error',
        timestamp: '2026-05-07T09:16:00Z',
      },
      {
        rule: 'PO Matching',
        message: 'No matching purchase order found',
        severity: 'error',
        timestamp: '2026-05-07T09:16:05Z',
      },
    ],
  },
  {
    id: '3',
    transactionId: 'TXN-001232',
    amount: 895.5,
    currency: 'USD',
    status: 'passed',
    validationStatus: 'valid',
    vendor: 'Vendor C',
    date: '2026-05-06T14:45:00Z',
    description: 'Software license',
    validationDetails: [
      {
        rule: 'Amount Verification',
        message: 'Amount verified successfully',
        severity: 'info',
        timestamp: '2026-05-06T14:46:00Z',
      },
    ],
  },
  {
    id: '4',
    transactionId: 'TXN-001231',
    amount: 550.0,
    currency: 'USD',
    status: 'warning',
    validationStatus: 'warning',
    vendor: 'Vendor D',
    date: '2026-05-06T11:20:00Z',
    description: 'Consulting services',
    validationDetails: [
      {
        rule: 'Duplicate Check',
        message: 'Similar transaction found from 2 weeks ago',
        severity: 'warning',
        timestamp: '2026-05-06T11:21:00Z',
      },
      {
        rule: 'Vendor Profile',
        message: 'Vendor profile missing recent documentation',
        severity: 'warning',
        timestamp: '2026-05-06T11:21:05Z',
      },
    ],
  },
  {
    id: '5',
    transactionId: 'TXN-001230',
    amount: 3200.0,
    currency: 'USD',
    status: 'pending',
    validationStatus: 'unvalidated',
    vendor: 'Vendor E',
    date: '2026-05-05T16:30:00Z',
    description: 'Infrastructure costs',
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateCount, setDuplicateCount] = useState(0);

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        setErrorMessage('');

        const response = await transactionService.getTransactions({
          search: searchQuery || undefined,
          status: statusFilter || undefined,
          vendor: vendorFilter || undefined,
        });

        setTransactions(response.data || mockTransactions);
        detectDuplicates(response.data || mockTransactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        
        // Enhanced error handling
        const errorMsg = formatErrorMessage(error);
        setErrorMessage(errorMsg);
        
        // Show error state but still allow user to see mock data
        setHasError(true);
        setTransactions(mockTransactions);
        detectDuplicates(mockTransactions);
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

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const detectDuplicates = (txns: Transaction[]) => {
    // Check for similar transactions in the last 3 transactions
    if (txns.length > 1) {
      const recentTxn = txns[0];
      const similarTxns = txns.slice(1, 4).filter((t) => 
        t.vendor === recentTxn.vendor && 
        Math.abs(t.amount - recentTxn.amount) < 100
      );
      
      if (similarTxns.length > 0) {
        setDuplicateCount(similarTxns.length);
        setShowDuplicateWarning(true);
        return;
      }
    }
    setShowDuplicateWarning(false);
  };

  const handleDelete = async (transactionId: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.deleteTransaction(transactionId);
        setTransactions(transactions.filter((t) => t.id !== transactionId));
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        const errorMsg = formatErrorMessage(error);
        alert(`Failed to delete transaction: ${errorMsg}`);
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
        {/* Error Alert */}
        {hasError && (
          <div className="rounded-lg border-l-4 border-red-400 bg-red-50 p-4 dark:bg-red-900/20 dark:border-red-500">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h3 className="font-medium text-red-800 dark:text-red-300">
                  Connection Error
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-200">
                  {errorMessage} - Displaying cached data. Please check your connection.
                </p>
              </div>
              <button
                onClick={() => setHasError(false)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
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

        {/* Duplicate Warning */}
        <DuplicateTransactionWarning
          isVisible={showDuplicateWarning}
          count={duplicateCount}
          message={`We found ${duplicateCount} similar transaction${duplicateCount !== 1 ? 's' : ''} from the same vendor with similar amounts.`}
          onDismiss={() => setShowDuplicateWarning(false)}
          onViewDuplicates={() => console.log('View duplicates')}
        />

        {/* Filters */}
        <div className="card">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search Bar */}
            <div className="md:col-span-2 lg:col-span-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by Transaction ID..."
                disabled={isLoading}
                showClearButton={true}
              />
            </div>

            {/* Status Filter */}
            <FilterDropdown
              label="Status"
              options={[
                { label: 'All Statuses', value: '', count: transactions.length },
                { label: 'Pending', value: 'pending', icon: '⏳', count: transactions.filter(t => t.status === 'pending').length },
                { label: 'Passed', value: 'passed', icon: '✅', count: transactions.filter(t => t.status === 'passed').length },
                { label: 'Failed', value: 'failed', icon: '❌', count: transactions.filter(t => t.status === 'failed').length },
                { label: 'Warning', value: 'warning', icon: '⚠️', count: transactions.filter(t => t.status === 'warning').length },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              disabled={isLoading}
              showCount={true}
            />

            {/* Vendor Filter */}
            <FilterDropdown
              label="Vendor"
              options={[
                { label: 'All Vendors', value: '', count: transactions.length },
                { label: 'Vendor A', value: 'Vendor A', icon: '🏢', count: transactions.filter(t => t.vendor === 'Vendor A').length },
                { label: 'Vendor B', value: 'Vendor B', icon: '🏢', count: transactions.filter(t => t.vendor === 'Vendor B').length },
                { label: 'Vendor C', value: 'Vendor C', icon: '🏢', count: transactions.filter(t => t.vendor === 'Vendor C').length },
                { label: 'Vendor D', value: 'Vendor D', icon: '🏢', count: transactions.filter(t => t.vendor === 'Vendor D').length },
                { label: 'Vendor E', value: 'Vendor E', icon: '🏢', count: transactions.filter(t => t.vendor === 'Vendor E').length },
              ]}
              value={vendorFilter}
              onChange={setVendorFilter}
              disabled={isLoading}
              showCount={true}
            />

            {/* Reset Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                disabled={isLoading}
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
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

      {/* Validation Details Modal */}
      {selectedTransaction && (
        <ValidationDetailsModal
          isOpen={isModalOpen}
          transaction={selectedTransaction}
          onClose={handleCloseModal}
        />
      )}
    </AppLayout>
  );
}
