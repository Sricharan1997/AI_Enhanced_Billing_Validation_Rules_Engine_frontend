'use client';

import { Modal, Button } from '@/components/common';
import { Correction } from '@/types/correction';

interface CorrectionPreviewModalProps {
  isOpen: boolean;
  correction: Correction | null;
  transactionData?: Record<string, any>;
  onClose: () => void;
  onConfirm: (correction: Correction) => void;
  isLoading?: boolean;
}

const categoryLabels: Record<string, string> = {
  amount: 'Amount',
  vendor: 'Vendor',
  date: 'Date',
  description: 'Description',
  other: 'Other',
};

export default function CorrectionPreviewModal({
  isOpen,
  correction,
  transactionData = {},
  onClose,
  onConfirm,
  isLoading = false,
}: CorrectionPreviewModalProps) {
  if (!correction) return null;

  const impactColor = {
    low: 'text-blue-600 dark:text-blue-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    high: 'text-red-600 dark:text-red-400',
  }[correction.impact];

  const impactBgColor = {
    low: 'bg-blue-100 dark:bg-blue-900/30',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30',
    high: 'bg-red-100 dark:bg-red-900/30',
  }[correction.impact];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Preview Correction
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Review the changes before applying this correction
          </p>
        </div>

        {/* Correction Details */}
        <div className={`p-4 rounded-lg ${impactBgColor} border border-current border-opacity-20`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {categoryLabels[correction.category]} Correction
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                {correction.reason}
              </p>
            </div>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${impactColor}`}>
              {correction.impact.toUpperCase()} IMPACT
            </span>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Confidence Score
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${correction.confidence}%` }}
              />
            </div>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {correction.confidence}%
            </span>
          </div>
        </div>

        {/* Current vs Suggested */}
        <div className="space-y-3">
          {/* Current Value */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Current Value
            </label>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
              <p className="font-mono text-sm text-red-900 dark:text-red-200 break-all">
                {String(correction.currentValue)}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>

          {/* Suggested Value */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Suggested Value
            </label>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
              <p className="font-mono text-sm font-semibold text-green-900 dark:text-green-200 break-all">
                {String(correction.suggestedValue)}
              </p>
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
            <span>ℹ️</span>
            <span>What will change?</span>
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>The {correction.field.toLowerCase()} field will be updated</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Validation rules will be re-evaluated</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Transaction history will record this change</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm(correction);
              onClose();
            }}
            isLoading={isLoading}
            className="flex-1"
          >
            Apply Correction
          </Button>
        </div>
      </div>
    </Modal>
  );
}
