"use client"

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '../../utils/apicall';
import { Calendar, Clock, Users, DollarSign, Calendar as CalendarIcon, Plus, BarChart2, Settings, LogOut, Bell, Edit, Trash2, Scissors, CalendarCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import OverviewCard from '@/components/dashboardComponents/overviewCard';
import EmployeeFormModal from '@/components/dashboardComponents/employeeFormModal';
import EmployeeViewModal from '@/components/dashboardComponents/employeeViewModal';
import DeleteConfirmationModal from '@/components/dashboardComponents/deleteConfirmationModal';
import ServiceFormModal from '@/components/dashboardComponents/serviceFormModal';
import { DashboardTable } from '@/components/dashboardComponents/dashboardTable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { endOfDay, format, isSameDay, parseISO } from 'date-fns';
import AttendanceModal from '@/components/dashboardComponents/markAttendanceModal';

interface Appointment {
    appointmentId: string;
    user: Customer;
    service: Service;
    timeSlot: string;
    price: number;
    date: string;
    time: string;
}

interface Customer {
    userId: string;
    name: string;
    email: string;
    mobile: string;
    totalVisits: number;
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

interface Attendance {
    attendanceId: string;
    employeeId: string;
    employee: { name: string };
    date: string;
    attendanceStatus: 'PRESENT' | 'ABSENT' | 'LEAVE';
    arrival?: string;
    departure?: string;
}

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [summaryData, setSummaryData] = useState<SummaryData>({
        todayAppointments: 0,
        todayRevenue: 0,
        totalCustomers: 0,
        monthlyRevenue: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const state = useSelector((state: any) => state);
    const { user, token } = state.auth || {};
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;
    const [employees, setEmployees] = useState([]);
    const [showEmployeeForm, setShowEmployeeForm] = useState(false);
    const [viewEmployeeData, setViewEmployeeData] = useState<any>(null);
    const [editEmployeeData, setEditEmployeeData] = useState<any>(null);
    const [deleteEmployeeData, setDeleteEmployeeData] = useState<any>(null);
    const [deleteServiceData, setDeleteServiceData] = useState<any>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showEmployeeDeleteConfirm, setShowEmployeeDeleteConfirm] = useState(false);
    const [showServiceDeleteConfirm, setShowServiceDeleteConfirm] = useState(false);
    const [showAttendanceForm, setShowAttendanceForm] = useState(false);
    const [services, setServices] = useState([]);
    const [showNewServiceForm, setShowNewServiceForm] = useState(false);
    const [showEditServiceForm, setShowEditServiceForm] = useState(false);
    const [editServiceData, setEditServiceData] = useState<any>(null);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        dob: '',
        gender: '',
        address: '',
        nic: '',
        email: '',
        phone: '',
        joinDate: new Date(),
    });
    const [currentService, setCurrentService] = useState({
        serviceId: 0,
        serviceType: '',
        name: '',
        description: '',
        price: 0
    });
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [attendanceFilters, setAttendanceFilters] = useState({
        selectedEmployee: '',
        startDate: null as Date | null,
        endDate: null as Date | null
    });
    const [attendanceFormData, setAttendanceFormData] = useState({
        selectedEmployee: '',
        attendanceDate: new Date(),
        attendanceStatus: 'PRESENT' as 'PRESENT' | 'ABSENT' | 'LEAVE',
        checkInTime: '',
        checkOutTime: ''
    });
    const [attendanceDateRange, setAttendanceDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [attendanceStartDate, attendanceEndDate] = attendanceDateRange;



    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const appointmentsData = await api.getRecentAppointments(token);
                const customersData = await api.getAllCustomers(token);
                const summaryData = await api.getDashboardSummary(token);
                const employeesData = await api.getAllEmployees(token);
                const serviceData = await api.getAllServices(token);
                const attendanceData = await api.getAttendances(token);

                setAttendances(attendanceData);
                console.log(attendanceData)
                setEmployees(employeesData);
                setServices(serviceData);
                setAppointments(appointmentsData);
                setCustomers(customersData);
                setSummaryData(summaryData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewEmployee(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentService(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAttendanceFormChange = (field: keyof typeof attendanceFormData, value: any) => {
        setAttendanceFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleViewEmployee = (employee: any) => {
        setViewEmployeeData(employee);
        setShowViewModal(true);
    };

    const handleEditEmployee = (employee: any) => {
        setEditEmployeeData({ ...employee });
        setShowEditModal(true);
    };

    const handleDeleteEmployee = (employee: any) => {
        setDeleteEmployeeData(employee);
        setShowEmployeeDeleteConfirm(true);
    };

    const handleEditService = (service: any) => {
        setEditServiceData(service);
        setShowEditServiceForm(true);
    };

    const handleDeleteService = (service: any) => {
        setDeleteServiceData(service);
        setShowServiceDeleteConfirm(true);
    };

    useEffect(() => {
        const fetchFilteredAppointments = async () => {
            if (!startDate || !endDate) {
                const appointmentsData = await api.getRecentAppointments(token);
                setAppointments(appointmentsData);
                return;
            }

            setIsLoading(true);
            try {
                const formattedStart = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
                const formattedEnd = format(endOfDay(endDate), "yyyy-MM-dd'T'HH:mm:ss");

                const response = await api.getAppointmentsByRange(token, formattedStart, formattedEnd);
                setAppointments(response);
            } catch (err) {
                console.error('Failed to fetch filtered appointments:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilteredAppointments();
    }, [startDate, endDate]);

    useEffect(() => {
        const fetchFilteredAttendances = async () => {
            setIsLoading(true);
            try {
                let response;
                console.log(attendanceFilters)
                if ((attendanceFilters.startDate && attendanceFilters.endDate) && !attendanceFilters.selectedEmployee) {
                    const formattedStart = format(attendanceFilters.startDate, "yyyy-MM-dd");
                    const formattedEnd = format(endOfDay(attendanceFilters.endDate), "yyyy-MM-dd");
                    response = await api.getAttendancesFiltered(0, formattedStart, formattedEnd, token);
                }
                else if (attendanceFilters.selectedEmployee && (!attendanceFilters.startDate || !attendanceFilters.endDate)) {
                    response = await api.getAttendancesFiltered(attendanceFilters.selectedEmployee, '1900-01-01', '1900-01-01', token);
                }
                else if (attendanceFilters.selectedEmployee && attendanceFilters.startDate && attendanceFilters.endDate) {
                    const formattedStart = format(attendanceFilters.startDate, "yyyy-MM-dd");
                    const formattedEnd = format(endOfDay(attendanceFilters.endDate), "yyyy-MM-dd");
                    response = await api.getAttendancesFiltered(attendanceFilters.selectedEmployee, formattedStart, formattedEnd, token);
                }
                else {
                    response = await api.getAttendances(token);
                }

                setAttendances(response);
            } catch (err) {
                console.error('Failed to fetch filtered attendances:', err);
                const allAttendances = await api.getAttendances(token);
                setAttendances(allAttendances);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilteredAttendances();
    }, [attendanceFilters.selectedEmployee, attendanceFilters.endDate, token]);

    const resetAttendanceFilters = () => {
        setAttendanceFilters({
            selectedEmployee: '',
            startDate: null,
            endDate: null
        });
    };

    const handleServiceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await api.createService(currentService, token);
            setCurrentService({
                serviceId: 0,
                serviceType: '',
                name: '',
                description: '',
                price: 0
            });
            setShowNewServiceForm(false);
            const servicesData = await api.getAllServices(token);
            setServices(servicesData);
        } catch (error) {
            console.error("Failed to add Service:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmployeeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await api.addEmployees(newEmployee, token);
            setNewEmployee({
                name: '',
                dob: '',
                gender: '',
                address: '',
                nic: '',
                email: '',
                phone: '',
                joinDate: new Date(),
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

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await api.updateEmployee(editEmployeeData, token);
            setShowEditModal(false);

            const employeesData = await api.getAllEmployees(token);
            setEmployees(employeesData);
            setEditEmployeeData(null)
            setShowEditServiceForm(false)
        } catch (error) {
            console.error("Failed to update employee:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsLoading(true);
            await api.deleteEmployee(deleteEmployeeData.employeeId, token);
            setShowEmployeeDeleteConfirm(false);

            const employeesData = await api.getAllEmployees(token);
            setEmployees(employeesData);
        } catch (error) {
            console.error("Failed to delete employee:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleServiceDeleteConfirm = async () => {
        try {
            setIsLoading(true);
            await api.deleteService(deleteServiceData.serviceId, token);
            setShowServiceDeleteConfirm(false);

            const servicesData = await api.getAllServices(token);
            setServices(servicesData);
        } catch (error) {
            console.error("Failed to delete Service:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleServiceEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await api.updateService(token, editServiceData.serviceId, editServiceData);
            setShowEditServiceForm(false);

            const servicesData = await api.getAllServices(token);
            setServices(servicesData);
        } catch (error) {
            console.error("Failed to update Service:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAttendanceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const attendanceData = {
                employee: { employeeId: attendanceFormData.selectedEmployee },
                date: format(attendanceFormData.attendanceDate, 'yyyy-MM-dd'),
                attendanceStatus: attendanceFormData.attendanceStatus,
                arrival: attendanceFormData.attendanceStatus === 'PRESENT' && attendanceFormData.checkInTime
                    ? `${format(attendanceFormData.attendanceDate, 'yyyy-MM-dd')}T${attendanceFormData.checkInTime}:00`
                    : null,
                departure: attendanceFormData.attendanceStatus === 'PRESENT' && attendanceFormData.checkOutTime
                    ? `${format(attendanceFormData.attendanceDate, 'yyyy-MM-dd')}T${attendanceFormData.checkOutTime}:00`
                    : null
            };

            await api.markAttendance(attendanceData, token);

            const updatedAttendances = await api.getAttendances(token);
            setAttendances(updatedAttendances);

            // Reset form data
            setAttendanceFormData({
                selectedEmployee: '',
                attendanceDate: new Date(),
                attendanceStatus: 'PRESENT',
                checkInTime: '',
                checkOutTime: ''
            });
        } catch (error) {
            console.error("Failed to mark attendance:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
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
                                onClick={() => setActiveTab('overview')}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab === 'overview'
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Calendar className="mr-3 h-5 w-5" />
                                Overview
                            </button>
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
                            <button
                                onClick={() => setActiveTab('attendance')}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab === 'attendance'
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Users className="mr-3 h-5 w-5" />
                                Attendance
                            </button>
                            <button
                                onClick={() => setActiveTab('services')}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab === 'services'
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Users className="mr-3 h-5 w-5" />
                                Services
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
                                {activeTab === 'overview' && (
                                    <>
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
                                    </>
                                )}

                                {activeTab === 'appointments' && (
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
                                                    onChange={(update) => setDateRange(update)}
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
                                                    renderRow={(appointment) => (
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
                                )}

                                {activeTab === 'services' && (
                                    <div>
                                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Services</h1>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            Manage all your salon's services below. You can add, edit, or remove offerings as needed.
                                        </p>
                                        <div className="mt-8 flex justify-between items-center">
                                            <button
                                                onClick={() => setShowNewServiceForm(true)}
                                                className="ml-auto inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Service
                                            </button>
                                        </div>

                                        <div className="mt-6 bg-white dark:bg-gray-900 shadow-xl overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
                                            <div className="overflow-x-auto">
                                                <DashboardTable
                                                    data={services}
                                                    itemsPerPage={5}
                                                    columns={['Service', 'Type', 'Description', 'Price', 'Actions']}
                                                    renderRow={(service: any) => (
                                                        <tr key={service.serviceId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-12 w-12">
                                                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                                                            <span className="text-white font-bold text-lg">
                                                                                {service.name.charAt(0).toUpperCase()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                            {service.name}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                            ID: {service.serviceId}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${service.serviceType === 'HAIRCUTS'
                                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                                    : service.serviceType === 'COLORING'
                                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                                                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                                    }`}>
                                                                    {service.serviceType.replace('_', ' ')}
                                                                </span>
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                                                                    <p className="truncate" title={service.description}>
                                                                        {service.description}
                                                                    </p>
                                                                </div>
                                                            </td>

                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                                                    LKR {service.price?.toFixed(2)}
                                                                </span>
                                                            </td>

                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <div className="flex space-x-3">
                                                                    <button
                                                                        onClick={() => handleEditService(service)}
                                                                        className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors duration-150"
                                                                    >
                                                                        <Edit className="h-3 w-3 mr-1" />
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteService(service)}
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
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                                                <Scissors className="h-8 w-8 text-gray-400" />
                                                            </div>
                                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                                No services found
                                                            </h3>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                                Get started by adding your first service.
                                                            </p>
                                                            <button
                                                                onClick={() => setShowNewServiceForm(true)}
                                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                                                            >
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Add Service
                                                            </button>
                                                        </div>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'customers' && (
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
                                                    renderRow={(customer: { userId: string; name: string; email: string; mobile: string }) => (
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
                                                    )} noData={
                                                        <div className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                            No customers found. Try adjusting your search.
                                                        </div>
                                                    }
                                                />

                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'employees' && (
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
                                                    columns={['Name', 'Email', 'Mobile', 'Actions']}
                                                    renderRow={(employee: { employeeId: string; name: string; email: string; phone: string }) => (
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
                                                    )} noData={
                                                        <div className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                            No employees found. Add your first employee.
                                                        </div>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'attendance' && (
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
                                                        {employees.map((employee: any) => (
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
                                                            const [start, end] = dates;
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
                                                    renderRow={(attendance) => (
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
                                )}
                            </>
                        )}

                    </div>
                    <EmployeeFormModal
                        isOpen={showEmployeeForm}
                        onClose={() => setShowEmployeeForm(false)}
                        employee={newEmployee}
                        onChange={handleEmployeeChange}
                        onSubmit={handleEmployeeSubmit}
                        isLoading={isLoading}
                    />

                    <EmployeeFormModal
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        employee={editEmployeeData || {}}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            setEditEmployeeData((prev: any) => ({
                                ...prev,
                                [name]: value
                            }));
                        }}
                        onSubmit={handleEditSubmit}
                        isLoading={isLoading}
                        isEditing={true}
                    />


                    <AttendanceModal
                        show={showAttendanceForm}
                        onClose={() => setShowAttendanceForm(false)}
                        onSubmit={handleAttendanceSubmit}
                        employees={employees}
                        formData={attendanceFormData}
                        onFormChange={handleAttendanceFormChange}
                    />


                    <EmployeeViewModal
                        isOpen={showViewModal}
                        onClose={() => setShowViewModal(false)}
                        employee={viewEmployeeData}
                    />

                    <DeleteConfirmationModal
                        isOpen={showEmployeeDeleteConfirm}
                        onClose={() => setShowEmployeeDeleteConfirm(false)}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Employee"
                        message={`Are you sure you want to delete ${deleteEmployeeData?.name}? This action cannot be undone.`}
                        isLoading={isLoading}
                    />

                    <DeleteConfirmationModal
                        isOpen={showServiceDeleteConfirm}
                        onClose={() => setShowServiceDeleteConfirm(false)}
                        onConfirm={handleServiceDeleteConfirm}
                        title="Delete Service"
                        message={`Are you sure you want to delete ${deleteServiceData?.name}? This action cannot be undone.`}
                        isLoading={isLoading}
                    />

                    <ServiceFormModal
                        isOpen={showNewServiceForm}
                        onClose={() => setShowNewServiceForm(false)}
                        service={currentService}
                        onChange={handleServiceChange}
                        onSubmit={handleServiceSubmit}
                        isLoading={isLoading}
                    />

                    <ServiceFormModal
                        isOpen={showEditServiceForm}
                        onClose={() => setShowEditServiceForm(false)}
                        service={editServiceData || {}}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            setEditServiceData((prev: any) => ({
                                ...prev,
                                [name]: value
                            }));
                        }}
                        onSubmit={handleServiceEditSubmit}
                        isLoading={isLoading}
                        isEditing={true}
                    />
                </main>
            </div >
        </div >
    );
}