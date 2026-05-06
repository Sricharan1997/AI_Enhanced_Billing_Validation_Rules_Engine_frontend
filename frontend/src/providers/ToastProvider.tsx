'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer, { ToastMessage } from '../common/ToastContainer';
import { ToastType } from '../common/Toast';

interface ToastContextType {
  showToast: (options: {
    message: string;
    type?: ToastType;
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
    };
  }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (options: {
      message: string;
      type?: ToastType;
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    }) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: ToastMessage = {
        id,
        message: options.message,
        type: options.type || 'info',
        duration: options.duration !== undefined ? options.duration : 5000,
        action: options.action,
      };

      setToasts((prev) => [...prev, toast]);
    },
    []
  );

  const handleCloseToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={handleCloseToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
