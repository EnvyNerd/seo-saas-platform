import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

/**
 * Dropdown Menu Component
 * Button with dropdown items
 */
export const Dropdown = ({
  trigger,
  items = [],
  placement = 'bottom',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const placementClasses = {
    'bottom': 'top-full mt-2',
    'top': 'bottom-full mb-2',
  };

  return (
    <div ref={dropdownRef} className={clsx('relative inline-block', className)}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        {trigger}
        <ChevronDown
          size={16}
          className={clsx('transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div
          className={clsx(
            'absolute left-0 z-50 min-w-max',
            'bg-surface-primary border border-border-light rounded-lg shadow-lg',
            'py-1 animate-fadeInUp',
            placementClasses[placement]
          )}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
              disabled={item.disabled}
              className={clsx(
                'w-full px-4 py-2.5 text-left text-sm font-medium',
                'transition-colors duration-200',
                item.disabled
                  ? 'text-text-muted opacity-50 cursor-not-allowed'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary',
                item.divider && 'border-b border-border-light my-1 py-0'
              )}
            >
              {item.icon && <item.icon className="inline-block mr-2" size={16} />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
