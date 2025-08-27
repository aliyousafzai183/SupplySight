import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_WAREHOUSES, GET_KPIS } from '../features/products/queries.js';
import { KPICard } from '../components/KPICard.js';
import { LineChart } from '../components/LineChart.js';
import { Filters } from '../components/Filters.js';
import { ProductsTable } from '../components/ProductsTable.js';
import { Drawer } from '../components/Drawer.js';
import type { Product, ProductsFilters } from '../features/products/types.js';

export function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<ProductsFilters>({
    search: '',
    warehouse: '',
    status: undefined
  });
  const [kpiRange, setKpiRange] = useState<'7d' | '14d' | '30d'>('7d');

  const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS, {
    variables: { filters }
  });

  const { data: warehousesData, loading: warehousesLoading } = useQuery(GET_WAREHOUSES);

  const { data: kpisData, loading: kpisLoading } = useQuery(GET_KPIS, {
    variables: { range: kpiRange }
  });

  const products = useMemo(() => productsData?.products || [], [productsData]);
  const warehouses = useMemo(() => warehousesData?.warehouses || [], [warehousesData]);
  const kpis = useMemo(() => kpisData?.kpis || [], [kpisData]);

  const totalStock = products.reduce((sum: number, p: Product) => sum + p.stock, 0);
  const totalDemand = products.reduce((sum: number, p: Product) => sum + p.demand, 0);
  const fillRate = totalDemand > 0 
    ? products.reduce((sum: number, p: Product) => sum + Math.min(p.stock, p.demand), 0) / totalDemand * 100
    : 0;

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
          onFiltersChange={(prev: ProductsFilters) => setFilters(prev)}
          warehouses={warehouses}
          loading={warehousesLoading}
          className="filters-container"
        />

        {/* Products Table */}
        <ProductsTable
          products={products}
          loading={productsLoading}
          onProductClick={setSelectedProduct}
        />
      </div>

      {/* Drawer */}
      {selectedProduct && (
        <Drawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={() => {
            // Refetch products after mutation
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
