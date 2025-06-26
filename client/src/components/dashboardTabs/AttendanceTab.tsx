import DatePicker from 'react-datepicker';
import { Plus, CalendarCheck } from 'lucide-react';
import { DashboardTable } from '@/components/dashboardComponents/dashboardTable';
import { format, parseISO, endOfDay } from 'date-fns';

export interface Attendance {
  attendanceId: string;
  employeeId: string;
  employee: { name: string };
  date: string;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'LEAVE';
  arrival?: string;
  departure?: string;
}

export interface Employee {
  employeeId: string;
  name: string;
}

interface AttendanceFilters {
  selectedEmployee: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface AttendanceTabProps {
  attendances: Attendance[];
  employees: Employee[];
  attendanceFilters: AttendanceFilters;
  setAttendanceFilters: React.Dispatch<React.SetStateAction<AttendanceFilters>>;
  resetAttendanceFilters: () => void;
  setShowAttendanceForm: (open: boolean) => void;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({
  attendances, employees, attendanceFilters, setAttendanceFilters, resetAttendanceFilters, setShowAttendanceForm
}) => (
  <div>
    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Employee Attendance</h1>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
      Record and review staff attendance. Track presence, absences, and working hours for better management.
    </p>
    <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center space-x-4">
        {/* Employee Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">Employee:</label>
          <select
            value={attendanceFilters.selectedEmployee}
            onChange={(e) => setAttendanceFilters(prev => ({ ...prev, selectedEmployee: e.target.value }))}
            className="border rounded px-3 py-1 dark:bg-gray-700 dark:text-white min-w-[150px]"
          >
            <option value="">All Employees</option>
            {employees.map((employee) => (
              <option key={employee.employeeId} value={employee.employeeId}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        {/* Date Range Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">Date Range:</label>
          <DatePicker
            selectsRange
            startDate={attendanceFilters.startDate}
            endDate={attendanceFilters.endDate}
            onChange={(dates) => {
              const [start, end] = dates as [Date | null, Date | null];
              setAttendanceFilters(prev => ({
                ...prev,
                startDate: start,
                endDate: end
              }));
            }}
            isClearable
            placeholderText="Select date range"
            className="border rounded px-3 py-1 dark:bg-gray-700 dark:text-white"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        {/* Clear Filters Button */}
        {(attendanceFilters.selectedEmployee || attendanceFilters.startDate || attendanceFilters.endDate) && (
          <button
            onClick={resetAttendanceFilters}
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Clear Filters
          </button>
        )}
      </div>
      <button
        onClick={() => setShowAttendanceForm(true)}
        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
      >
        <Plus className="mr-2 h-4 w-4" />
        Mark Attendance
      </button>
    </div>
    <div className="mt-6 bg-white dark:bg-gray-900 shadow-xl overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <DashboardTable
          data={attendances}
          itemsPerPage={10}
          columns={['Employee', 'Date', 'Status', 'Check-in', 'Check-out']}
          renderRow={(attendance: Attendance) => (
            <tr key={attendance.attendanceId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {attendance.employee.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {attendance.arrival ? format(parseISO(attendance.arrival), 'MMM dd, yyyy') :
                  attendance.date ? format(parseISO(attendance.date), 'MMM dd, yyyy') : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${attendance.attendanceStatus === 'PRESENT'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : attendance.attendanceStatus === 'ABSENT'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                  {attendance.attendanceStatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {attendance.arrival ? format(parseISO(attendance.arrival), 'HH:mm') : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {attendance.departure ? format(parseISO(attendance.departure), 'HH:mm') : '-'}
              </td>
            </tr>
          )}
          noData={
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <CalendarCheck className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No attendance records found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {attendanceFilters.selectedEmployee || attendanceFilters.startDate || attendanceFilters.endDate
                  ? "No records match your current filters. Try adjusting the filter criteria."
                  : "Begin tracking attendance by marking your first entry."
                }
              </p>
              <div className="flex gap-2">
                {(attendanceFilters.selectedEmployee || attendanceFilters.startDate || attendanceFilters.endDate) && (
                  <button
                    onClick={resetAttendanceFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={() => setShowAttendanceForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Mark Attendance
                </button>
              </div>
            </div>
          }
        />
      </div>
    </div>
  </div>
);

export default AttendanceTab;
