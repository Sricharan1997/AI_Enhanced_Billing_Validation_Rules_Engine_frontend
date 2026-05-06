'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { AIExplanationPanel } from '@/components/sections';
import { Card, SearchBar, FilterDropdown } from '@/components/common';
import { Explanation } from '@/components/cards';

// Mock AI explanations data
const mockExplanations: Explanation[] = [
  {
    id: '1',
    title: 'Amount Verification Rule Applied',
    explanation:
      'The transaction amount of $1,250 is within the normal range for this vendor. The AI detected that similar transactions from Vendor A typically range between $1,000-$1,500, making this a standard transaction.',
    confidence: 95,
    category: 'rule',
    tags: ['amount-check', 'vendor-pattern', 'normal-range'],
  },
  {
    id: '2',
    title: 'Vendor Authentication Issue',
    explanation:
      'The vendor authentication check passed successfully. The system cross-referenced the vendor information with your approved vendors list and found a perfect match with all required documentation in place.',
    confidence: 98,
    category: 'recommendation',
    tags: ['vendor-check', 'compliance', 'approved'],
  },
  {
    id: '3',
    title: 'Potential Duplicate Detected',
    explanation:
      'The AI found 2 similar transactions from the same vendor within the last week. While they are not exact duplicates, you may want to review them to ensure they are legitimate separate transactions and not processing errors.',
    confidence: 72,
    category: 'risk',
    tags: ['duplicate-check', 'vendor-pattern', 'review-recommended'],
  },
  {
    id: '4',
    title: 'Budget Threshold Warning',
    explanation:
      'This transaction uses 18% of your remaining monthly budget for this category. The AI recommends monitoring spending to ensure you stay within budget. Current spend: $1,250 / $7,000 monthly limit.',
    confidence: 89,
    category: 'risk',
    tags: ['budget-alert', 'spending-trend', 'threshold-80%'],
  },
  {
    id: '5',
    title: 'Compliance Check Passed',
    explanation:
      'All compliance rules have been checked and passed. The transaction meets your organization\'s policies including approval authority, tax compliance, and audit trail requirements.',
    confidence: 100,
    category: 'recommendation',
    tags: ['compliance', 'audit-ready', 'approved'],
  },
];

export default function AIInsightsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState('TXN-001234');
  const [isLoading, setIsLoading] = useState(false);
  const [explanations, setExplanations] = useState<Explanation[]>(mockExplanations);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const handleRetry = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const filteredExplanations = explanations.filter((exp) => {
    const matchesSearch =
      !searchQuery ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.explanation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !categoryFilter || exp.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            AI Insights
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Get AI-powered recommendations and insights for your billing validation
          </p>
        </div>

        {/* Filters */}
        <Card padding="lg" className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Filter Insights
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search insights..."
              showClearButton={true}
            />

            <FilterDropdown
              label="Category"
              options={[
                { label: 'All Categories', value: '', count: filteredExplanations.length },
                {
                  label: 'Rules',
                  value: 'rule',
                  icon: '📋',
                  count: explanations.filter((e) => e.category === 'rule').length,
                },
                {
                  label: 'Risks',
                  value: 'risk',
                  icon: '⚠️',
                  count: explanations.filter((e) => e.category === 'risk').length,
                },
                {
                  label: 'Recommendations',
                  value: 'recommendation',
                  icon: '💡',
                  count: explanations.filter((e) => e.category === 'recommendation').length,
                },
                {
                  label: 'Insights',
                  value: 'insight',
                  icon: '🔍',
                  count: explanations.filter((e) => e.category === 'insight').length,
                },
              ]}
              value={categoryFilter}
              onChange={setCategoryFilter}
              showCount={true}
            />
          </div>
        </Card>

        {/* AI Explanation Panel */}
        <AIExplanationPanel
          transactionId={selectedTransaction}
          isLoading={isLoading}
          explanations={filteredExplanations}
          onRetry={handleRetry}
        />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card padding="lg" className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Insights
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {explanations.length}
            </p>
          </Card>

          <Card padding="lg" className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              High Confidence
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {explanations.filter((e) => (e.confidence || 0) >= 90).length}
            </p>
          </Card>

          <Card padding="lg" className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Risks Detected
            </p>
            <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
              {explanations.filter((e) => e.category === 'risk').length}
            </p>
          </Card>

          <Card padding="lg" className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Avg. Confidence
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(
                explanations.reduce((sum, e) => sum + (e.confidence || 0), 0) /
                  explanations.length
              )}
              %
            </p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
