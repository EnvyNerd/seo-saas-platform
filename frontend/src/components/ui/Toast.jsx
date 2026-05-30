import React, { useState, useCallback, useRef } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import clsx from 'clsx';

const toastQueue = [];
let toastListeners = [];

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  React.useEffect(() => {
    const handleToast = (toast) => {
      const id = Date.now();
      const toastWithId = { ...toast, id };
      setToasts((prev) => [...prev, toastWithId]);

      if (toast.duration !== 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, toast.duration || 3000);
      }
    };

    toastListeners.push(handleToast);
    return () => {
      toastListeners = toastListeners.filter((listener) => listener !== handleToast);
    };
  }, []);

  return { toasts };
};

export const showToast = (message, type = 'info', duration = 3000) => {
  toastListeners.forEach((listener) => {
    listener({ message, type, duration });
  });
};

/**
 * Toast Container Component
 * Must be placed at app root level
 */
export const ToastContainer = () => {
  const { toasts } = useToast();

  const variants = {
    success: {
      bg: 'bg-slb-success/15',
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

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const config = variants[toast.type];
        const IconComponent = config.icon;

        return (
          <div
            key={toast.id}
            className={clsx(
              'flex gap-3 items-start p-4 rounded-lg border',
              config.bg,
              config.border,
              'pointer-events-auto',
              'animate-slideInRight',
              'shadow-lg'
            )}
          >
            <IconComponent className={clsx('flex-shrink-0 mt-0.5', config.text)} size={20} />
            <p className="text-sm text-text-primary flex-1">{toast.message}</p>
            <button
              onClick={() => { }}
              className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
