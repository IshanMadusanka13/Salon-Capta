import { DashboardTable } from '@/components/dashboardComponents/dashboardTable';

export interface Customer {
  userId: string;
  name: string;
  email: string;
  mobile: string;
}

interface CustomersTabProps {
  customers: Customer[];
}

const CustomersTab: React.FC<CustomersTabProps> = ({ customers }) => (
  <div>
    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Customers</h1>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
      Access your customer directory. Keep profiles up to date and track visit history to build lasting relationships.
    </p>
    <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <DashboardTable
          data={customers}
          itemsPerPage={5}
          columns={['Name', 'Email', 'Mobile']}
          renderRow={(customer: Customer) => (
            <tr key={customer.userId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {customer.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {customer.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {customer.userId}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                  <p className="truncate" title={customer.email}>
                    {customer.email}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                  <p className="truncate" title={customer.mobile}>
                    {customer.mobile}
                  </p>
                </div>
              </td>
            </tr>
          )}
          noData={
            <div className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No customers found. Try adjusting your search.
            </div>
          }
        />
      </div>
    </div>
  </div>
);

export default CustomersTab;
