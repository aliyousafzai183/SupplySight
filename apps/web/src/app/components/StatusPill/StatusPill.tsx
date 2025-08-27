import type { Status } from '../../features/products/types';

interface StatusPillProps {
  status: Status;
}

export function StatusPill({ status }: StatusPillProps) {
  const getStatusConfig = (status: Status) => {
    switch (status) {
      case 'HEALTHY':
        return {
          className: 'status-healthy',
          icon: '✓',
          label: 'Healthy'
        };
      case 'LOW':
        return {
          className: 'status-low',
          icon: '△',
          label: 'Low'
        };
      case 'CRITICAL':
        return {
          className: 'status-critical',
          icon: '✗',
          label: 'Critical'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-700',
          icon: '?',
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
}
