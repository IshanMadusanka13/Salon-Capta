import Image from 'next/image';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  UserCog,
  Clock,
  ReceiptText,
  Scissors,
  Package,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { useState } from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isEmployeeMenuOpen, setIsEmployeeMenuOpen] = useState(false);

  return (
    <div className="hidden md:flex md:w-64 md:flex-col mt-20">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center flex-shrink-0 px-4">
          <Image
            src="/logo.png"
            alt="Salon Capta Logo"
            width={50}
            height={50}
            className="h-12 w-auto"
          />
          <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
            Salon Capta
          </span>
        </div>
        <div className="mt-6 flex flex-col flex-1">
          <nav className="flex-1 px-2 pb-4 space-y-1 mt-5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab === 'overview'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab === 'appointments'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <CalendarCheck className="mr-3 h-5 w-5" />
              Appointments
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab === 'customers'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Customers
            </button>

            <button
              onClick={() => setIsEmployeeMenuOpen(!isEmployeeMenuOpen)}
              className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab.startsWith('employees')
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <div className="flex items-center">
                <UserCog className="mr-3 h-5 w-5" />
                Employees
              </div>
              {isEmployeeMenuOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {isEmployeeMenuOpen && (
              <div className="ml-4 space-y-1">
                <button
                  onClick={() => setActiveTab('employees')}
                  className={`flex items-center px-4 py-2 text-sm rounded-md w-full ${activeTab === 'employees'
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                >
                  Manage Employees
                </button>

                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`flex items-center px-4 py-2 text-sm rounded-md w-full ${activeTab === 'attendance'
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                >
                  Attendance
                </button>

                <button
                  onClick={() => setActiveTab('salary-report')}
                  className={`flex items-center px-4 py-2 text-sm rounded-md w-full ${activeTab === 'salary-report'
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                >
                  Salary Report
                </button>
              </div>
            )}

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab === 'services'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <Scissors className="mr-3 h-5 w-5" />
              Services
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab === 'products'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <Package className="w-6 h-6" />
              Products
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
