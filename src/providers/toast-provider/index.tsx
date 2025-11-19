'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Snackbar, Alert, type AlertColor, type SnackbarOrigin } from '@mui/material';

type ToastSeverity = AlertColor; // 'success' | 'info' | 'warning' | 'error'

export type ShowToastOptions = {
  message: string;
  severity?: ToastSeverity;
  autoHideDuration?: number;
  anchorOrigin?: SnackbarOrigin;
};

type ToastItem = Required<ShowToastOptions> & { id: number };

type ToastContextValue = {
  showToast: (options: ShowToastOptions) => number;
  success: (message: string, options?: Omit<ShowToastOptions, 'message' | 'severity'>) => number;
  error: (message: string, options?: Omit<ShowToastOptions, 'message' | 'severity'>) => number;
  info: (message: string, options?: Omit<ShowToastOptions, 'message' | 'severity'>) => number;
  warning: (message: string, options?: Omit<ShowToastOptions, 'message' | 'severity'>) => number;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 3000;
const DEFAULT_ORIGIN: SnackbarOrigin = { vertical: 'top', horizontal: 'center' };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const idRef = useRef(1);
  const [, setQueue] = useState<ToastItem[]>([]);
  const [current, setCurrent] = useState<ToastItem | null>(null);
  const [open, setOpen] = useState(false);

  const processNext = useCallback(() => {
    setQueue((q) => {
      if (q.length === 0) {
        setCurrent(null);
        setOpen(false);
        return q;
      }
      const [next, ...rest] = q;
      setCurrent(next);
      setOpen(true);
      return rest;
    });
  }, []);

  const showToast = useCallback((options: ShowToastOptions) => {
    const toast: ToastItem = {
      id: idRef.current++,
      message: options.message,
      severity: options.severity ?? 'info',
      autoHideDuration: options.autoHideDuration ?? DEFAULT_DURATION,
      anchorOrigin: options.anchorOrigin ?? DEFAULT_ORIGIN,
    };
    setQueue((q) => [...q, toast]);
    if (!current && !open) {
      Promise.resolve().then(processNext);
    }
    return toast.id;
  }, [current, open, processNext]);

  const success = useCallback((message: string, options?: Omit<ShowToastOptions, 'message' | 'severity'>) =>
    showToast({ message, severity: 'success', ...options }), [showToast]);
  const error = useCallback((message: string, options?: Omit<ShowToastOptions, 'message' | 'severity'>) =>
    showToast({ message, severity: 'error', ...options }), [showToast]);
  const info = useCallback((message: string, options?: Omit<ShowToastOptions, 'message' | 'severity'>) =>
    showToast({ message, severity: 'info', ...options }), [showToast]);
  const warning = useCallback((message: string, options?: Omit<ShowToastOptions, 'message' | 'severity'>) =>
    showToast({ message, severity: 'warning', ...options }), [showToast]);

  const value = useMemo<ToastContextValue>(() => ({ showToast, success, error, info, warning }), [showToast, success, error, info, warning]);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleExited = useCallback(() => {
    setCurrent(null);
    setTimeout(processNext, 0);
  }, [processNext]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        key={current?.id}
        open={open}
        onClose={handleClose}
        autoHideDuration={current?.autoHideDuration}
        anchorOrigin={current?.anchorOrigin ?? DEFAULT_ORIGIN}
        TransitionProps={{ onExited: handleExited }}
      >
        <Alert onClose={handleClose} severity={current?.severity ?? 'info'} variant="filled" sx={{ width: '100%' }}>
          {current?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
