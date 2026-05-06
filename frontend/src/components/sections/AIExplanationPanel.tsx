import { useState, useEffect } from 'react';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import ExpandableExplanationCard, { Explanation } from './ExpandableExplanationCard';

interface AIExplanationPanelProps {
  transactionId: string;
  isLoading?: boolean;
  error?: string;
  explanations?: Explanation[];
  onRetry?: () => void;
}

export default function AIExplanationPanel({
  transactionId,
  isLoading = false,
  error,
  explanations = [],
  onRetry,
}: AIExplanationPanelProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [aiSummary, setAiSummary] = useState('');

  // Generate AI summary from explanations
  useEffect(() => {
    if (explanations.length > 0) {
      const risks = explanations.filter((e) => e.category === 'risk').length;
      const recommendations = explanations.filter((e) => e.category === 'recommendation').length;
      const avgConfidence =
        explanations.reduce((sum, e) => sum + (e.confidence || 0), 0) /
        explanations.length;

      setAiSummary(
        `AI Analysis: ${risks} potential risks identified, ${recommendations} recommendations provided. Average confidence: ${Math.round(avgConfidence)}%.`
      );
    }
  }, [explanations]);

  const handleExpand = (id: string) => {
    setExpandedIds((prev) => new Set([...prev, id]));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            🤖 AI Analysis
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Transaction: {transactionId}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Regenerate
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <Card padding="lg" className="flex items-center justify-center py-12">
          <LoadingSpinner
            size="lg"
            text="Analyzing transaction with AI..."
            variant="accent"
          />
        </Card>
      ) : error ? (
        /* Error State */
        <Card padding="lg" className="border-l-4 border-red-400 dark:border-red-600">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-600 dark:text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-red-800 dark:text-red-300">
                Analysis failed
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-200">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-3 inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Retry
                </button>
              )}
            </div>
          </div>
        </Card>
      ) : explanations.length > 0 ? (
        <>
          {/* Summary */}
          {aiSummary && (
            <Card
              padding="lg"
              className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20"
            >
              <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
                {aiSummary}
              </p>
            </Card>
          )}

          {/* Explanations List */}
          <div className="space-y-3">
            {explanations.map((explanation) => (
              <ExpandableExplanationCard
                key={explanation.id}
                explanation={explanation}
                onExpand={handleExpand}
                defaultExpanded={expandedIds.has(explanation.id)}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="grid gap-3 md:grid-cols-3">
            <Card padding="md" className="text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Rules Analyzed</p>
              <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                {explanations.length}
              </p>
            </Card>
            <Card padding="md" className="text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Risks Found</p>
              <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                {explanations.filter((e) => e.category === 'risk').length}
              </p>
            </Card>
            <Card padding="md" className="text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Avg. Confidence</p>
              <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                {explanations.length > 0
                  ? Math.round(
                      explanations.reduce((sum, e) => sum + (e.confidence || 0), 0) /
                        explanations.length
                    )
                  : 0}
                %
              </p>
            </Card>
          </div>
        </>
      ) : (
        /* Empty State */
        <Card padding="lg" className="text-center">
          <div className="space-y-2">
            <p className="text-3xl">🔮</p>
            <p className="font-medium text-gray-900 dark:text-white">No analysis yet</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click "Regenerate" to analyze this transaction with AI
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
