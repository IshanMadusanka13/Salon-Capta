import { Users, Calendar as CalendarIcon, DollarSign, Clock } from 'lucide-react';
import OverviewCard from '@/components/dashboardComponents/overviewCard';

export interface SummaryData {
  todayAppointments: number;
  todayRevenue: number;
  totalCustomers: number;
  monthlyRevenue: number;
}

interface OverviewTabProps {
  summaryData: SummaryData;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ summaryData }) => (
  <div>
    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h1>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
      Get a quick snapshot of your salon's performance. Track key metrics, monitor trends, and stay informed.
    </p>
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        icon={<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        iconBgColor='bg-indigo-100 dark:bg-indigo-900'
        title='Total Customers'
        value={summaryData.totalCustomers}
      />
      <OverviewCard
        icon={<CalendarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
        iconBgColor='bg-blue-100 dark:bg-blue-900'
        title='Todays Appointments'
        value={summaryData.todayAppointments}
      />
      <OverviewCard
        icon={<DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />}
        iconBgColor='bg-green-100 dark:bg-green-900'
        title='Todays Revenue'
        value={summaryData.todayRevenue}
        prefix='LKR'
      />
      <OverviewCard
        icon={<Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />}
        iconBgColor='bg-yellow-100 dark:bg-yellow-900'
        title='Monthly Revenue'
        value={summaryData.monthlyRevenue}
        prefix='LKR'
      />
    </div>
  </div>
);

export default OverviewTab;
