"use client"

import Navbar from '@/components/dashboardComponents/dashboardNavbar';
import DeleteConfirmationModal from '@/components/dashboardComponents/deleteConfirmationModal';
import EmployeeFormModal from '@/components/dashboardComponents/employeeFormModal';
import EmployeeViewModal from '@/components/dashboardComponents/employeeViewModal';
import AttendanceModal from '@/components/dashboardComponents/markAttendanceModal';
import ServiceFormModal from '@/components/dashboardComponents/serviceFormModal';
import ProductFormModal from '@/components/dashboardComponents/ProductFormModal';
import AppointmentsTab from '@/components/dashboardTabs/AppointmentsTab';
import AttendanceTab from '@/components/dashboardTabs/AttendanceTab';
import CustomersTab from '@/components/dashboardTabs/CustomersTab';
import EmployeesTab from '@/components/dashboardTabs/EmployeesTab';
import OverviewTab from '@/components/dashboardTabs/OverviewTab';
import ServicesTab from '@/components/dashboardTabs/ServicesTab';
import ProductsTab from '@/components/dashboardTabs/ProductTab';
import SalaryReportTab from '@/components/dashboardTabs/SalaryReportTab';
import { endOfDay, format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../../utils/apicall';
import PosForm from '@/components/dashboardTabs/Pos';

// Common Interfaces
interface BaseEntity {
    id: string;
    name: string;
}

interface Appointment {
    appointmentId: string;
    user: Customer;
    service: Service;
    timeSlot: string;
    price: number;
    date: string;
    time: string;
}

interface Customer extends BaseEntity {
    userId: string;
    email: string;
    mobile: string;
    totalVisits: number;
}

interface Service extends BaseEntity {
    serviceId: string;
    serviceType: string;
    description: string;
    price: number;
}

interface Product extends BaseEntity {
    productId: string;
    productType: string;
    description: string;
    brand: string;
    price: number;
    stockQuantity: number;
    active: boolean;
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
    employee: BaseEntity;
    date: string;
    attendanceStatus: 'PRESENT' | 'ABSENT' | 'LEAVE';
    arrival?: string;
    departure?: string;
}

interface EmployeeFormState {
    name: string;
    dob: string;
    gender: string;
    address: string;
    nic: string;
    email: string;
    phone: string;
    role: string;
    baseSalary: string;
    joinDate: Date;
}

// Initial States
const INITIAL_EMPLOYEE_STATE: EmployeeFormState = {
    name: '',
    dob: '',
    gender: '',
    address: '',
    nic: '',
    email: '',
    phone: '',
    role: '',
    baseSalary: '',
    joinDate: new Date(),
};

const INITIAL_SERVICE_STATE = {
    serviceId: 0,
    serviceType: '',
    name: '',
    description: '',
    price: 0
};

const INITIAL_PRODUCT_STATE = {
    productId: 0,
    productType: '',
    name: '',
    description: '',
    brand: '',
    price: 0,
    stockQuantity: 0,
    active: true
};

const INITIAL_ATTENDANCE_FORM = {
    selectedEmployee: '',
    attendanceDate: new Date(),
    attendanceStatus: 'PRESENT' as const,
    checkInTime: '',
    checkOutTime: ''
};

export default function DashboardPage() {
    // State Management
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useSelector((state: any) => state.auth || {});

    // Data States
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [summaryData, setSummaryData] = useState<SummaryData>({
        todayAppointments: 0,
        todayRevenue: 0,
        totalCustomers: 0,
        monthlyRevenue: 0
    });

    // Filter States
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [attendanceFilters, setAttendanceFilters] = useState({
        selectedEmployee: '',
        startDate: null as Date | null,
        endDate: null as Date | null
    });

    // Modal States
    const [modalState, setModalState] = useState({
        employee: { open: false, mode: 'add' as 'add' | 'edit' | 'view', data: null as any },
        service: { open: false, mode: 'add' as 'add' | 'edit', data: null as any },
        product: { open: false, mode: 'add' as 'add' | 'edit', data: null as any },
        attendance: { open: false },
        delete: {
            open: false,
            type: '' as 'employee' | 'service' | 'product',
            data: null as any
        }
    });

    // Form States
    const [formState, setFormState] = useState({
        employee: INITIAL_EMPLOYEE_STATE,
        service: INITIAL_SERVICE_STATE,
        product: INITIAL_PRODUCT_STATE,
        attendance: INITIAL_ATTENDANCE_FORM
    });

    const [isCreatingPos, setIsCreatingPos] = useState(false);
    const [posLoading, setPosLoading] = useState(false);

    // Data Fetching
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const [
                    appointmentsData,
                    customersData,
                    summaryData,
                    employeesData,
                    serviceData,
                    attendanceData,
                    productsData
                ] = await Promise.all([
                    api.getRecentAppointments(token),
                    api.getAllCustomers(token),
                    api.getDashboardSummary(token),
                    api.getAllEmployees(token),
                    api.getAllServices(token),
                    api.getAttendances(token),
                    api.getAllProducts(token)
                ]);

                setAttendances(attendanceData);
                setEmployees(employeesData);
                setServices(serviceData);
                setAppointments(appointmentsData);
                setCustomers(customersData);
                setSummaryData(summaryData);
                setProducts(productsData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [token]);

    // Appointment Filter Effect
    useEffect(() => {
        const fetchFilteredAppointments = async () => {
            const [startDate, endDate] = dateRange;

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
    }, [dateRange, token]);

    // Attendance Filter Effect
    useEffect(() => {
        const fetchFilteredAttendances = async () => {
            setIsLoading(true);
            try {
                const { selectedEmployee, startDate, endDate } = attendanceFilters;
                let response;

                if (selectedEmployee && startDate && endDate) {
                    const formattedStart = format(startDate, "yyyy-MM-dd");
                    const formattedEnd = format(endOfDay(endDate), "yyyy-MM-dd");
                    response = await api.getAttendancesFiltered(selectedEmployee, formattedStart, formattedEnd, token);
                } else if (selectedEmployee) {
                    response = await api.getAttendancesFiltered(selectedEmployee, '1900-01-01', '1900-01-01', token);
                } else if (startDate && endDate) {
                    const formattedStart = format(startDate, "yyyy-MM-dd");
                    const formattedEnd = format(endOfDay(endDate), "yyyy-MM-dd");
                    response = await api.getAttendancesFiltered(0, formattedStart, formattedEnd, token);
                } else {
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
    }, [attendanceFilters, token]);

    // Generic Handlers
    const handleFormChange = (formType: 'employee' | 'service' | 'product' | 'attendance', e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [formType]: {
                ...prev[formType],
                [name]: value
            }
        }));
    };

    const openModal = (modalType: keyof typeof modalState, mode: any = null, data: any = null) => {
        setModalState(prev => ({
            ...prev,
            [modalType]: {
                open: true,
                mode: mode || 'add',
                data: data || null
            }
        }));

        // Initialize form if opening for edit
        if (data && modalType !== 'delete') {
            setFormState(prev => ({
                ...prev,
                [modalType]: { ...data }
            }));
        }
    };

    const closeModal = (modalType: keyof typeof modalState) => {
        setModalState(prev => ({
            ...prev,
            [modalType]: {
                open: false,
                mode: 'add',
                data: null
            }
        }));

        // Reset form state
        if (modalType !== 'delete') {
            setFormState(prev => ({
                ...prev,
                [modalType]: modalType === 'employee'
                    ? INITIAL_EMPLOYEE_STATE
                    : modalType === 'service'
                        ? INITIAL_SERVICE_STATE
                        : INITIAL_PRODUCT_STATE
            }));
        }
    };

    // Entity Handlers
    const handleEntityAction = async (
        actionType: 'create' | 'update' | 'delete',
        entityType: 'employee' | 'service' | 'product',
        data: any,
        fetchFunction: () => Promise<any>
    ) => {
        setIsLoading(true);
        try {
            const apiMethods = {
                employee: {
                    create: api.addEmployees,
                    update: api.updateEmployee,
                    delete: api.deleteEmployee
                },
                service: {
                    create: api.createService,
                    update: api.updateService,
                    delete: api.deleteService
                },
                product: {
                    create: api.createProduct,
                    update: api.updateProduct,
                    delete: api.deleteProduct
                }
            } as const;

            const method = apiMethods[entityType][actionType];

            if (actionType === 'delete') {
                await method(data.id, token);
            } else {
                await method(data, token);
            }

            const updatedData = await fetchFunction();
            switch (entityType) {
                case 'employee': setEmployees(updatedData); break;
                case 'service': setServices(updatedData); break;
                case 'product': setProducts(updatedData); break;
            }

            closeModal(entityType);
            if (actionType === 'delete') closeModal('delete');
        } catch (error) {
            console.error(`Failed to ${actionType} ${entityType}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    // Employee Handlers
    const handleEmployeeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { mode, data } = modalState.employee;
        const action = mode === 'add' ? 'create' : 'update';
        handleEntityAction(
            action,
            'employee',
            formState.employee,
            () => api.getAllEmployees(token)
        );
    };

    // Service Handlers
    const handleServiceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { mode, data } = modalState.service;
        const action = mode === 'add' ? 'create' : 'update';
        handleEntityAction(
            action,
            'service',
            formState.service,
            () => api.getAllServices(token)
        );
    };

    // Product Handlers
    const handleProductSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { mode, data } = modalState.product;
        const action = mode === 'add' ? 'create' : 'update';
        handleEntityAction(
            action,
            'product',
            formState.product,
            () => api.getAllProducts(token)
        );
    };

    // Attendance Handlers
    const handleAttendanceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { attendanceDate, attendanceStatus, checkInTime, checkOutTime, selectedEmployee } = formState.attendance;

            const attendanceData = {
                employee: { employeeId: selectedEmployee },
                date: format(attendanceDate, 'yyyy-MM-dd'),
                attendanceStatus,
                arrival: attendanceStatus === 'PRESENT' && checkInTime
                    ? `${format(attendanceDate, 'yyyy-MM-dd')}T${checkInTime}:00`
                    : null,
                departure: attendanceStatus === 'PRESENT' && checkOutTime
                    ? `${format(attendanceDate, 'yyyy-MM-dd')}T${checkOutTime}:00`
                    : null
            };

            await api.markAttendance(attendanceData, token);
            const updatedAttendances = await api.getAttendances(token);
            setAttendances(updatedAttendances);

            setFormState(prev => ({
                ...prev,
                attendance: INITIAL_ATTENDANCE_FORM
            }));
            closeModal('attendance');
        } catch (error) {
            console.error("Failed to mark attendance:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePosTransaction = async (data: any) => {
        setPosLoading(true);
        try {
            const payload = {
                customer: data.customer,
                employee: { employeeId: data.employeeId },
                services: data.cart.filter((i: any) => i.type === "service").map((i: any) => ({ serviceId: i.id, price: i.price, quantity: i.quantity })),
                products: data.cart.filter((i: any) => i.type === "product").map((i: any) => ({
                    productId: i.id,
                    quantity: i.quantity,
                    price: i.price
                })),
                paymentMethod: data.paymentMethod,
                totalAmount: data.totalAmount,
                transactionTime: new Date().toISOString(),
            };
            console.log("Creating POS transaction with data:", data);
            console.log("Creating POS transaction with payload:", payload);
            await api.createPosTransaction(payload, token);
        } catch (err) {
            console.error(err);
        } finally {
            setPosLoading(false);
        }
    };

    // Delete Handler
    const handleDeleteConfirm = async () => {
        const { type, data } = modalState.delete;
        if (!data) return;

        setIsLoading(true);
        try {
            switch (type) {
                case 'employee':
                    await api.deleteEmployee(data.employeeId, token);
                    setEmployees(prev => prev.filter(e => e.employeeId !== data.employeeId));
                    break;
                case 'service':
                    await api.deleteService(data.serviceId, token);
                    setServices(prev => prev.filter(s => s.serviceId !== data.serviceId));
                    break;
                case 'product':
                    await api.deleteProduct(data.productId, token);
                    setProducts(prev => prev.filter(p => p.productId !== data.productId));
                    break;
            }
            closeModal('delete');
        } catch (error) {
            console.error(`Failed to delete ${type}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter Handlers
    const resetAttendanceFilters = () => {
        setAttendanceFilters({
            selectedEmployee: '',
            startDate: null,
            endDate: null
        });
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex flex-col flex-1 overflow-hidden mt-20">
                <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {isLoading ? (
                            <div className="w-full flex justify-center mt-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'overview' && <OverviewTab summaryData={summaryData} />}
                                {activeTab === 'appointments' && (
                                    <AppointmentsTab
                                        appointments={appointments}
                                        startDate={dateRange[0]}
                                        endDate={dateRange[1]}
                                        setDateRange={setDateRange}
                                    />
                                )}
                                {activeTab === 'services' && (
                                    <ServicesTab
                                        services={services}
                                        setShowNewServiceForm={() => openModal('service')}
                                        handleEditService={(service) => openModal('service', 'edit', service)}
                                        handleDeleteService={(service) => openModal('delete', null, { type: 'service', data: service })}
                                    />
                                )}
                                {activeTab === 'customers' && <CustomersTab customers={customers} />}
                                {activeTab === 'employees' && (
                                    <EmployeesTab
                                        employees={employees}
                                        setShowEmployeeForm={() => openModal('employee')}
                                        handleViewEmployee={(employee) => openModal('employee', 'view', employee)}
                                        handleEditEmployee={(employee) => openModal('employee', 'edit', employee)}
                                        handleDeleteEmployee={(employee) => openModal('delete', null, { type: 'employee', data: employee })}
                                    />
                                )}
                                {activeTab === 'attendance' && (
                                    <AttendanceTab
                                        attendances={attendances}
                                        employees={employees}
                                        attendanceFilters={attendanceFilters}
                                        setAttendanceFilters={setAttendanceFilters}
                                        resetAttendanceFilters={resetAttendanceFilters}
                                        setShowAttendanceForm={() => openModal('attendance')}
                                    />
                                )}
                                {activeTab === 'salary-report' && (
                                    <SalaryReportTab
                                        employees={employees}
                                        onGenerateReport={async (month) => {
                                            const response = await api.generateSalaryReport(
                                                format(month, 'yyyy-MM'),
                                                token
                                            );
                                            return response;
                                        }}
                                    />
                                )}
                                {activeTab === 'products' && (
                                    <ProductsTab
                                        products={products}
                                        setShowNewProductForm={() => openModal('product')}
                                        handleEditProduct={(product) => openModal('product', 'edit', product)}
                                        handleDeleteProduct={(product) => openModal('delete', null, { type: 'product', data: product })}
                                    />
                                )}
                                {activeTab === 'pos' && (
                                    <PosForm
                                        services={services}
                                        products={products}
                                        employees={employees}
                                        onSubmit={handleCreatePosTransaction}
                                        isLoading={posLoading}
                                    />
                                )}

                            </>
                        )}
                    </div>

                    {/* Modals */}
                    <EmployeeFormModal
                        isOpen={modalState.employee.open}
                        onClose={() => closeModal('employee')}
                        employee={formState.employee}
                        onChange={(e) => handleFormChange('employee', e)}
                        onSubmit={handleEmployeeSubmit}
                        isLoading={isLoading}
                        isEditing={modalState.employee.mode === 'edit'}
                    />

                    <ServiceFormModal
                        isOpen={modalState.service.open}
                        onClose={() => closeModal('service')}
                        service={formState.service}
                        onChange={(e) => handleFormChange('service', e)}
                        onSubmit={handleServiceSubmit}
                        isLoading={isLoading}
                        isEditing={modalState.service.mode === 'edit'}
                    />

                    <ProductFormModal
                        isOpen={modalState.product.open}
                        onClose={() => closeModal('product')}
                        product={formState.product}
                        onChange={(e) => handleFormChange('product', e)}
                        onSubmit={handleProductSubmit}
                        isLoading={isLoading}
                        isEditing={modalState.product.mode === 'edit'}
                    />

                    <AttendanceModal
                        show={modalState.attendance.open}
                        onClose={() => closeModal('attendance')}
                        onSubmit={handleAttendanceSubmit}
                        employees={employees}
                        formData={formState.attendance}
                        onFormChange={(field, value) =>
                            setFormState(prev => ({
                                ...prev,
                                attendance: { ...prev.attendance, [field]: value }
                            }))
                        }
                    />

                    <EmployeeViewModal
                        isOpen={modalState.employee.mode === 'view' && modalState.employee.open}
                        onClose={() => closeModal('employee')}
                        employee={modalState.employee.data}
                    />

                    <DeleteConfirmationModal
                        isOpen={modalState.delete.open}
                        onClose={() => closeModal('delete')}
                        onConfirm={handleDeleteConfirm}
                        title={`Delete ${modalState.delete.type?.charAt(0).toUpperCase() + modalState.delete.type?.slice(1)}`}
                        message={`Are you sure you want to delete ${modalState.delete.data?.name}? This action cannot be undone.`}
                        isLoading={isLoading}
                    />
                </main>
            </div>
        </div>
    );
}
