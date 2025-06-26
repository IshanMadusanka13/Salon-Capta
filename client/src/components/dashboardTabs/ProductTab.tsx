import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { DashboardTable } from '@/components/dashboardComponents/dashboardTable';

export interface Product {
  productId: string;
  productType: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  stockQuantity: number;
  active: boolean;
}

interface ProductsTabProps {
  products: Product[];
  setShowNewProductForm: (open: boolean) => void;
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (product: Product) => void;
}

const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  setShowNewProductForm,
  handleEditProduct,
  handleDeleteProduct,
}) => (
  <div>
    <div className="flex items-center mb-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Package className="w-6 h-6" /> Products
      </h2>
      <button
        onClick={() => setShowNewProductForm(true)}
        className="ml-auto inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Product
      </button>
    </div>

    <DashboardTable
      columns={[
        'ID',
        'Type',
        'Name',
        'Brand',
        'Description',
        'Price',
        'Stock',
        'Status',
        'Actions',
      ]}
      data={products}
      renderRow={(product: Product) => (
        <tr key={product.productId} className="border-b dark:border-gray-700">
          <td className="py-3 px-3 font-mono">{product.productId}</td>
          <td className="py-3 px-3">{product.productType}</td>
          <td className="py-3 px-3">{product.name}</td>
          <td className="py-3 px-3">{product.brand}</td>
          <td className="py-3 px-3">{product.description}</td>
          <td className="py-3 px-3">LKR {product.price?.toFixed(2)}</td>
          <td className="py-3 px-3">{product.stockQuantity}</td>
          <td className="py-3 px-3">
            {product.active ? (
              <span className="text-green-600 font-semibold">Active</span>
            ) : (
              <span className="text-red-600 font-semibold">Inactive</span>
            )}
          </td>
          <td className="py-3 px-3">
            <div className="flex gap-2">
              <button
                onClick={() => handleEditProduct(product)}
                className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors duration-150"
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product)}
                className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors duration-150"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </button>
            </div>
          </td>
        </tr>
      )}
      noData={
        <div className="text-center py-8">
          <p className="text-gray-700">No products found</p>
          <button
            onClick={() => setShowNewProductForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 mt-4"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </button>
        </div>
      }
    />
  </div>
);

export default ProductsTab;
