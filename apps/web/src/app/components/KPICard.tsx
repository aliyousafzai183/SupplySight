
import { formatNumber, formatPercentage } from '../lib';

interface KPICardProps {
  title: string;
  value: number;
  format?: 'number' | 'percentage';
  loading?: boolean;
  className?: string;
}

export function KPICard({ title, value, format = 'number', loading = false, className = '' }: KPICardProps) {
  const formattedValue = format === 'percentage' ? formatPercentage(value) : formatNumber(value);

  if (loading) {
    return (
      <div className={`kpi-card ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`kpi-card ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-600 font-medium text-sm uppercase tracking-wide mb-2">{title}</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {formattedValue}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  );
}
