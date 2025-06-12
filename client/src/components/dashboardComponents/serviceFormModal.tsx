import { DollarSign, FileText, Scissors, X } from "lucide-react";

interface Service {
    serviceId?: number;
    serviceType: string;
    name: string;
    description: string;
    price: number;
  }
  
  interface ServiceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading?: boolean;
    isEditing?: boolean;
  }
  
  const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
    isOpen,
    onClose,
    service,
    onChange,
    onSubmit,
    isLoading = false,
    isEditing = false
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative top-10 mx-auto p-6 border-0 w-full max-w-2xl shadow-2xl rounded-2xl bg-white dark:bg-gray-900 m-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Service' : 'Add New Service'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isEditing ? 'Update service information' : 'Enter service details to create a new offering'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
  
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Service Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Service Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={service.name}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                    placeholder="Enter service name"
                  />
                  <Scissors className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
  
              {/* Service Type */}
              <div className="space-y-2">
                <label htmlFor="serviceType" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  id="serviceType"
                  value={service.serviceType}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                >
                  <option value="">Select Service Type</option>
                  <option value="HAIRCUTS">Haircuts</option>
                  <option value="COLORING">Coloring</option>
                  <option value="TREATMENTS">Treatments</option>
                </select>
              </div>
  
              {/* Price */}
              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Price *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={service.price}
                    onChange={onChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                    placeholder="0.00"
                  />
                  <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
  
            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Description
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  id="description"
                  value={service.description}
                  onChange={onChange}
                  rows={4}
                  className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 resize-none"
                  placeholder="Enter service description"
                />
                <FileText className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
  
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 border-2 border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  isEditing ? 'Update Service' : 'Save Service'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default ServiceFormModal;