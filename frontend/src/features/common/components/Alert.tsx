import React from 'react';

interface AlertProps {
  type?: 'error' | 'success' | 'info' | 'warning';
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  message,
  className = '',
}) => {
  const styles = {
    error:
      'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900',
    success:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
    info:
      'bg-cyan-50 dark:bg-cyan-950/40 text-primary dark:text-primary-light border-cyan-200 dark:border-cyan-900',
    warning:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900',
  };

  return (
    <div
      className={`p-3.5 rounded-lg border text-sm font-medium flex items-center gap-2 ${styles[type]} ${className}`}
      role="alert"
    >
      <span>{message}</span>
    </div>
  );
};
