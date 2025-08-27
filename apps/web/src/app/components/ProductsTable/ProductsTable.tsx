import type { Product, ProductConnection } from '../../features/products/types';
import { StatusPill } from '../StatusPill/index.js';
import { getStatus } from '../../lib';
import { Pagination } from '../Pagination/index.js';

interface ProductsTableProps {
  data: ProductConnection;
  loading?: boolean;
  onProductClick: (product: Product) => void;
  onPageChange: (page: number) => void;
}

export function ProductsTable({ data, loading = false, onProductClick, onPageChange }: ProductsTableProps) {
  if (loading) {
    return (
      <div className="table-container">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Products</h2>
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading products...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data.products.length === 0) {
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
                <tr>
                  <td colSpan={6} className="py-16">
                    <div className="text-center">
                      {/* Extraordinary beautiful empty state */}
                      <div className="relative">
                        {/* Animated background elements */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full opacity-60 animate-pulse"></div>
                        </div>
                        
                        {/* Main icon with glow effect */}
                        <div className="relative z-10 mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/25">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Floating decorative elements */}
                        <div className="absolute top-8 left-1/4 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="absolute top-12 right-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute bottom-8 left-1/3 w-2 h-2 bg-pink-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }}></div>
                        
                        {/* Main content */}
                        <div className="relative z-10">
                          <h3 className="text-xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            No Products Found
                          </h3>
                          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                            We couldn't find any products matching your current filters. 
                            <br />
                            <span className="text-sm text-gray-500">Try adjusting your search criteria below.</span>
                          </p>
                          
                          {/* Beautiful suggestions card */}
                          <div className="max-w-sm mx-auto">
                            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                              <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm">💡</span>
                                </div>
                                <h4 className="text-sm font-semibold text-gray-700">Quick Suggestions</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-gray-600">Check your spelling in the search box</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-gray-600">Try a broader search term</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-gray-600">Clear filters to see all products</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-gray-600">Check different warehouses</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
              {data.products.map((product: Product) => {
                const status = getStatus(product.stock, product.demand);
                const isCritical = status === 'CRITICAL';
                
                return (
                  <tr
                    key={`${product.id}-${product.warehouse}`}
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
                    <td className="text-center py-4 px-4">
                      <StatusPill status={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6">
          <Pagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            hasNextPage={data.hasNextPage}
            hasPreviousPage={data.hasPreviousPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
}
