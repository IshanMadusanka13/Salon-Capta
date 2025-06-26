import { Plus, Edit, Trash2 } from 'lucide-react';
import { DashboardTable } from '@/components/dashboardComponents/dashboardTable';

export interface Employee {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  baseSalary: string;
  joinDate: Date;
}

interface EmployeesTabProps {
  employees: Employee[];
  setShowEmployeeForm: (open: boolean) => void;
  handleViewEmployee: (employee: Employee) => void;
  handleEditEmployee: (employee: Employee) => void;
  handleDeleteEmployee: (employee: Employee) => void;
}

const EmployeesTab: React.FC<EmployeesTabProps> = ({
  employees, setShowEmployeeForm, handleViewEmployee, handleEditEmployee, handleDeleteEmployee
}) => (
  <div>
    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Employees</h1>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
      View and manage your salon staff. Add new team members, update roles, or remove inactive employees.
    </p>
    <div className="mt-8 flex justify-between items-center">
      <button
        onClick={() => setShowEmployeeForm(true)}
        className="ml-auto inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Employee
      </button>
    </div>
    <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <DashboardTable
          data={employees}
          itemsPerPage={5}
          columns={['Name', 'Email', 'Mobile', 'Role', 'Join Date', 'Base Salary','Actions']}
          renderRow={(employee: Employee) => (
            <tr key={employee.employeeId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {employee.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {employee.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {employee.employeeId}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                  <p className="truncate" title={employee.email}>
                    {employee.email}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                  <p className="truncate" title={employee.phone}>
                    {employee.phone}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {employee.role}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {new Date(employee.joinDate).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {employee.baseSalary ? `Rs ${parseFloat(employee.baseSalary).toFixed(2)}` : 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewEmployee(employee)}
                    className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors duration-150"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors duration-150"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee)}
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
            <div className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No employees found. Add your first employee.
            </div>
          }
        />
      </div>
    </div>
  </div>
);

export default EmployeesTab;
