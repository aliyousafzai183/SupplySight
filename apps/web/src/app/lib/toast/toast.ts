import type { ToasterProps } from 'react-hot-toast';

export const toastConfig: ToasterProps = {
  position: "top-center",
  toastOptions: {
    duration: 4000,
    style: {
      background: '#fff',
      color: '#363636',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(8px)',
    },
    success: {
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    },
    error: {
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    },
  },
};

// Helper functions for common toast messages
export const showSuccessToast = (message: string) => {
  // This will be used if we want to add custom logic later
  return message;
};

export const showErrorToast = (message: string) => {
  // This will be used if we want to add custom logic later
  return message;
};
