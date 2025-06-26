import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { DashboardTable } from '@/components/dashboardComponents/dashboardTable';
import { Clock, Users, DollarSign, Loader } from 'lucide-react';

export interface SalaryReport {
    employeeId: string;
    name: string;
    baseSalary: number;
    attendanceDays: number;
    totalServices: number;
    serviceCommission: number;
    totalSalary: number;
    deductions: number;
    bonuses: number;
}

interface SalaryReportTabProps {
    employees: Array<{ employeeId: string; name: string }>;
    onGenerateReport: (month: Date) => Promise<SalaryReport[]>;
}

const SalaryReportTab: React.FC<SalaryReportTabProps> = ({ employees, onGenerateReport }) => {
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [reportData, setReportData] = useState<SalaryReport[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const data = await onGenerateReport(selectedMonth);
            setReportData(data);
        } catch (error) {
            console.error('Failed to generate report:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Salary Report</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Generate monthly salary reports based on attendance and service performance.
            </p>

            <div className="mt-6 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Select Month:</label>
                    <DatePicker
                        selected={selectedMonth}
                        onChange={(date: Date | null) => setSelectedMonth(date || new Date())}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className="border rounded px-3 py-1.5 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <DollarSign className="mr-2 h-4 w-4" />
                    )}
                    Generate Report
                </button>
            </div>

            {reportData.length > 0 && (
                <div className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Payroll</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        LKR {reportData.reduce((sum, item) => sum + item.totalSalary, 0).toLocaleString()}
                                    </p>
                                </div>
                                <DollarSign className="h-6 w-6 text-green-500" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Average Salary</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        LKR {Math.round(reportData.reduce((sum, item) => sum + item.totalSalary, 0) / reportData.length).toLocaleString()}
                                    </p>
                                </div>
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Services</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {reportData.reduce((sum, item) => sum + item.totalServices, 0).toLocaleString()}
                                    </p>
                                </div>
                                <Clock className="h-6 w-6 text-purple-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
                        <DashboardTable
                            columns={['Employee', 'Base Salary', 'Attendance', 'Services', 'Total Salary']}
                            data={reportData}
                            renderRow={(employee: SalaryReport) => (
                                <tr key={employee.employeeId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                                <span className="text-indigo-600 dark:text-indigo-300 font-medium">
                                                    {employee.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {employee.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    ID: {employee.employeeId}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            LKR {employee.baseSalary.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {employee.attendanceDays} days
                                            {employee.deductions > 0 && (
                                                <span className="ml-2 text-red-500 text-xs">
                                                    (-LKR {employee.deductions.toLocaleString()})
                                                </span>
                                            )}
                                            {employee.bonuses > 0 && (
                                                <span className="ml-2 text-green-500 text-xs">
                                                    (+LKR {employee.bonuses.toLocaleString()})
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {employee.totalServices} services
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                +LKR {employee.serviceCommission.toLocaleString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                            LKR {employee.totalSalary.toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            )}
                            noData={
                                <div className="px-6 py-4 text-center">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        No salary data available. Generate a report for the selected month.
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalaryReportTab;
