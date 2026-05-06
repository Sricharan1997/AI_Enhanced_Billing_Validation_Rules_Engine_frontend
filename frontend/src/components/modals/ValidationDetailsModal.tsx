'use client';

import Modal from '../common/Modal';
import { Transaction, ValidationDetail } from '@/types/transaction';
import ValidationBadge from '../common/ValidationBadge';

interface ValidationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function ValidationDetailsModal({
  isOpen,
  onClose,
  transaction,
}: ValidationDetailsModalProps) {
  if (!transaction) return null;

  const severityConfig: Record<
    string,
    { bgColor: string; textColor: string; icon: React.ReactNode }
  > = {
    error: {
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-800 dark:text-red-300',
      icon: (
        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    warning: {
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-800 dark:text-yellow-300',
      icon: (
        <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-800 dark:text-blue-300',
      icon: (
        <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  const hasValidationDetails =
    transaction.validationDetails && transaction.validationDetails.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Validation Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Transaction Summary */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Transaction ID
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {transaction.transactionId}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Amount
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: transaction.currency,
                }).format(transaction.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Validation Status
              </p>
              <div className="mt-1">
                <ValidationBadge status={transaction.validationStatus || 'unvalidated'} />
              </div>
            </div>
          </div>
        </div>

        {/* Validation Messages */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
            Validation Rules
          </h3>

          {hasValidationDetails ? (
            <div className="space-y-3">
              {transaction.validationDetails!.map((detail, index) => {
                const config = severityConfig[detail.severity];
                return (
                  <div
                    key={index}
                    className={`rounded-lg border border-opacity-20 p-4 ${config.bgColor}`}
                  >
                    <div className="flex items-start gap-3">
                      {config.icon}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={`font-medium capitalize ${config.textColor}`}
                          >
                            {detail.severity}
                          </p>
                          {detail.timestamp && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }).format(new Date(detail.timestamp))}
                            </p>
                          )}
                        </div>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                          {detail.rule}
                        </p>
                        <p className={`mt-1 text-sm ${config.textColor}`}>
                          {detail.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                No validation messages available
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                This transaction has not been validated yet
              </p>
            </div>
          )}
        </div>

        {/* Transaction Details */}
        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            Transaction Details
          </h3>
          <dl className="grid gap-3 md:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Vendor
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {transaction.vendor}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Date
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(transaction.date))}
              </dd>
            </div>
            {transaction.description && (
              <div className="md:col-span-2">
                <dt className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Description
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {transaction.description}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </Modal>
  );
}
