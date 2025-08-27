
import type { Product } from '../features/products/types.js';
import { StatusPill } from './StatusPill.js';
import { getStatus } from '../lib/status.js';

interface ProductsTableProps {
  products: Product[];
  loading?: boolean;
  onProductClick: (product: Product) => void;
}

export function ProductsTable({ products, loading = false, onProductClick }: ProductsTableProps) {
  if (loading) {
    return (
      <div className="table-container">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Products</h2>
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="table-container">
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Products</h2>
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">SKU</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Warehouse</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Stock</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Demand</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status = getStatus(product.stock, product.demand);
                const isCritical = status === 'CRITICAL';
                
                return (
                  <tr
                    key={product.id}
                    onClick={() => onProductClick(product)}
                    className={`table-row-hover border-b border-gray-100 ${
                      isCritical ? 'bg-red-50/50' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.id}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{product.sku}</td>
                    <td className="py-4 px-4 text-gray-700">{product.warehouse}</td>
                    <td className="py-4 px-4 text-right font-medium text-gray-900">
                      {product.stock.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-gray-900">
                      {product.demand.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusPill status={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
