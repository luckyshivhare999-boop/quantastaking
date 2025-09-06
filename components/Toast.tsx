import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps extends ToastMessage {
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = 'fixed top-5 right-5 z-50 flex items-center p-4 max-w-sm w-full rounded-lg shadow-lg text-white animate-fadeIn';
  const typeClasses = type === 'error' ? 'bg-red-600' : 'bg-green-600';

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      <div className="text-sm font-medium">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white/20 text-white rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-white/30 inline-flex h-8 w-8 items-center justify-center"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};

export default Toast;