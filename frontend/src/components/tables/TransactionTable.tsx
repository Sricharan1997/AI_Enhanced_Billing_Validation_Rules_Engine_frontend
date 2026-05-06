'use client';

import { Transaction } from '@/types/transaction';
import EmptyState from '../common/EmptyState';
import ValidationBadge from '../common/ValidationBadge';
import Button from '../common/Button';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onViewDetails?: (transaction: Transaction) => void;
  onRowClick?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  hasError?: boolean;
}

const statusConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
  pending: {
    label: 'Pending',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    textColor: 'text-yellow-800 dark:text-yellow-400',
  },
  passed: {
    label: 'Passed',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    textColor: 'text-green-800 dark:text-green-400',
  },
  failed: {
    label: 'Failed',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    textColor: 'text-red-800 dark:text-red-400',
  },
  warning: {
    label: 'Warning',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    textColor: 'text-orange-800 dark:text-orange-400',
  },
};

export default function TransactionTable({
  transactions,
  isLoading = false,
  onViewDetails,
  onRowClick,
  onDelete,
  hasError = false,
}: TransactionTableProps) {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-gray-50 py-12 dark:bg-gray-800">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-8 w-8 animate-spin text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <EmptyState
        title="Error Loading Transactions"
        description="There was an error loading your transactions. Please try again."
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No Transactions"
        description="You don't have any transactions yet. Create one to get started."
        actionLabel="New Transaction"
        onAction={() => console.log('Create new transaction')}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Transaction ID
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Vendor
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Amount
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Status
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Validation
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Date
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((transaction) => {
            const statusInfo = statusConfig[transaction.status];
            return (
              <tr
                key={transaction.id}
                onClick={() => onRowClick?.(transaction)}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.transactionId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {transaction.vendor}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(transaction.amount, transaction.currency)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}
                  >
                    {statusInfo.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <ValidationBadge
                    status={transaction.validationStatus || 'unvalidated'}
                    size="sm"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {onViewDetails && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails(transaction)}
                      >
                        View
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDelete(transaction.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
