
import { useDebouncedCallback } from 'use-debounce';
import type { ProductsFilters } from '../features/products/types.js';

interface FiltersProps {
  filters: ProductsFilters;
  onFiltersChange: (filters: ProductsFilters) => void;
  warehouses: string[];
  loading?: boolean;
  className?: string;
}

export function Filters({ filters, onFiltersChange, warehouses, loading = false, className = '' }: FiltersProps) {
  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      onFiltersChange({ ...filters, search: value });
    },
    300
  );

  return (
    <div className={`filters-container ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <input
            type="text"
            placeholder="Search by name, SKU, or warehouse..."
            className="input-field w-full"
            onChange={(e) => debouncedSearch(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Warehouse Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Warehouse
          </label>
          <select
            className="input-field w-full"
            value={filters.warehouse}
            onChange={(e) => onFiltersChange({ ...filters, warehouse: e.target.value })}
            disabled={loading}
          >
            <option value="">All Warehouses</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse} value={warehouse}>
                {warehouse}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            className="input-field w-full"
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: (e.target.value as 'HEALTHY' | 'LOW' | 'CRITICAL') || undefined })}
            disabled={loading}
          >
            <option value="">All Status</option>
            <option value="HEALTHY">Healthy</option>
            <option value="LOW">Low</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>
    </div>
  );
}
