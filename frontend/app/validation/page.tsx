'use client';

import AppLayout from '@/components/AppLayout';
import { ValidationSummaryCard, ValidationStatistics } from '@/components/sections';

export default function ValidationPage() {
  // Mock data for validation statistics
  const totalTransactions = 156;
  const validTransactions = 98;
  const invalidTransactions = 34;
  const warningTransactions = 18;
  const unvalidatedTransactions = 6;

  const validationStats = {
    rulesChecked: [
      {
        name: 'Amount Verification',
        count: 156,
        passRate: 92.3,
        icon: '💰',
      },
      {
        name: 'Vendor Authentication',
        count: 156,
        passRate: 88.5,
        icon: '🏢',
      },
      {
        name: 'PO Matching',
        count: 156,
        passRate: 85.2,
        icon: '📋',
      },
      {
        name: 'Duplicate Detection',
        count: 156,
        passRate: 94.1,
        icon: '🔍',
      },
      {
        name: 'Budget Check',
        count: 156,
        passRate: 79.8,
        icon: '💳',
      },
      {
        name: 'Compliance Rules',
        count: 156,
        passRate: 91.7,
        icon: '✅',
      },
    ],
    topFailingRules: [
      {
        name: 'Budget Check',
        count: 32,
        passRate: 79.8,
        icon: '💳',
      },
      {
        name: 'PO Matching',
        count: 23,
        passRate: 85.2,
        icon: '📋',
      },
      {
        name: 'Vendor Authentication',
        count: 18,
        passRate: 88.5,
        icon: '🏢',
      },
    ],
    averageValidationTime: 245,
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Validation Results
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Review validation results, rules performance, and statistics
          </p>
        </div>

        {/* Validation Summary Card */}
        <ValidationSummaryCard
          totalTransactions={totalTransactions}
          validTransactions={validTransactions}
          invalidTransactions={invalidTransactions}
          warningTransactions={warningTransactions}
          unvalidatedTransactions={unvalidatedTransactions}
        />

        {/* Validation Statistics Section */}
        <ValidationStatistics statistics={validationStats} />
      </div>
    </AppLayout>
  );
}
