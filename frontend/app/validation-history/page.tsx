'use client';

import { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import ValidationHistoryTable, {
  ValidationHistoryRecord,
} from '@/components/tables/ValidationHistoryTable';
import Pagination from '@/components/common/Pagination';
import { Card, SearchBar, FilterDropdown } from '@/components/common';
import { useToast } from '@/providers/ToastProvider';

// Mock validation history data
const mockValidationHistory: ValidationHistoryRecord[] = [
  {
    id: '1',
    transactionId: 'TXN-001234',
    vendor: 'Vendor A',
    amount: 1250.0,
    currency: 'USD',
    status: 'valid',
    rulesFailed: 0,
    rulesWarning: 0,
    rulesTotal: 6,
    timestamp: '2026-05-07T10:31:00Z',
    duration: 245,
    validatedBy: 'System',
  },
  {
    id: '2',
    transactionId: 'TXN-001233',
    vendor: 'Vendor B',
    amount: 2100.0,
    currency: 'USD',
    status: 'invalid',
    rulesFailed: 2,
    rulesWarning: 0,
    rulesTotal: 6,
    timestamp: '2026-05-07T09:16:00Z',
    duration: 312,
    validatedBy: 'System',
  },
  {
    id: '3',
    transactionId: 'TXN-001232',
    vendor: 'Vendor C',
    amount: 895.5,
    currency: 'USD',
    status: 'valid',
    rulesFailed: 0,
    rulesWarning: 0,
    rulesTotal: 6,
    timestamp: '2026-05-06T14:46:00Z',
    duration: 198,
    validatedBy: 'System',
  },
  {
    id: '4',
    transactionId: 'TXN-001231',
    vendor: 'Vendor D',
    amount: 550.0,
    currency: 'USD',
    status: 'warning',
    rulesFailed: 0,
    rulesWarning: 2,
    rulesTotal: 6,
    timestamp: '2026-05-06T11:21:00Z',
    duration: 267,
    validatedBy: 'System',
  },
  {
    id: '5',
    transactionId: 'TXN-001230',
    vendor: 'Vendor E',
    amount: 3200.0,
    currency: 'USD',
    status: 'unvalidated',
    rulesFailed: 0,
    rulesWarning: 0,
    rulesTotal: 0,
    timestamp: '2026-05-05T16:30:00Z',
    duration: 0,
    validatedBy: 'Pending',
  },
  {
    id: '6',
    transactionId: 'TXN-001229',
    vendor: 'Vendor A',
    amount: 1875.25,
    currency: 'USD',
    status: 'valid',
    rulesFailed: 0,
    rulesWarning: 0,
    rulesTotal: 6,
    timestamp: '2026-05-05T14:15:00Z',
    duration: 223,
    validatedBy: 'System',
  },
  {
    id: '7',
    transactionId: 'TXN-001228',
    vendor: 'Vendor B',
    amount: 650.0,
    currency: 'USD',
    status: 'valid',
    rulesFailed: 0,
    rulesWarning: 0,
    rulesTotal: 6,
    timestamp: '2026-05-05T10:42:00Z',
    duration: 189,
    validatedBy: 'System',
  },
  {
    id: '8',
    transactionId: 'TXN-001227',
    vendor: 'Vendor C',
    amount: 4200.75,
    currency: 'USD',
    status: 'invalid',
    rulesFailed: 1,
    rulesWarning: 1,
    rulesTotal: 6,
    timestamp: '2026-05-04T15:30:00Z',
    duration: 334,
    validatedBy: 'System',
  },
  {
    id: '9',
    transactionId: 'TXN-001226',
    vendor: 'Vendor D',
    amount: 780.5,
    currency: 'USD',
    status: 'valid',
    rulesFailed: 0,
    rulesWarning: 0,
    rulesTotal: 6,
    timestamp: '2026-05-04T12:20:00Z',
    duration: 201,
    validatedBy: 'System',
  },
  {
    id: '10',
    transactionId: 'TXN-001225',
    vendor: 'Vendor E',
    amount: 2450.0,
    currency: 'USD',
    status: 'warning',
    rulesFailed: 0,
    rulesWarning: 1,
    rulesTotal: 6,
    timestamp: '2026-05-04T09:50:00Z',
    duration: 256,
    validatedBy: 'System',
  },
];

export default function ValidationHistoryPage() {
  const { showToast } = useToast();
  const [validationHistory, setValidationHistory] = useState(mockValidationHistory);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ValidationHistoryRecord | null>(null);
  const [revalidatingId, setRevalidatingId] = useState<string | null>(null);

  // Filter records based on search and filters
  const filteredRecords = useMemo(() => {
    return validationHistory.filter((record) => {
      const matchesSearch =
        !searchQuery ||
        record.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.vendor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !statusFilter || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, validationHistory]);

  // Paginate filtered records
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = validationHistory.length;
    const valid = validationHistory.filter((r) => r.status === 'valid').length;
    const invalid = validationHistory.filter((r) => r.status === 'invalid').length;
    const warning = validationHistory.filter((r) => r.status === 'warning').length;
    const avgDuration =
      validationHistory.reduce((sum, r) => sum + r.duration, 0) /
      validationHistory.length;

    return { total, valid, invalid, warning, avgDuration: Math.round(avgDuration) };
  }, [validationHistory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleRetry = async (recordId: string) => {
    setRevalidatingId(recordId);
    
    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update the record with new validation result
      const updatedHistory = validationHistory.map((record) => {
        if (record.id === recordId) {
          return {
            ...record,
            status: 'valid' as const,
            rulesFailed: 0,
            rulesWarning: 0,
            duration: Math.floor(Math.random() * (300 - 150 + 1)) + 150,
            timestamp: new Date().toISOString(),
          };
        }
        return record;
      });

      setValidationHistory(updatedHistory);

      // Update selected record if it's the one being revalidated
      if (selectedRecord?.id === recordId) {
        const updatedRecord = updatedHistory.find((r) => r.id === recordId);
        if (updatedRecord) {
          setSelectedRecord(updatedRecord);
        }
      }

      // Show success notification
      showToast({
        message: `Transaction ${recordId} has been successfully revalidated`,
        type: 'success',
        duration: 5000,
      });

      console.log('Revalidation successful for record:', recordId);
    } catch (error) {
      // Show error notification
      showToast({
        message: `Failed to revalidate transaction ${recordId}`,
        type: 'error',
        duration: 5000,
      });

      console.error('Revalidation error:', error);
    } finally {
      setRevalidatingId(null);
    }
  };

  const handleRowClick = (record: ValidationHistoryRecord) => {
    setSelectedRecord(record);
    console.log('Viewing record:', record);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Validation History
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View the complete history of all validation checks and their results
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card padding="lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Validations
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </p>
          </Card>
          <Card padding="lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Valid
            </p>
            <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.valid}
            </p>
          </Card>
          <Card padding="lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Invalid
            </p>
            <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.invalid}
            </p>
          </Card>
          <Card padding="lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Warnings
            </p>
            <p className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.warning}
            </p>
          </Card>
          <Card padding="lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg Duration
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.avgDuration}ms
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="lg" className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Filters
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by Transaction ID or Vendor..."
              showClearButton={true}
            />

            <FilterDropdown
              label="Status"
              options={[
                { label: 'All Statuses', value: '', count: filteredRecords.length },
                {
                  label: 'Valid',
                  value: 'valid',
                  icon: '✅',
                  count: validationHistory.filter((r) => r.status === 'valid')
                    .length,
                },
                {
                  label: 'Invalid',
                  value: 'invalid',
                  icon: '❌',
                  count: validationHistory.filter((r) => r.status === 'invalid')
                    .length,
                },
                {
                  label: 'Warning',
                  value: 'warning',
                  icon: '⚠️',
                  count: validationHistory.filter((r) => r.status === 'warning')
                    .length,
                },
                {
                  label: 'Unvalidated',
                  value: 'unvalidated',
                  icon: '👁',
                  count: validationHistory.filter((r) => r.status === 'unvalidated')
                    .length,
                },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              showCount={true}
            />

            <div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('');
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </Card>

        {/* Validation History Table */}
        <ValidationHistoryTable
          records={paginatedRecords}
          isLoading={false}
          onRowClick={handleRowClick}
          onRetry={handleRetry}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRecords.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}

        {/* Selected Record Details */}
        {selectedRecord && (
          <Card variant="elevated" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Selected Record: {selectedRecord.transactionId}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Vendor: {selectedRecord.vendor} | Amount: $
                  {selectedRecord.amount} | Duration: {selectedRecord.duration}ms
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRetry(selectedRecord.id)}
                  disabled={revalidatingId === selectedRecord.id}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400 dark:hover:bg-blue-500"
                >
                  {revalidatingId === selectedRecord.id ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Revalidating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
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
                      Revalidate
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
