import DatePicker from 'react-datepicker';
import { DashboardTable } from '@/components/dashboardComponents/dashboardTable';

export interface Appointment {
  appointmentId: string;
  user: { name: string };
  service: { name: string; price: number };
  timeSlot: string;
}

interface AppointmentsTabProps {
  appointments: Appointment[];
  startDate: Date | null;
  endDate: Date | null;
  setDateRange: (range: [Date | null, Date | null]) => void;
}

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  appointments, startDate, endDate, setDateRange
}) => (
  <>
    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Recent Appointments</h1>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
      Stay on top of your schedule. View upcoming appointments, manage bookings, and reduce no-shows with ease.
    </p>
    <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center space-x-2">
        <label className="text-sm text-gray-700 dark:text-gray-300">Filter by Date Range:</label>
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDateRange(update as [Date | null, Date | null])}
          isClearable
          placeholderText="Select date range"
          className="border rounded px-3 py-1 dark:bg-gray-700 dark:text-white"
          dateFormat="yyyy-MM-dd"
        />
      </div>
    </div>
    <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <DashboardTable
          columns={['Customer', 'Service', 'Date & Time', 'Price']}
          data={appointments}
          renderRow={(appointment: Appointment) => (
            <tr key={appointment.appointmentId}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {appointment.user.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {appointment.user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Appointment ID: {appointment.appointmentId}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                  <p className="truncate" title={appointment.service.name}>
                    {appointment.service.name}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                  <p className="truncate" title={appointment.timeSlot}>
                    {appointment.timeSlot.split('T')[0]} • {appointment.timeSlot.split('T')[1]}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  LKR {appointment.service.price}
                </span>
              </td>
            </tr>
          )}
          noData={
            <div className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No Appointments Available.
            </div>
          }
        />
      </div>
    </div>
  </>
);

export default AppointmentsTab;
