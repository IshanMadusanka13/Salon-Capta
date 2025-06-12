import React from 'react';
import { X, User, Calendar, Mail, Phone, MapPin, CreditCard, Briefcase, Badge } from 'lucide-react';

interface EmployeeViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
}

const EmployeeViewModal: React.FC<EmployeeViewModalProps> = ({
  isOpen,
  onClose,
  employee
}) => {
  if (!isOpen || !employee) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatGender = (gender: string) => {
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative top-10 mx-auto p-0 border-0 w-full max-w-2xl shadow-2xl rounded-2xl bg-white dark:bg-gray-900 m-4 overflow-hidden">
        
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">
                  {getInitials(employee.name)}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                <Badge className="h-4 w-4 text-white" />
              </div>
            </div>
            
            {/* Basic Info */}
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-1">{employee.name}</h2>
              <p className="text-indigo-100 opacity-90 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Employee ID: {employee.employeeId || 'N/A'}
              </p>
              <p className="text-indigo-100 opacity-75 text-sm mt-1">
                Joined {formatDate(employee.joinDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <User className="h-5 w-5 text-indigo-600" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                    {formatDate(employee.dob)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                    {formatGender(employee.gender)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl md:col-span-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">NIC Number</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-1 font-mono">
                    {employee.nic}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <Mail className="h-5 w-5 text-indigo-600" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                  <a 
                    href={`mailto:${employee.email}`}
                    className="text-base font-semibold text-indigo-600 dark:text-indigo-400 mt-1 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors break-all"
                  >
                    {employee.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Phone className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mobile Number</p>
                  <a 
                    href={`tel:${employee.phone}`}
                    className="text-base font-semibold text-indigo-600 dark:text-indigo-400 mt-1 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors font-mono"
                  >
                    {employee.phone}
                  </a>
                </div>
              </div>
            </div>
            
            {employee.address && (
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg mt-1">
                  <MapPin className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-1 leading-relaxed">
                    {employee.address}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewModal;