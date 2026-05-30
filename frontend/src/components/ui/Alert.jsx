import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

/**
 * Alert Component
 * Variants: success, warning, error, info
 * Dismissible with onClose callback
 */
export const Alert = ({
  children,
  variant = 'info',
  title,
  onClose,
  icon: CustomIcon,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const variants = {
    success: {
      bg: 'bg-slb-success/10',
      border: 'border-slb-success/30',
      text: 'text-slb-success',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-slb-error/10',
      border: 'border-slb-error/30',
      text: 'text-slb-error',
      icon: AlertCircle,
    },
    warning: {
      bg: 'bg-slb-warning/10',
      border: 'border-slb-warning/30',
      text: 'text-yellow-700 dark:text-yellow-300',
      icon: AlertTriangle,
    },
    info: {
      bg: 'bg-slb-info/10',
      border: 'border-slb-info/30',
      text: 'text-slb-info',
      icon: Info,
    },
  };

  const config = variants[variant];
  const IconComponent = CustomIcon || config.icon;

  const alertClasses = clsx(
    'flex gap-4 p-4 rounded-lg border',
    config.bg,
    config.border,
    'transition-all duration-200',
    className
  );

  return (
    <div className={alertClasses} role="alert" {...props}>
      <IconComponent size={20} className={clsx('flex-shrink-0 mt-0.5', config.text)} />
      <div className="flex-1">
        {title && <h4 className={clsx('font-semibold mb-1', config.text)}>{title}</h4>}
        <p className="text-sm text-text-secondary">{children}</p>
      </div>
      {onClose && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
          aria-label="Close alert"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
