import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const variantClasses = {
    default:
      'rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
    outlined:
      'rounded-lg border-2 border-gray-300 bg-transparent dark:border-gray-600',
    elevated:
      'rounded-lg bg-white shadow-lg dark:bg-gray-800 dark:shadow-2xl',
  };

  return (
    <div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} transition-all ${className}`}
    >
      {children}
    </div>
  );
}
