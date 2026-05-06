'use client';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  info: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs font-medium',
  md: 'px-3 py-1.5 text-sm font-medium',
};

export default function Badge({
  text,
  variant = 'primary',
  size = 'sm',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full whitespace-nowrap transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {text}
    </span>
  );
}
