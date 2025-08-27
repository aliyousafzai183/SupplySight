import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  UPDATE_DEMAND,
  TRANSFER_STOCK,
} from "../../features/products/mutations";
import { GET_WAREHOUSES, GET_PRODUCTS } from "../../features/products/queries";
import type { Product } from "../../features/products/types";
import { StatusPill } from "../StatusPill";
import { getStatus, client } from "../../lib";

interface DrawerProps {
  product: Product;
  onClose: () => void;
  onUpdate?: () => void;
}

export function Drawer({ product, onClose, onUpdate }: DrawerProps) {
  const [demand, setDemand] = useState(product?.demand?.toString() || "");
  const [transferAmount, setTransferAmount] = useState("");
  const [targetWarehouse, setTargetWarehouse] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (product?.demand) {
      setDemand(product.demand.toString());
    }
  }, [product?.demand]);

  const [updateDemand] = useMutation(UPDATE_DEMAND);
  const [transferStock] = useMutation(TRANSFER_STOCK);
  const { data: warehousesData } = useQuery(GET_WAREHOUSES);

  // Handle null product case
  if (!product) {
    return null;
  }

  const status = getStatus(product.stock, product.demand);

  // Get available warehouses excluding current warehouse
  const availableWarehouses =
    warehousesData?.warehouses?.filter(
      (w: string) => w !== product.warehouse
    ) || [];

  const handleUpdateDemand = async () => {
    if (!demand || isNaN(Number(demand))) return;

    setIsUpdating(true);
    try {
      await updateDemand({
        variables: {
          id: product.id,
          warehouse: product.warehouse,
          demand: parseInt(demand),
        },
        optimisticResponse: {
          updateDemand: {
            __typename: "Product",
            ...product,
            demand: parseInt(demand),
            warehouse: product.warehouse,
          },
        },
        refetchQueries: [GET_PRODUCTS],
        awaitRefetchQueries: true,
      });
      client.resetStore();
      onUpdate?.();
    } catch (error) {
      console.error("Failed to update demand:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTransferStock = async () => {
    if (!transferAmount || !targetWarehouse || isNaN(Number(transferAmount)))
      return;

    const amount = parseInt(transferAmount);
    if (amount > product.stock) {
      return;
    }

    setIsUpdating(true);
    try {
      await transferStock({
        variables: {
          id: product.id,
          qty: amount,
          from: product.warehouse,
          to: targetWarehouse,
        },
        // Force a complete cache reset since transfer creates new products
        refetchQueries: [GET_PRODUCTS],
        awaitRefetchQueries: true,
      });
      setTransferAmount("");
      setTargetWarehouse("");

      // Force cache reset and close drawer
      client.resetStore();
      setTimeout(() => {
        onUpdate?.();
      }, 100);
    } catch (error) {
      console.error("Failed to transfer stock:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
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
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Product Info */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {product.name}
              </h3>
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
                  <span className="font-medium">
                    {product.stock.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Demand:</span>
                  <span className="font-medium">
                    {product.demand.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <StatusPill status={status} />
                </div>
              </div>
            </div>

            {/* Update Demand */}
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-md font-semibold text-gray-800 mb-3">
                Update Demand
              </h4>
              <div className="space-y-3">
                <div>
                  <label htmlFor="demand-input" className="block text-sm font-medium text-gray-700 mb-1">
                    New demand value (current: {product.demand})
                  </label>
                  <input
                    id="demand-input"
                    type="number"
                    value={demand}
                    onChange={(e) => setDemand(e.target.value)}
                    placeholder="Enter new demand"
                    className="input-field w-full"
                    min="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUpdateDemand}
                  disabled={isUpdating || !demand || isNaN(Number(demand)) || Number(demand) < 0}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Updating..." : "Update Demand"}
                </button>
              </div>
            </div>

            {/* Transfer Stock */}
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-md font-semibold text-gray-800 mb-3">
                Transfer Stock
              </h4>
              <div className="space-y-3">
                <div>
                  <label htmlFor="transfer-amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount to transfer (max: {product.stock})
                  </label>
                  <input
                    id="transfer-amount"
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
                  <label htmlFor="target-warehouse" className="block text-sm font-medium text-gray-700 mb-1">
                    Target warehouse
                  </label>
                  <select
                    id="target-warehouse"
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
                    <p className="text-xs text-gray-500 mt-1">
                      No other warehouses available
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleTransferStock}
                  disabled={
                    isUpdating ||
                    !transferAmount ||
                    !targetWarehouse ||
                    isNaN(Number(transferAmount)) ||
                    Number(transferAmount) <= 0 ||
                    parseInt(transferAmount) > product.stock
                  }
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Transferring..." : "Transfer Stock"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
