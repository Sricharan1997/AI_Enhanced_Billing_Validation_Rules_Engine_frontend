import Card from '../common/Card';
import ValidationBadge from '../common/ValidationBadge';

interface ValidationSummaryCardProps {
  totalTransactions: number;
  validTransactions: number;
  invalidTransactions: number;
  warningTransactions: number;
  unvalidatedTransactions: number;
}

export default function ValidationSummaryCard({
  totalTransactions,
  validTransactions,
  invalidTransactions,
  warningTransactions,
  unvalidatedTransactions,
}: ValidationSummaryCardProps) {
  const validationRate =
    totalTransactions > 0
      ? ((validTransactions / totalTransactions) * 100).toFixed(1)
      : 0;

  return (
    <Card variant="elevated" padding="lg" className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Validation Summary
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Overall validation status of your transactions
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Total */}
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalTransactions}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Total Transactions
          </p>
        </div>

        {/* Valid */}
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {validTransactions}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Valid
          </p>
          <div className="mt-2 flex justify-center">
            <ValidationBadge status="valid" size="sm" />
          </div>
        </div>

        {/* Invalid */}
        <div className="text-center">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {invalidTransactions}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Invalid
          </p>
          <div className="mt-2 flex justify-center">
            <ValidationBadge status="invalid" size="sm" />
          </div>
        </div>

        {/* Warning */}
        <div className="text-center">
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {warningTransactions}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Warnings
          </p>
          <div className="mt-2 flex justify-center">
            <ValidationBadge status="warning" size="sm" />
          </div>
        </div>

        {/* Unvalidated */}
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
            {unvalidatedTransactions}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Unvalidated
          </p>
          <div className="mt-2 flex justify-center">
            <ValidationBadge status="unvalidated" size="sm" />
          </div>
        </div>
      </div>

      {/* Validation Rate Bar */}
      <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Validation Rate
          </span>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {validationRate}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
            style={{ width: `${validationRate}%` }}
          />
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid gap-3 border-t border-gray-200 dark:border-gray-700 pt-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
            Success
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalTransactions > 0
              ? (((validTransactions + warningTransactions) / totalTransactions) * 100).toFixed(1)
              : 0}
            %
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Valid + Warnings
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
            Failed
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {totalTransactions > 0
              ? ((invalidTransactions / totalTransactions) * 100).toFixed(1)
              : 0}
            %
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Invalid transactions
          </p>
        </div>
      </div>
    </Card>
  );
}
