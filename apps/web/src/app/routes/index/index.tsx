import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_WAREHOUSES, GET_KPIS } from '../../features/products/queries/index.js';
import { KPICard } from '../../components/KPICard/index.js';
import { LineChart } from '../../components/LineChart/index.js';
import { Filters } from '../../components/Filters/index.js';
import { ProductsTable } from '../../components/ProductsTable/index.js';
import { Drawer } from '../../components/Drawer/index.js';
import type { Product, ProductsFilters } from '../../features/products/types/index.js';

export function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- URL <-> State sync helpers ---
  const parseQueryParams = (): { initFilters: ProductsFilters; initRange: '7d' | '14d' | '30d' } => {
    const params = new URLSearchParams(window.location.search);
    const initFilters: ProductsFilters = {
      search: params.get('search') || '',
      warehouse: params.get('warehouse') || '',
      status: params.get('status') as 'HEALTHY' | 'LOW' | 'CRITICAL' | undefined,
      page: params.get('page') ? parseInt(params.get('page')!) : 1,
      pageSize: 10
    };
    const range = (params.get('range') as '7d' | '14d' | '30d') || '7d';
    return { initFilters, initRange: range };
  };

  const { initFilters, initRange } = parseQueryParams();

  const [filters, setFilters] = useState<ProductsFilters>(initFilters);
  const [kpiRange, setKpiRange] = useState<'7d' | '14d' | '30d'>(initRange);

  const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS, {
    variables: { 
      search: filters.search,
      warehouse: filters.warehouse,
      status: filters.status,
      page: filters.page,
      pageSize: filters.pageSize
    }
  });

  const { data: warehousesData, loading: warehousesLoading } = useQuery(GET_WAREHOUSES);

  const { data: kpisData, loading: kpisLoading } = useQuery(GET_KPIS, {
    variables: { range: parseInt(kpiRange) }
  });

  const productsConnection = useMemo(() => productsData?.products || { 
    products: [], 
    totalCount: 0, 
    hasNextPage: false, 
    hasPreviousPage: false, 
    currentPage: 1, 
    totalPages: 1 
  }, [productsData]);
  const warehouses = useMemo(() => warehousesData?.warehouses || [], [warehousesData]);
  const kpis = useMemo(() => kpisData?.kpis || [], [kpisData]);

  const totalStock = productsConnection.products.reduce((sum: number, p: Product) => sum + p.stock, 0);
  const totalDemand = productsConnection.products.reduce((sum: number, p: Product) => sum + p.demand, 0);
  const fillRate = totalDemand > 0 
    ? productsConnection.products.reduce((sum: number, p: Product) => sum + Math.min(p.stock, p.demand), 0) / totalDemand * 100
    : 0;

  // Sync URL whenever filters or range change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.warehouse) params.set('warehouse', filters.warehouse);
    if (filters.status) params.set('status', filters.status);
    if (filters.page && filters.page !== 1) params.set('page', filters.page.toString());
    params.set('range', kpiRange);
    // Use replaceState to avoid polluting history stack
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }, [filters, kpiRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="gradient-bg text-white py-8 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">SupplySight</h1>
          <p className="text-blue-100 text-lg">Daily Inventory Dashboard</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Total Stock"
            value={totalStock}
            loading={productsLoading}
            className="kpi-card"
          />
          <KPICard
            title="Total Demand"
            value={totalDemand}
            loading={productsLoading}
            className="kpi-card"
          />
          <KPICard
            title="Fill Rate"
            value={fillRate}
            format="percentage"
            loading={productsLoading}
            className="kpi-card"
          />
        </div>

        {/* Chart Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Stock vs Demand Trend</h2>
            <div className="flex space-x-2">
              {(['7d', '14d', '30d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setKpiRange(range)}
                  className={kpiRange === range ? 'btn-primary' : 'btn-secondary'}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <LineChart data={kpis} loading={kpisLoading} />
        </div>

        {/* Filters */}
        <Filters
          filters={filters}
          onFiltersChange={(newFilters: ProductsFilters) => {
            setFilters({
              ...newFilters,
              page: 1 // Reset to first page when filters change
            });
          }}
          warehouses={warehouses}
          loading={warehousesLoading}
          className="filters-container"
        />

        {/* Products Table */}
        <ProductsTable
          data={productsConnection}
          loading={productsLoading}
          onProductClick={setSelectedProduct}
          onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
        />
      </div>

      {/* Drawer */}
      {selectedProduct && (
        <Drawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={() => {
            // Close drawer after successful mutation
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
