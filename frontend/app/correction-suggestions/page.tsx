'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { SuggestedCorrectionsCard } from '@/components/cards';
import { CorrectionPreviewModal } from '@/components/common';
import { Card } from '@/components/common';
import { Correction, CorrectionBatch } from '@/types/correction';
import { useToast } from '@/providers/ToastProvider';

// Mock corrections data
const mockCorrections: Correction[] = [
  {
    id: 'corr-001',
    field: 'Vendor Name',
    currentValue: 'Acme Corp Ltd',
    suggestedValue: 'Acme Corporation',
    reason: 'Standardized vendor name matches approved vendor list',
    confidence: 98,
    category: 'vendor',
    impact: 'low',
  },
  {
    id: 'corr-002',
    field: 'Transaction Amount',
    currentValue: '$1,250.00',
    suggestedValue: '$1,250.50',
    reason: 'Amount corrected based on itemized receipt verification',
    confidence: 92,
    category: 'amount',
    impact: 'medium',
  },
  {
    id: 'corr-003',
    field: 'Invoice Date',
    currentValue: '2026-05-01',
    suggestedValue: '2026-05-07',
    reason: 'Corrected to match actual invoice date from vendor',
    confidence: 85,
    category: 'date',
    impact: 'low',
  },
  {
    id: 'corr-004',
    field: 'Description',
    currentValue: 'Office supplies',
    suggestedValue: 'Office supplies - Q2 inventory replenishment',
    reason: 'Enhanced description for better tracking and audit purposes',
    confidence: 78,
    category: 'description',
    impact: 'low',
  },
  {
    id: 'corr-005',
    field: 'Department Code',
    currentValue: 'DEPT-001',
    suggestedValue: 'DEPT-002',
    reason: 'Corrected based on expense category and budget code',
    confidence: 88,
    category: 'other',
    impact: 'high',
  },
];

const mockTransactionData = {
  id: 'txn-12345',
  transactionId: 'TXN-001234',
  vendor: 'Acme Corp Ltd',
  amount: 1250.0,
  currency: 'USD',
  date: '2026-05-01',
  description: 'Office supplies',
  status: 'pending',
};

export default function CorrectionSuggestionsPage() {
  const [selectedCorrection, setSelectedCorrection] = useState<Correction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedCorrections, setAppliedCorrections] = useState<Set<string>>(
    new Set()
  );
  const { showToast } = useToast();

  const handleApplyClick = (correction: Correction) => {
    setSelectedCorrection(correction);
    setIsModalOpen(true);
  };

  const handleConfirmCorrection = async (correction: Correction) => {
    setIsApplying(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAppliedCorrections((prev) => new Set([...prev, correction.id]));
      showToast({
        message: `✓ Correction applied: ${correction.field} updated successfully`,
        type: 'success',
        duration: 4000,
      });

      // Filter out applied correction from display
      setSelectedCorrection(null);
    } catch (error) {
      showToast({
        message: '✗ Failed to apply correction. Please try again.',
        type: 'error',
        duration: 4000,
      });
    } finally {
      setIsApplying(false);
    }
  };

  // Filter out already applied corrections
  const availableCorrections = mockCorrections.filter(
    (c) => !appliedCorrections.has(c.id)
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Correction Suggestions
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Review and apply suggested corrections to your transactions
          </p>
        </div>

        {/* Transaction Info */}
        <Card padding="lg" variant="outlined">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold tracking-wider mb-1">
                Transaction ID
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {mockTransactionData.transactionId}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold tracking-wider mb-1">
                Vendor
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {mockTransactionData.vendor}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold tracking-wider mb-1">
                Amount
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${mockTransactionData.amount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold tracking-wider mb-1">
                Date
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(mockTransactionData.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Correction Status */}
        {appliedCorrections.size > 0 && (
          <Card
            padding="lg"
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-green-900 dark:text-green-200">
                  {appliedCorrections.size} correction
                  {appliedCorrections.size !== 1 ? 's' : ''} applied
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Transaction will be re-validated with updated information
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Corrections Card */}
        {availableCorrections.length > 0 ? (
          <SuggestedCorrectionsCard
            corrections={availableCorrections}
            transactionId={mockTransactionData.id}
            onApplyClick={handleApplyClick}
            isLoading={isApplying}
          />
        ) : (
          <Card padding="lg" variant="outlined" className="text-center">
            <div className="py-8">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                ✓ All corrections applied
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                This transaction has been updated with all available corrections
              </p>
            </div>
          </Card>
        )}

        {/* Info Section */}
        <Card padding="lg" variant="outlined" className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            How corrections work
          </h3>
          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-lg">1️⃣</span>
              <span>
                Review each suggested correction and understand why it's
                recommended
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">2️⃣</span>
              <span>
                Click on a correction to expand details and see the confidence
                score
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">3️⃣</span>
              <span>
                Click "Apply This Correction" to preview the change in a modal
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">4️⃣</span>
              <span>
                Confirm the correction to apply it and re-validate the transaction
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">5️⃣</span>
              <span>
                Applied corrections are tracked in the transaction history
              </span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Correction Preview Modal */}
      <CorrectionPreviewModal
        isOpen={isModalOpen}
        correction={selectedCorrection}
        transactionData={mockTransactionData}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCorrection}
        isLoading={isApplying}
      />
    </AppLayout>
  );
}
