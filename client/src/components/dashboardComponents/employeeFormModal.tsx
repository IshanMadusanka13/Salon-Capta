// components/dashboardComponents/employeeFormModal.tsx
import React from 'react';
import { X, User, Calendar, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

interface Employee {
  name: string;
  dob: string;
  gender: string;
  address: string;
  nic: string;
  email: string;
  phone: string;
  joinDate: string | Date;
  employeeId?: string | number;
}

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  employee,
  onChange,
  onSubmit,
  isLoading = false,
  isEditing = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative top-10 mx-auto p-6 border-0 w-full max-w-4xl shadow-2xl rounded-2xl bg-white dark:bg-gray-900 m-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Employee' : 'Add New Employee'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditing ? 'Update employee information' : 'Enter employee details to create a new record'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Personal Information
            </h4>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={employee.name}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                    placeholder="Enter full name"
                  />
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Date of Birth *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dob"
                    id="dob"
                    value={typeof employee.dob === 'string' ? employee.dob : ''}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                  />
                  <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Gender *
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={employee.gender}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* NIC Number */}
              <div className="space-y-2">
                <label htmlFor="nic" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  NIC Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nic"
                    id="nic"
                    value={employee.nic}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                    placeholder="Enter NIC number"
                  />
                  <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-600" />
              Contact Information
            </h4>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={employee.email}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                    placeholder="Enter email address"
                  />
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Mobile Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={employee.phone}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                    placeholder="Enter mobile number"
                  />
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Address
              </label>
              <div className="relative">
                <textarea
                  name="address"
                  id="address"
                  value={employee.address}
                  onChange={onChange}
                  rows={3}
                  className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 resize-none"
                  placeholder="Enter full address"
                />
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
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
                isEditing ? 'Update Employee' : 'Save Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;