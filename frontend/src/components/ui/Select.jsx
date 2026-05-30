import React from 'react';
import clsx from 'clsx';
import { ChevronDown, AlertCircle } from 'lucide-react';

/**
 * Enhanced Select Component
 * Supports: labels, validation, helper text, disabled options
 */
export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  helperText,
  className = '',
  disabled = false,
  placeholder = 'Select an option...',
  ...props
}, ref) => {
  const baseStyles = 'w-full px-4 py-2.5 rounded-lg border transition-all duration-200 font-medium text-base bg-surface-primary text-text-primary appearance-none cursor-pointer focus:outline-none pr-10';

  const borderStyles = clsx(
    'border-border-light',
    error && 'border-slb-error focus:ring-4 focus:ring-slb-error/20',
    !error && 'focus:ring-4 focus:ring-slb-blue-500/20 focus:border-slb-blue-500'
  );

  const selectClasses = clsx(
    baseStyles,
    borderStyles,
    disabled && 'opacity-50 cursor-not-allowed bg-surface-secondary',
    className
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="font-medium text-text-primary text-sm">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          className={selectClasses}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" size={18} />
        {error && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-slb-error">
            <AlertCircle size={18} />
          </div>
        )}
      </div>
      {helperText && (
        <p className={clsx(
          'text-sm',
          error ? 'text-slb-error' : 'text-text-muted'
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
