import AppLayout from '@/components/AppLayout';

export const metadata = {
  title: 'Validation | Billing Validator',
  description: 'View validation results and rules',
};

export default function ValidationPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Validation Results
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Review validation results and configure rules
          </p>
        </div>

        <div className="card">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Validation Rules
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Validation rules management interface coming soon...
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
