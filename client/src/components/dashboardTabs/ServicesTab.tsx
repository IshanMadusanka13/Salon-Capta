import { Plus, Edit, Trash2, Scissors } from 'lucide-react';
import { DashboardTable } from '@/components/dashboardComponents/dashboardTable';

export interface Service {
  serviceId: string;
  serviceType: string;
  name: string;
  description: string;
  price: number;
}

interface ServicesTabProps {
  services: Service[];
  setShowNewServiceForm: (open: boolean) => void;
  handleEditService: (service: Service) => void;
  handleDeleteService: (service: Service) => void;
}

const ServicesTab: React.FC<ServicesTabProps> = ({
  services, setShowNewServiceForm, handleEditService, handleDeleteService
}) => (
  <div>
    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Services</h1>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
      Manage all your salon's services below. You can add, edit, or remove offerings as needed.
    </p>
    <div className="mt-8 flex justify-between items-center">
      <button
        onClick={() => setShowNewServiceForm(true)}
        className="ml-auto inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Service
      </button>
    </div>
    <div className="mt-6 bg-white dark:bg-gray-900 shadow-xl overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <DashboardTable
          data={services}
          itemsPerPage={5}
          columns={['Service', 'Type', 'Description', 'Price', 'Actions']}
          renderRow={(service: Service) => (
            <tr key={service.serviceId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {service.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {service.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {service.serviceId}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${service.serviceType === 'HAIRCUTS'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  : service.serviceType === 'COLORING'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  }`}>
                  {service.serviceType.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                  <p className="truncate" title={service.description}>
                    {service.description}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  LKR {service.price?.toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditService(service)}
                    className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors duration-150"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(service)}
                    className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors duration-150"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          )}
          noData={
            <div className="flex flex-col items-center justify-center">
              <div className="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Scissors className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No services found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Get started by adding your first service.
              </p>
              <button
                onClick={() => setShowNewServiceForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </button>
            </div>
          }
        />
      </div>
    </div>
  </div>
);

export default ServicesTab;
