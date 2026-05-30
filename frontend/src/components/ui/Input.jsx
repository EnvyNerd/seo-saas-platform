import React from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Enhanced Input Component
 * Supports: validation states, icons, labels, helper text
 */
export const Input = React.forwardRef(({
  label,
  error,
  success,
  helperText,
  startIcon: StartIcon,
  endIcon: EndIcon,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const baseStyles = 'w-full px-4 py-2.5 rounded-lg border transition-all duration-200 font-medium text-base bg-surface-primary text-text-primary placeholder-text-muted focus:outline-none';

  const borderStyles = clsx(
    'border-border-light',
    error && 'border-slb-error focus:ring-4 focus:ring-slb-error/20',
    success && !error && 'border-slb-success focus:ring-4 focus:ring-slb-success/20',
    !error && !success && 'focus:ring-4 focus:ring-slb-blue-500/20 focus:border-slb-blue-500'
  );

  const inputClasses = clsx(
    baseStyles,
    borderStyles,
    StartIcon && 'pl-10',
    (EndIcon || error || success) && 'pr-10',
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
        {StartIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <StartIcon size={18} />
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slb-error">
            <AlertCircle size={18} />
          </div>
        )}
        {success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slb-success">
            <CheckCircle size={18} />
          </div>
        )}
        {EndIcon && !error && !success && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <EndIcon size={18} />
          </div>
        )}
      </div>
      {helperText && (
        <p className={clsx(
          'text-sm',
          error ? 'text-slb-error' : success ? 'text-slb-success' : 'text-text-muted'
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
