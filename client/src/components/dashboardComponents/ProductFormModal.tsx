import { X, Package, DollarSign, FileText } from "lucide-react";
import React from "react";

interface Product {
    productId?: number;
    productType: string;
    name: string;
    description: string;
    brand: string;
    price: number;
    stockQuantity: number;
    active: boolean;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const PRODUCT_TYPE_OPTIONS = [
  "SHAMPOO",
  "CONDITIONER",
  "HAIR_MASK",
  "HAIR_OIL",
  "HAIR_SPRAY",
  "HAIR_MOUSSE",
  "HAIR_WAX",
  "HAIR_CLAY",
  "HAIR_POWDER",
  "HAIR_SILK",
  "HAIR_DYE",
  "HAIR_EXTENSIONS",
  "SKIN_EXFOLIATION",
  "SKIN_MOISTURIZER",
  "SELF_TANNING",
  "HAIR_REMOVAL",
  "OTHER_STYLING"
];

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
  onChange,
  onSubmit,
  isLoading = false,
  isEditing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-7 h-7 text-green-600" />
          <div>
            <h2 className="text-xl font-bold">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            <div className="text-gray-500 text-sm">
              {isEditing
                ? "Update product information"
                : "Enter product details to add to your inventory"}
            </div>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={product.name}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
              placeholder="e.g. Argan Oil Shampoo"
            />
          </div>
          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Type <span className="text-red-500">*</span>
            </label>
            <select
              name="productType"
              value={product.productType}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
            >
              <option value="">Select Product Type</option>
              {PRODUCT_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          {/* Brand */}
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              name="brand"
              value={product.brand}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
              placeholder="e.g. L'Oréal"
            />
          </div>
          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <DollarSign className="w-4 h-4" /> Price <span className="text-red-500">*</span>
            </label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={product.price}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
              placeholder="e.g. 2500"
            />
          </div>
          {/* Stock Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              name="stockQuantity"
              type="number"
              min="0"
              value={product.stockQuantity}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
              placeholder="e.g. 15"
            />
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1 flex gap-1 items-center">
              <FileText className="w-4 h-4" /> Description
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={onChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
              placeholder="Write a short description..."
            />
          </div>
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="active"
              value={product.active ? "true" : "false"}
              onChange={e => {
                const event = {
                  target: {
                    name: "active",
                    value: e.target.value === "true"
                  }
                } as unknown as React.ChangeEvent<HTMLInputElement>
                onChange(event)
              }}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              disabled={isLoading}
            >
              {isLoading
                ? "Saving..."
                : isEditing
                  ? "Update Product"
                  : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
