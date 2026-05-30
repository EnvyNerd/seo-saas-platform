import React from 'react';
import { Loader } from 'lucide-react';
import clsx from 'clsx';

/**
 * Professional Button Component
 * Variants: primary, secondary, outline, ghost, danger, success
 * Sizes: sm, md, lg
 * States: loading, disabled, fullWidth
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  startIcon: StartIcon,
  endIcon: EndIcon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-slb-navy text-white hover:bg-slb-navy-800 active:scale-95 focus-visible:outline-slb-blue-500',
    secondary: 'bg-surface-secondary border border-border-medium text-text-primary hover:bg-surface-tertiary active:scale-95 focus-visible:outline-slb-blue-500',
    outline: 'border border-border-medium text-text-primary hover:bg-surface-secondary active:scale-95 focus-visible:outline-slb-blue-500',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary focus-visible:outline-slb-blue-500',
    danger: 'bg-slb-error text-white hover:bg-red-600 active:scale-95 focus-visible:outline-slb-error',
    success: 'bg-slb-success text-white hover:bg-green-600 active:scale-95 focus-visible:outline-slb-success',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonClasses = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  );

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      {loading ? (
        <>
          <Loader size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} className="animate-spin" />
          {children}
        </>
      ) : (
        <>
          {StartIcon && <StartIcon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
          {children}
          {EndIcon && <EndIcon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
        </>
      )}
    </button>
  );
};

export default Button;
