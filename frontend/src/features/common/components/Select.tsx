import React, { SelectHTMLAttributes, forwardRef } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholderOption?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholderOption = 'Selecciona una opción', className = '', id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-semibold text-nido-text dark:text-dark-text"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`px-3 py-2 border rounded-lg text-sm bg-nido-surface dark:bg-dark-surface text-nido-text dark:text-dark-text focus:outline-none focus:ring-2 transition-colors ${
            error
              ? 'border-red-500 focus:ring-red-400'
              : 'border-nido-border dark:border-dark-border focus:ring-primary dark:focus:ring-primary-light'
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {placeholderOption && (
            <option value="">{placeholderOption}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span
            id={`${selectId}-error`}
            className="text-xs text-red-600 dark:text-red-400 font-medium min-h-[1.1rem]"
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
