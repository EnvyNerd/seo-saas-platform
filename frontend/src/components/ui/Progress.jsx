import React from 'react';
import clsx from 'clsx';

/**
 * Progress Bar Component
 * Shows progress towards completion
 */
export const Progress = ({
  value = 0,
  max = 100,
  variant = 'default',
  showLabel = false,
  animated = true,
  className = '',
}) => {
  const percentage = (value / max) * 100;

  const variants = {
    default: 'bg-slb-blue-500',
    success: 'bg-slb-success',
    warning: 'bg-slb-warning',
    error: 'bg-slb-error',
    info: 'bg-slb-info',
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-primary">Progress</span>
        {showLabel && (
          <span className="text-sm font-semibold text-text-secondary">{Math.round(percentage)}%</span>
        )}
      </div>
      <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300',
            variants[variant],
            animated && 'shadow-glow'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/**
 * Circular Progress Component
 */
export const CircularProgress = ({
  value = 0,
  max = 100,
  size = 80,
  strokeWidth = 4,
  variant = 'default',
  showLabel = false,
  className = '',
}) => {
  const percentage = (value / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const variants = {
    default: '#0066cc',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
  };

  return (
    <div className={clsx('inline-flex items-center justify-center', className)}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={variants[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${size / 2}px ${size / 2}px` }}
        />
      </svg>
      {showLabel && (
        <div className="absolute text-center">
          <p className="text-lg font-bold text-text-primary">{Math.round(percentage)}%</p>
        </div>
      )}
    </div>
  );
};

export default Progress;
