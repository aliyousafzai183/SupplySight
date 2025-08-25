import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_WAREHOUSES, GET_KPIS } from '@/features/products/queries.js';
import type { GetProductsVariables, GetKPIsVariables } from '@/features/products/queries.js';
import { KPICard } from '@/app/components/KPICard.js';
import { LineChart } from '@/app/components/LineChart.js';
import { Filters } from '@/app/components/Filters.js';
import { ProductsTable } from '@/app/components/ProductsTable.js';
import { Drawer } from '@/app/components/Drawer.js';
import { getStatus } from '@/lib/status.js';
import type { Product, Status } from '@/features/products/types.js';

export function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<GetProductsVariables>({
    page: 1,
    pageSize: 10
  });
  const [kpiRange, setKpiRange] = useState(7);

  // Queries
  const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS, {
    variables: filters,
    fetchPolicy: 'cache-and-network'
  });

  const { data: warehousesData } = useQuery(GET_WAREHOUSES);

  const { data: kpisData } = useQuery(GET_KPIS, {
    variables: { range: kpiRange } as GetKPIsVariables
  });

  // Computed values
  const products = productsData?.products || [];
  const warehouses = warehousesData?.warehouses || [];
  const kpis = kpisData?.kpis || [];

  const kpiTotals = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalDemand = products.reduce((sum, p) => sum + p.demand, 0);
    const fillRate = totalDemand > 0 
      ? products.reduce((sum, p) => sum + Math.min(p.stock, p.demand), 0) / totalDemand
      : 1;
    
    return { totalStock, totalDemand, fillRate };
  }, [products]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseDrawer = () => {
    setSelectedProduct(null);
  };

  const handleFiltersChange = (newFilters: Partial<GetProductsVariables>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SupplySight</h1>
            </div>
            <div className="flex space-x-2">
              {[7, 14, 30].map((range) => (
                <button
                  key={range}
                  onClick={() => setKpiRange(range)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    kpiRange === range
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range}d
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Total Stock"
            value={kpiTotals.totalStock}
            format="number"
            loading={productsLoading}
          />
          <KPICard
            title="Total Demand"
            value={kpiTotals.totalDemand}
            format="number"
            loading={productsLoading}
          />
          <KPICard
            title="Fill Rate"
            value={kpiTotals.fillRate}
            format="percentage"
            loading={productsLoading}
          />
        </div>

        {/* Line Chart */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock vs Demand Trend</h2>
          <LineChart data={kpis} />
        </div>

        {/* Filters */}
        <Filters
          warehouses={warehouses}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Products Table */}
        <div className="card">
          <ProductsTable
            products={products}
            loading={productsLoading}
            onProductClick={handleProductClick}
          />
        </div>
      </main>

      {/* Drawer */}
      {selectedProduct && (
        <Drawer
          product={selectedProduct}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}
