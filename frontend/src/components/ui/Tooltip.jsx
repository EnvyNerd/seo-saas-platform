import React, { useState } from 'react';
import clsx from 'clsx';

/**
 * Tooltip Component
 * Shows helpful text on hover
 * Positions: top, right, bottom, left
 */
export const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 200,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-surface-tertiary border-l-transparent border-r-transparent border-b-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-surface-tertiary border-t-transparent border-b-transparent border-l-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-surface-tertiary border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-surface-tertiary border-t-transparent border-b-transparent border-r-transparent',
  };

  return (
    <div className={clsx("relative inline-block", className)}>
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {isVisible && (
        <div className={clsx(
          'absolute z-50 px-3 py-2 rounded-lg text-sm font-medium',
          'bg-surface-tertiary text-text-primary',
          'border border-border-medium',
          'whitespace-nowrap pointer-events-none',
          'animate-fadeInUp',
          positionClasses[position]
        )}>
          {content}
          <div className={clsx(
            'absolute w-0 h-0 border-4',
            arrowClasses[position]
          )} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
