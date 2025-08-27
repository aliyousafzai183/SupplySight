import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_DEMAND, TRANSFER_STOCK } from '../features/products/mutations.js';
import { GET_WAREHOUSES } from '../features/products/queries.js';
import type { Product } from '../features/products/types.js';
import { StatusPill } from './StatusPill.js';
import { getStatus } from '../lib/status.js';

interface DrawerProps {
  product: Product;
  onClose: () => void;
  onUpdate?: () => void;
}

export function Drawer({ product, onClose, onUpdate }: DrawerProps) {
  const [demand, setDemand] = useState(product.demand.toString());
  const [transferAmount, setTransferAmount] = useState('');
  const [targetWarehouse, setTargetWarehouse] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [updateDemand] = useMutation(UPDATE_DEMAND);
  const [transferStock] = useMutation(TRANSFER_STOCK);
  const { data: warehousesData } = useQuery(GET_WAREHOUSES);

  const status = getStatus(product.stock, product.demand);
  
  // Get available warehouses excluding current warehouse
  const availableWarehouses = warehousesData?.warehouses?.filter((w: string) => w !== product.warehouse) || [];

  const handleUpdateDemand = async () => {
    if (!demand || isNaN(Number(demand))) return;
    
    setIsUpdating(true);
    setMessage(null);
    try {
      await updateDemand({
        variables: {
          id: product.id,
          demand: parseInt(demand)
        },
        optimisticResponse: {
          updateDemand: {
            __typename: 'Product',
            ...product,
            demand: parseInt(demand)
          }
        }
      });
      setMessage({ type: 'success', text: 'Demand updated successfully!' });
      onUpdate?.();
    } catch (error) {
      console.error('Failed to update demand:', error);
      setMessage({ type: 'error', text: 'Failed to update demand. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTransferStock = async () => {
    if (!transferAmount || !targetWarehouse || isNaN(Number(transferAmount))) return;
    
    const amount = parseInt(transferAmount);
    if (amount > product.stock) {
      setMessage({ type: 'error', text: `Cannot transfer more than available stock (${product.stock})` });
      return;
    }
    
    setIsUpdating(true);
    setMessage(null);
    try {
      await transferStock({
        variables: {
          id: product.id,
          qty: amount,
          from: product.warehouse,
          to: targetWarehouse
        },
        optimisticResponse: {
          transferStock: {
            __typename: 'Product',
            ...product,
            warehouse: targetWarehouse,
            stock: product.stock - amount
          }
        }
      });
      setMessage({ type: 'success', text: `Successfully transferred ${amount} units to ${targetWarehouse}!` });
      setTransferAmount('');
      setTargetWarehouse('');
      onUpdate?.();
    } catch (error) {
      console.error('Failed to transfer stock:', error);
      setMessage({ type: 'error', text: 'Failed to transfer stock. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Message Display */}
            {message && (
              <div className={`rounded-lg p-4 ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">
                    {message.type === 'success' ? '✅' : '❌'}
                  </span>
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              </div>
            )}

            {/* Product Info */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{product.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warehouse:</span>
                  <span className="font-medium">{product.warehouse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium">{product.stock.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Demand:</span>
                  <span className="font-medium">{product.demand.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <StatusPill status={status} />
                </div>
              </div>
            </div>

            {/* Update Demand */}
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-md font-semibold text-gray-800 mb-3">Update Demand</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New demand value (current: {product.demand})
                  </label>
                  <input
                    type="number"
                    value={demand}
                    onChange={(e) => setDemand(e.target.value)}
                    placeholder="Enter new demand"
                    className="input-field w-full"
                    min="0"
                  />
                </div>
                <button
                  onClick={handleUpdateDemand}
                  disabled={isUpdating || !demand || isNaN(Number(demand))}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Updating...' : 'Update Demand'}
                </button>
              </div>
            </div>

            {/* Transfer Stock */}
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-md font-semibold text-gray-800 mb-3">Transfer Stock</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount to transfer (max: {product.stock})
                  </label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="input-field w-full"
                    min="1"
                    max={product.stock}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target warehouse
                  </label>
                  <select
                    value={targetWarehouse}
                    onChange={(e) => setTargetWarehouse(e.target.value)}
                    className="input-field w-full"
                    disabled={availableWarehouses.length === 0}
                  >
                    <option value="">Select target warehouse</option>
                    {availableWarehouses.map((warehouse: string) => (
                      <option key={warehouse} value={warehouse}>
                        {warehouse}
                      </option>
                    ))}
                  </select>
                  {availableWarehouses.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">No other warehouses available</p>
                  )}
                </div>
                
                <button
                  onClick={handleTransferStock}
                  disabled={isUpdating || !transferAmount || !targetWarehouse || isNaN(Number(transferAmount)) || parseInt(transferAmount) > product.stock}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Transferring...' : 'Transfer Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
