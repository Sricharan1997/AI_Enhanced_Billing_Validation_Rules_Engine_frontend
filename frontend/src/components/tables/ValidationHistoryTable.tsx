import Card from '../common/Card';
import ValidationBadge from '../common/ValidationBadge';
import EmptyState from '../common/EmptyState';

export interface ValidationHistoryRecord {
  id: string;
  transactionId: string;
  vendor: string;
  amount: number;
  currency: string;
  status: 'valid' | 'invalid' | 'warning' | 'unvalidated';
  rulesFailed: number;
  rulesWarning: number;
  rulesTotal: number;
  timestamp: string;
  duration: number; // in milliseconds
  validatedBy?: string;
}

interface ValidationHistoryTableProps {
  records: ValidationHistoryRecord[];
  isLoading?: boolean;
  onRowClick?: (record: ValidationHistoryRecord) => void;
  onRetry?: (recordId: string) => void;
}

export default function ValidationHistoryTable({
  records,
  isLoading = false,
  onRowClick,
  onRetry,
}: ValidationHistoryTableProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Loading validation history...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (records.length === 0) {
    return (
      <Card>
        <EmptyState
          title="No Validation History"
          description="Start validating transactions to see their history here"
          icon="📋"
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Rules
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => {
              const date = new Date(record.timestamp);
              const timeStr = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }).format(date);

              const amountStr = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: record.currency,
              }).format(record.amount);

              return (
                <tr
                  key={record.id}
                  onClick={() => onRowClick?.(record)}
                  className={`border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {/* Transaction ID */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    <span className="rounded-full bg-blue-100 px-3 py-1 font-mono text-xs dark:bg-blue-900/30 dark:text-blue-300">
                      {record.transactionId}
                    </span>
                  </td>

                  {/* Vendor */}
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {record.vendor}
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                    {amountStr}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 text-sm">
                    <ValidationBadge status={record.status} size="sm" />
                  </td>

                  {/* Rules */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">
                        {record.rulesTotal} total
                      </span>
                      {record.rulesFailed > 0 && (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                          {record.rulesFailed} failed
                        </span>
                      )}
                      {record.rulesWarning > 0 && (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                          {record.rulesWarning} warning
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700">
                      {record.duration}ms
                    </span>
                  </td>

                  {/* Timestamp */}
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {timeStr}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      {onRetry && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRetry(record.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Retry
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick?.(record);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
