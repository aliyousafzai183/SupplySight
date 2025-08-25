export type Status = 'HEALTHY' | 'LOW' | 'CRITICAL';

export const getStatus = (stock: number, demand: number): Status => {
  if (stock > demand) return 'HEALTHY';
  if (stock === demand) return 'LOW';
  return 'CRITICAL';
};

export const getStatusColor = (status: Status) => {
  switch (status) {
    case 'HEALTHY':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'LOW':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'CRITICAL':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusIcon = (status: Status) => {
  switch (status) {
    case 'HEALTHY':
      return '🟢';
    case 'LOW':
      return '🟡';
    case 'CRITICAL':
      return '🔴';
    default:
      return '⚪';
  }
};
