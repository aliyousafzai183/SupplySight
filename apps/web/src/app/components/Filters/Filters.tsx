
import { useState, useEffect } from 'react';
import type { ProductsFilters } from '../../features/products/types';

interface FiltersProps {
  filters: ProductsFilters;
  onFiltersChange: (filters: ProductsFilters) => void;
  warehouses: string[];
  loading?: boolean;
  className?: string;
}

export function Filters({ filters, onFiltersChange, warehouses, loading = false, className = '' }: FiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [localWarehouse, setLocalWarehouse] = useState(filters.warehouse || '');
  const [localStatus, setLocalStatus] = useState<string>(filters.status || '');

  // Sync local state with props when filters change
  useEffect(() => {
    setLocalSearch(filters.search || '');
    setLocalWarehouse(filters.warehouse || '');
    setLocalStatus(filters.status || '');
  }, [filters.search, filters.warehouse, filters.status]);

  const handleApplyFilters = () => {
    onFiltersChange({
      ...filters,
      search: localSearch,
      warehouse: localWarehouse,
      status: (localStatus as 'HEALTHY' | 'LOW' | 'CRITICAL') || undefined
    });
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    setLocalWarehouse('');
    setLocalStatus('');
    onFiltersChange({
      search: '',
      warehouse: '',
      status: undefined,
      page: 1,
      pageSize: 10
    });
  };

  return (
    <div className={`filters-container ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Search */}
        <div>
          <label htmlFor="search-products" className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <input
            id="search-products"
            type="text"
            placeholder="Search by name, SKU, or warehouse..."
            className="input-field w-full"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Warehouse Filter */}
        <div>
          <label htmlFor="warehouse-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Warehouse
          </label>
          <select
            id="warehouse-filter"
            className="input-field w-full"
            value={localWarehouse}
            onChange={(e) => setLocalWarehouse(e.target.value)}
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
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status-filter"
            className="input-field w-full"
            value={localStatus}
            onChange={(e) => setLocalStatus(e.target.value)}
            disabled={loading}
          >
            <option value="">All Status</option>
            <option value="HEALTHY">Healthy</option>
            <option value="LOW">Low</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleResetFilters}
          disabled={loading}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleApplyFilters}
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
