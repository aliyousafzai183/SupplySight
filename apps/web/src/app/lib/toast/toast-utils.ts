import toast from 'react-hot-toast';

// Common toast message patterns
export const toastMessages = {
  // Product related messages
  product: {
    demandUpdated: (demand: number) => `Successfully updated demand to ${demand}`,
    demandUpdateFailed: 'Failed to update demand. Please try again.',
    stockTransferred: (amount: number, warehouse: string) => 
      `Successfully transferred ${amount} units to ${warehouse}!`,
    stockTransferFailed: 'Failed to transfer stock. Please try again.',
    stockLimitExceeded: (available: number) => 
      `Cannot transfer more than available stock (${available})`,
    productSelected: (name: string) => `Opening details for ${name}`,
  },
  
  // Filter related messages
  filters: {
    applied: (filters: string[]) => 
      `Filters applied: ${filters.join(', ')}`,
    reset: 'All filters have been cleared',
  },
  
  // General messages
  general: {
    loading: 'Loading...',
    error: 'Something went wrong. Please try again.',
    success: 'Operation completed successfully',
  },
} as const;

// Helper functions for consistent toast usage
export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  dismiss: (toastId: string) => toast.dismiss(toastId),
  
  // Custom toast with specific styling
  custom: (message: string, options?: Parameters<typeof toast>[1]) => 
    toast(message, options),
};

// Toast duration constants
export const TOAST_DURATION = {
  SHORT: 2000,
  NORMAL: 4000,
  LONG: 6000,
} as const;

// Example usage:
// import { showToast, toastMessages } from '../lib/toast-utils';
// 
// // Success toast
// showToast.success(toastMessages.product.demandUpdated(150));
// 
// // Error toast
// showToast.error(toastMessages.product.demandUpdateFailed);
// 
// // Custom toast with longer duration
// showToast.custom('Custom message', { duration: TOAST_DURATION.LONG });
