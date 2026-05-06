import AppLayout from '@/components/AppLayout';

export const metadata = {
  title: 'Transactions | Billing Validator',
  description: 'View and manage your transactions',
};

export default function TransactionsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Transactions
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage all your billing transactions
          </p>
        </div>

        <div className="card">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Transactions
            </h2>
            <button className="btn-primary rounded-lg">New Transaction</button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Transaction management interface coming soon...
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
