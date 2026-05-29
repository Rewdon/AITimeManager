import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            data-testid="toast"
            data-type={toast.type}
            className="pointer-events-auto flex items-start gap-3 bg-surface border border-border p-4 rounded-xl shadow-2xl animate-in slide-in-from-right-8 fade-in duration-300 w-80 sm:w-96"
          >
            {toast.type === 'success' && <CheckCircle className="text-note-green-text shrink-0 mt-0.5" size={20} />}
            {toast.type === 'error' && <AlertCircle className="text-danger-light shrink-0 mt-0.5" size={20} />}
            {toast.type === 'info' && <Info className="text-primary shrink-0 mt-0.5" size={20} />}
            
            <p className="text-sm text-text-main font-medium flex-1 pt-0.5 leading-relaxed">
              {toast.message}
            </p>
            
            <button 
              onClick={() => removeToast(toast.id)} 
              data-testid="toast-close-btn"
              className="text-text-muted hover:text-text-main transition-colors shrink-0 p-1 hover:bg-surfaceHover rounded-lg"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast musi być używany wewnątrz ToastProvider');
  }
  return context;
};