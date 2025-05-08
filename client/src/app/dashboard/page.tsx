"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../utils/apicall';
import { Calendar, Clock, Users, DollarSign, Calendar as CalendarIcon, Plus, BarChart2, Settings, LogOut, Bell } from 'lucide-react';
import { useSelector } from 'react-redux';

interface Appointment {
    appointmentId: string;
    user: Customer;
    service: Service;
    timeSlot: string;
    price: number;
    date: string;//appointment.timeSlot.split('T')[0],
    time: string;// appointment.timeSlot.split('T')[1].substring(0, 5),
}

interface Customer {
    userId: string;
    name: string;
    email: string;
    mobile: string;
    totalVisits: number;
    lastVisit: string;
}

interface Service {
    serviceId: string;
    serviceType: string;
    name: string;
    description: string;
    price: number;
}

interface SummaryData {
    todayAppointments: number;
    todayRevenue: number;
    totalCustomers: number;
    monthlyRevenue: number;
}

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('appointments');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [summaryData, setSummaryData] = useState<SummaryData>({
        todayAppointments: 0,
        todayRevenue: 0,
        totalCustomers: 0,
        monthlyRevenue: 0
    });
    //const [notifications, setNotifications] = useState<{ id: string, message: string, time: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    //const [showNotifications, setShowNotifications] = useState(false);
    const router = useRouter();
    const state = useSelector((state: any) => state);
    const { user, token } = state.auth || {};
    const [employees, setEmployees] = useState([]);
    const [showEmployeeForm, setShowEmployeeForm] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        email: '',
        phone: '',
        joinDate: '',
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const appointmentsData = await api.getRecentAppointments(token);
                const customersData = await api.getAllCustomers(token);
                const summaryData = await api.getDashboardSummary(token);
                const notificationsData = null//await api.getNotifications();
                const employeesData = await api.getAllEmployees(token);

                setEmployees(employeesData);
                setAppointments(appointmentsData);
                setCustomers(customersData);
                setSummaryData(summaryData);
                //setNotifications(notificationsData || "");
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEmployee(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEmployeeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await api.addEmployees(newEmployee, token);
            setNewEmployee({
                name: '',
                email: '',
                phone: '',
                joinDate: '',
            });
            setShowEmployeeForm(false);
            const employeesData = await api.getAllEmployees(token);
            setEmployees(employeesData);
        } catch (error) {
            console.error("Failed to add employee:", error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
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
                        <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">Salon Capta</span>
                    </div>
                    <div className="mt-6 flex flex-col flex-1">
                        <nav className="flex-1 px-2 pb-4 space-y-1 mt-5">
                            <button
                                onClick={() => setActiveTab('appointments')}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab === 'appointments'
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Calendar className="mr-3 h-5 w-5" />
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
                                onClick={() => setActiveTab('employees')}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab === 'employees'
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Users className="mr-3 h-5 w-5" />
                                Employees
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden mt-20">

                <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {isLoading ? (
                            <div className="w-full flex justify-center mt-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h1>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Welcome back! Here's what's happening with your salon today.
                                    </p>

                                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 rounded-md p-3">

                                                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Customers</dt>
                                                            <dd className="flex items-baseline">
                                                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                                    {summaryData.totalCustomers}
                                                                </div>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                                                        <CalendarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Today's Appointments</dt>
                                                            <dd className="flex items-baseline">
                                                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                                    {summaryData.todayAppointments}
                                                                </div>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                                                        <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Today's Revenue</dt>
                                                            <dd className="flex items-baseline">
                                                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                                    LKR {summaryData.todayRevenue}
                                                                </div>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-md p-3">
                                                        <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Monthly Revenue</dt>
                                                            <dd className="flex items-baseline">
                                                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                                    LKR {summaryData.monthlyRevenue}
                                                                </div>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {activeTab === 'appointments' && (
                                    <>
                                        <h2 className="mt-8 text-lg font-medium text-gray-900 dark:text-white">Recent Appointments</h2>
                                        <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Customer
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Service
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Date & Time
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Price
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                        {appointments.slice(0, 5).map((appointment) => (
                                                            <tr key={appointment.appointmentId}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                                    {appointment.user.name}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                    {appointment.service.name}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                    {appointment.timeSlot.split('T')[0]} • {appointment.timeSlot.split('T')[1]}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                    LKR {appointment.service.price}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'customers' && (
                                    <div>

                                        <h2 className="mt-8 text-lg font-medium text-gray-900 dark:text-white">Customers</h2>
                                        <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Name
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Email
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Mobile
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                        {customers.map((customer) => (
                                                            <tr key={customer.userId}>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div className="flex-shrink-0 h-10 w-10">
                                                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                                <span className="text-indigo-700 font-medium text-sm">
                                                                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ml-4">
                                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                                {customer.name}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                    {customer.email}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                    {customer.mobile}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {customers.length === 0 && (
                                                            <tr>
                                                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                                    No customers found. Try adjusting your search.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'employees' && (
                                    <div>
                                        <div className="mt-8 flex justify-between items-center">
                                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Employees</h2>
                                            {!showEmployeeForm && (
                                                <button
                                                    onClick={() => setShowEmployeeForm(true)}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Employee
                                                </button>
                                            )}
                                        </div>

                                        {showEmployeeForm ? (
                                            <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Employee</h3>
                                                <form onSubmit={handleEmployeeSubmit}>
                                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                        <div>
                                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                Full Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                id="name"
                                                                value={newEmployee.name}
                                                                onChange={handleEmployeeChange}
                                                                required
                                                                className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                Email
                                                            </label>
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                id="email"
                                                                value={newEmployee.email}
                                                                onChange={handleEmployeeChange}
                                                                required
                                                                className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                Mobile Number
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                name="phone"
                                                                id="phone"
                                                                value={newEmployee.phone}
                                                                onChange={handleEmployeeChange}
                                                                required
                                                                className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 flex justify-end space-x-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowEmployeeForm(false)}
                                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            Save Employee
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        ) : (
                                            <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                                            <tr>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                    Name
                                                                </th>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                    Email
                                                                </th>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                    Mobile
                                                                </th>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                    Join Date
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                            {employees.map((employee: any) => (
                                                                <tr key={employee.employeeId}>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center">
                                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                                    <span className="text-indigo-700 font-medium text-sm">
                                                                                        {employee.name.split(' ').map((n: string) => n[0]).join('')}                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ml-4">
                                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                                    {employee.name}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {employee.email}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {employee.phone}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {employee.joinDate}
                                                                    </td>
                                                                </tr>
                                                            ))}                                                            {employees.length === 0 && (
                                                                <tr>
                                                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                                        No employees found. Add your first employee.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </>
                        )}
                    </div>
                </main>
            </div >
        </div >
    );
}