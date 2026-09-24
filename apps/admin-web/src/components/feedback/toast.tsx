'use client';

import * as React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

const ToastContext = React.createContext<{
  showToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto p-3 rounded-lg border shadow-lg flex items-start gap-3 bg-surface-container-lowest animate-in slide-in-from-bottom duration-200',
              toast.type === 'success' && 'border-secondary/50 text-on-surface',
              toast.type === 'error' && 'border-error/50 text-on-surface',
              toast.type === 'info' && 'border-primary/50 text-on-surface'
            )}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-on-surface">{toast.title}</p>
              {toast.description && <p className="text-xs text-outline mt-0.5">{toast.description}</p>}
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-outline hover:text-on-surface">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
}
