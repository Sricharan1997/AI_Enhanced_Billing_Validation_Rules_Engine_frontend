interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
}

export default function LoadingSpinner({
  size = 'md',
  text,
  fullScreen = false,
  variant = 'primary',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const variantClasses = {
    primary: 'border-blue-600 dark:border-blue-400 border-t-blue-300 dark:border-t-blue-600',
    secondary: 'border-gray-600 dark:border-gray-400 border-t-gray-300 dark:border-t-gray-600',
    accent: 'border-purple-600 dark:border-purple-400 border-t-purple-300 dark:border-t-purple-600',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 ${variantClasses[variant]} dark:border-gray-700`}
      />
      {text && (
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
