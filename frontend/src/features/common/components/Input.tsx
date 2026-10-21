import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-nido-text dark:text-dark-text"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`px-3 py-2 border rounded-lg text-sm bg-nido-surface dark:bg-dark-surface text-nido-text dark:text-dark-text placeholder:text-nido-textLight/60 focus:outline-none focus:ring-2 transition-colors ${
            error
              ? 'border-red-500 focus:ring-red-400'
              : 'border-nido-border dark:border-dark-border focus:ring-primary dark:focus:ring-primary-light'
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <span
            id={`${inputId}-error`}
            className="text-xs text-red-600 dark:text-red-400 font-medium min-h-[1.1rem]"
            role="alert"
          >
            {error}
          </span>
        )}
        {!error && helperText && (
          <span className="text-xs text-nido-textLight dark:text-dark-textLight">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
