import { useState } from 'react';
import Card from './Card';

export interface Explanation {
  id: string;
  title: string;
  explanation: string;
  confidence?: number; // 0-100
  category?: 'rule' | 'risk' | 'recommendation' | 'insight';
  tags?: string[];
}

interface ExpandableExplanationCardProps {
  explanation: Explanation;
  isLoading?: boolean;
  onExpand?: (id: string) => void;
  defaultExpanded?: boolean;
}

export default function ExpandableExplanationCard({
  explanation,
  isLoading = false,
  onExpand,
  defaultExpanded = false,
}: ExpandableExplanationCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (newExpanded) {
      onExpand?.(explanation.id);
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'rule':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-300',
          icon: '📋',
        };
      case 'risk':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-300',
          icon: '⚠️',
        };
      case 'recommendation':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-300',
          icon: '💡',
        };
      case 'insight':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-700 dark:text-purple-300',
          icon: '🔍',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          icon: '📌',
        };
    }
  };

  const categoryStyle = getCategoryColor(explanation.category);

  return (
    <Card
      padding="lg"
      className={`cursor-pointer transition-all hover:shadow-md ${
        isExpanded ? 'ring-2 ring-blue-300 dark:ring-blue-700' : ''
      }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <div className="h-6 w-6 animate-spin rounded-full border-3 border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
        </div>
      ) : (
        <>
          {/* Header */}
          <button
            onClick={handleToggle}
            className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryStyle.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {explanation.title}
                  </h3>
                  {explanation.confidence !== undefined && (
                    <span
                      className={`ml-auto text-xs font-medium px-2 py-1 rounded ${categoryStyle.bg} ${categoryStyle.text}`}
                    >
                      {explanation.confidence}% confidence
                    </span>
                  )}
                </div>

                {/* Tags */}
                {explanation.tags && explanation.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {explanation.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {explanation.tags.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                        +{explanation.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Expand/Collapse Icon */}
              <div className="flex-shrink-0 ml-2">
                <svg
                  className={`h-5 w-5 transition-transform text-gray-500 dark:text-gray-400 ${
                    isExpanded ? 'rotate-180' : ''
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

          {/* Expanded Content */}
          {isExpanded && (
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Explanation
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {explanation.explanation}
                  </p>
                </div>

                {/* Category Badge */}
                <div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${categoryStyle.bg} ${categoryStyle.text}`}
                  >
                    {categoryStyle.icon} {explanation.category}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    Learn more
                  </button>
                  <button className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    Report issue
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
