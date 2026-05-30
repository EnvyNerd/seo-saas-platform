import React from 'react';
import clsx from 'clsx';

/**
 * Badge Component
 * Variants: success, warning, error, info, neutral, primary
 * Sizes: sm, md, lg
 */
export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-semibold rounded-full text-uppercase tracking-wide transition-all duration-200';

  const variants = {
    success: 'bg-slb-success/15 text-slb-success',
    warning: 'bg-slb-warning/15 text-yellow-700 dark:text-yellow-300',
    error: 'bg-slb-error/15 text-slb-error',
    info: 'bg-slb-info/15 text-slb-info',
    neutral: 'bg-surface-secondary text-text-secondary dark:bg-surface-tertiary',
    primary: 'bg-slb-blue-500/15 text-slb-blue-500',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const badgeClasses = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  return (
    <span className={badgeClasses} {...props}>
      {Icon && <Icon size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />}
      {children}
    </span>
  );
};

export default Badge;
