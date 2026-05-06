import AppLayout from '@/components/AppLayout';

export const metadata = {
  title: 'AI Insights | Billing Validator',
  description: 'View AI-powered insights and recommendations',
};

export default function AIInsightsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            AI Insights
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Get AI-powered recommendations and insights for your billing validation
          </p>
        </div>

        <div className="card">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Smart Recommendations
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI insights interface coming soon...
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
