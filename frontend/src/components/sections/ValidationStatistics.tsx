import Card from '../common/Card';

interface ValidationRule {
  name: string;
  count: number;
  passRate: number;
  icon: string;
}

interface ValidationStatisticsProps {
  statistics: {
    rulesChecked: ValidationRule[];
    averageValidationTime: number;
    topFailingRules: ValidationRule[];
    validationTrendData?: Array<{
      date: string;
      valid: number;
      invalid: number;
      warning: number;
    }>;
  };
}

export default function ValidationStatistics({
  statistics,
}: ValidationStatisticsProps) {
  const { rulesChecked, averageValidationTime, topFailingRules } = statistics;

  return (
    <div className="space-y-6">
      {/* Rules Checked */}
      <Card variant="default" padding="lg">
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Validation Rules
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Overview of all validation rules and their performance
          </p>
        </div>

        <div className="space-y-3">
          {rulesChecked && rulesChecked.length > 0 ? (
            rulesChecked.map((rule, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{rule.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {rule.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {rule.count} checks
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {rule.passRate}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Pass Rate
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No validation rules data available
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Top Failing Rules */}
      <Card variant="default" padding="lg">
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Failing Rules
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Rules with the lowest pass rates requiring attention
          </p>
        </div>

        <div className="space-y-3">
          {topFailingRules && topFailingRules.length > 0 ? (
            topFailingRules.map((rule, index) => {
              const failRate = 100 - rule.passRate;
              return (
                <div
                  key={index}
                  className="space-y-2 rounded-lg bg-red-50 p-3 dark:bg-red-900/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{rule.icon}</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {rule.name}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                      {failRate}% Fail Rate
                    </p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-red-200 dark:bg-red-900/30">
                    <div
                      className="h-full bg-red-500 dark:bg-red-600"
                      style={{ width: `${failRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {rule.count} total checks
                  </p>
                </div>
              );
            })
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No failing rules detected
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Validation Performance */}
      <Card variant="default" padding="lg">
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance Metrics
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            System performance and validation efficiency
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/10">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Avg Validation Time
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
              {averageValidationTime}
              <span className="text-sm">ms</span>
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/10">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              System Status
            </p>
            <p className="mt-2 flex items-center gap-2">
              <span className="inline-flex h-3 w-3 rounded-full bg-green-500 dark:bg-green-400" />
              <span className="font-semibold text-green-600 dark:text-green-400">
                Operational
              </span>
            </p>
          </div>

          <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/10">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated
            </p>
            <p className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
              Now
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
