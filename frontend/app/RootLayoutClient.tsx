'use client';

import { ToastProvider } from '@/providers/ToastProvider';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <ToastProvider>{children}</ToastProvider>
    </ErrorBoundary>
  );
}
