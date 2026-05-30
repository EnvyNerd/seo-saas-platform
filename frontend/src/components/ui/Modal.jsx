import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import Button from './Button';

/**
 * Modal Component
 * Full-featured dialog with backdrop, close button, and footer actions
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footerActions,
  size = 'md',
  closeOnBackdropClick = true,
  closeButton = true,
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-4xl',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className={clsx(
        'relative bg-surface-primary rounded-xl shadow-lg w-11/12',
        sizes[size],
        'animate-fadeInUp',
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-2xl font-display font-bold text-text-primary">
            {title}
          </h2>
          {closeButton && (
            <button
              onClick={onClose}
              className="p-1 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer Actions */}
        {footerActions && (
          <div className="flex gap-3 justify-end p-6 border-t border-border-light">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
