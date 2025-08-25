import React, { useState, useEffect } from 'react';
import { formatNumber, formatPercentage } from '@/lib/format.js';

interface KPICardProps {
  title: string;
  value: number;
  format: 'number' | 'percentage';
  loading?: boolean;
}

export function KPICard({ title, value, format, loading = false }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!loading) {
      const startValue = 0;
      const endValue = value;
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [value, loading]);

  const formatValue = (val: number) => {
    if (format === 'percentage') {
      return formatPercentage(val);
    }
    return formatNumber(Math.round(val));
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">
        {formatValue(displayValue)}
      </p>
    </div>
  );
}
