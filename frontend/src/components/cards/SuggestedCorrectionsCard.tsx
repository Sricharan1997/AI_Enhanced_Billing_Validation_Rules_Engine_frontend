'use client';

import { useState } from 'react';
import { Card, Badge } from '@/components/common';
import { Correction } from '@/types/correction';

interface SuggestedCorrectionsCardProps {
  corrections: Correction[];
  transactionId: string;
  onApplyClick: (correction: Correction) => void;
  isLoading?: boolean;
}

const categoryIcons: Record<string, string> = {
  amount: '💰',
  vendor: '🏢',
  date: '📅',
  description: '📝',
  other: '⚙️',
};

const impactColors: Record<string, string> = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function SuggestedCorrectionsCard({
  corrections,
  transactionId,
  onApplyClick,
  isLoading = false,
}: SuggestedCorrectionsCardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCorrections, setSelectedCorrections] = useState<Set<string>>(
    new Set()
  );

  const handleSelectCorrection = (correctionId: string) => {
    const newSelected = new Set(selectedCorrections);
    if (newSelected.has(correctionId)) {
      newSelected.delete(correctionId);
    } else {
      newSelected.add(correctionId);
    }
    setSelectedCorrections(newSelected);
  };

  if (!corrections || corrections.length === 0) {
    return (
      <Card padding="lg" variant="outlined">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">No suggested corrections available</p>
        </div>
      </Card>
    );
  }

  const avgConfidence = Math.round(
    corrections.reduce((sum, c) => sum + c.confidence, 0) / corrections.length
  );

  return (
    <Card padding="lg" variant="default" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Suggested Corrections
          </h3>
          <Badge
            variant="primary"
            text={`${corrections.length} correction${corrections.length !== 1 ? 's' : ''}`}
          />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Avg. Confidence
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {avgConfidence}%
          </p>
        </div>
      </div>

      {/* Corrections List */}
      <div className="space-y-3">
        {corrections.map((correction) => (
          <div
            key={correction.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            {/* Correction Item Header */}
            <button
              onClick={() =>
                setExpandedId(expandedId === correction.id ? null : correction.id)
              }
              disabled={isLoading}
              className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 text-left">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedCorrections.has(correction.id)}
                    onChange={() => handleSelectCorrection(correction.id)}
                    disabled={isLoading}
                    className="mt-1 w-4 h-4 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {categoryIcons[correction.category]}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {correction.field}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          impactColors[correction.impact]
                        }`}
                      >
                        {correction.impact} impact
                      </span>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                        {correction.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {correction.reason}
                    </p>
                  </div>
                </div>

                {/* Chevron */}
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className={`w-5 h-5 text-gray-400 dark:text-gray-600 transition-transform ${
                      expandedId === correction.id ? 'rotate-180' : ''
                    }`}
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
            </button>

            {/* Expanded Details */}
            {expandedId === correction.id && (
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 space-y-4">
                {/* Current vs Suggested */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Current Value
                    </label>
                    <div className="p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded font-mono text-sm text-gray-900 dark:text-white break-all">
                      {String(correction.currentValue)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Suggested Value
                    </label>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded font-mono text-sm text-green-900 dark:text-green-200 break-all font-semibold">
                      {String(correction.suggestedValue)}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => onApplyClick(correction)}
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>✓</span>
                  <span>Apply This Correction</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedCorrections.size > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedCorrections.size} correction{selectedCorrections.size !== 1 ? 's' : ''} selected
          </p>
          <button
            disabled={isLoading}
            className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Selected
          </button>
        </div>
      )}
    </Card>
  );
}
