"use client"

import Navbar from '@/components/dashboardComponents/dashboardNavbar';
import DeleteConfirmationModal from '@/components/dashboardComponents/deleteConfirmationModal';
import EmployeeFormModal from '@/components/dashboardComponents/employeeFormModal';
import EmployeeViewModal from '@/components/dashboardComponents/employeeViewModal';
import AttendanceModal from '@/components/dashboardComponents/markAttendanceModal';
import ServiceFormModal from '@/components/dashboardComponents/serviceFormModal';
import AppointmentsTab from '@/components/dashboardTabs/AppointmentsTab';
import AttendanceTab from '@/components/dashboardTabs/AttendanceTab';
import CustomersTab from '@/components/dashboardTabs/CustomersTab';
import EmployeesTab from '@/components/dashboardTabs/EmployeesTab';
import OverviewTab from '@/components/dashboardTabs/OverviewTab';
import ServicesTab from '@/components/dashboardTabs/ServicesTab';
import { endOfDay, format } from 'date-fns';
import { act, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import { api } from '../../utils/apicall';
import SalaryReportTab from '@/components/dashboardTabs/SalaryReportTab';
import ProductsTab from '@/components/dashboardTabs/ProductTab';
import ProductFormModal from '@/components/dashboardComponents/ProductFormModal';

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

interface Product {
    productId: string;
    productType: string;
    name: string;
    description: string;
    brand: string;
    price: number;
    stockQuantity: number;
    active: boolean;
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
    const [showProductDeleteConfirm, setShowProductDeleteConfirm] = useState(false);
    const [showAttendanceForm, setShowAttendanceForm] = useState(false);
    const [services, setServices] = useState([]);
    const [showNewServiceForm, setShowNewServiceForm] = useState(false);
    const [showEditServiceForm, setShowEditServiceForm] = useState(false);
    const [showEditProductForm, setShowEditProductForm] = useState(false);
    const [editServiceData, setEditServiceData] = useState<any>(null);
    const [newEmployee, setNewEmployee] = useState({
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
    });
    const [currentService, setCurrentService] = useState({
        serviceId: 0,
        serviceType: '',
        name: '',
        description: '',
        price: 0
    });
    const [currentProduct, setCurrentProduct] = useState({
        productId: 0,
        productType: '',
        name: '',
        description: '',
        brand: '',
        price: 0,
        stockQuantity: 0,
        active: true
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
    const [products, setProducts] = useState<Product[]>([]);
    const [showNewProductForm, setShowNewProductForm] = useState(false);
    const [editProductData, setEditProductData] = useState<any>(null);
    const [deleteProductData, setDeleteProductData] = useState<Product | null>(null);



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
                const productsData = await api.getAllProducts(token);

                setAttendances(attendanceData);
                console.log(attendanceData)
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

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({
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

    const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await api.createProduct(currentProduct, token);
            setCurrentProduct({
                productId: 0,
                productType: '',
                name: '',
                description: '',
                brand: '',
                price: 0,
                stockQuantity: 0,
                active: true
            });
            setShowNewProductForm(false);
            const productsData = await api.getAllProducts(token);
            setProducts(productsData);
        } catch (error) {
            console.error("Failed to add Product:", error);
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
                role: '',
                baseSalary: '',
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

    const handleDeleteProduct = (product: Product) => {
        setDeleteProductData(product);
        setShowProductDeleteConfirm(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditProductData(product);
        setShowEditProductForm(true);
    };

    const handleProductDeleteConfirm = async () => {
        if (!deleteProductData) return;
        try {
            setIsLoading(true);
            await api.deleteProduct(deleteProductData.productId, token);
            setShowProductDeleteConfirm(false);
            setDeleteProductData(null);
            const productsData = await api.getAllProducts(token);
            setProducts(productsData);
        } catch (error) {
            console.error("Failed to delete Product:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await api.updateProduct(editProductData.productId, editProductData, token);
            setShowEditProductForm(false);
            setEditProductData(null);
            const productsData = await api.getAllProducts(token);
            setProducts(productsData);
        } catch (error) {
            console.error("Failed to update Product:", error);
        } finally {
            setIsLoading(false);
        }
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

                                {activeTab === 'overview' && (
                                    <OverviewTab summaryData={summaryData} />
                                )}
                                {activeTab === 'appointments' && (
                                    <AppointmentsTab
                                        appointments={appointments}
                                        startDate={startDate}
                                        endDate={endDate}
                                        setDateRange={setDateRange}
                                    />
                                )}
                                {activeTab === 'services' && (
                                    <ServicesTab
                                        services={services}
                                        setShowNewServiceForm={setShowNewServiceForm}
                                        handleEditService={handleEditService}
                                        handleDeleteService={handleDeleteService}
                                    />
                                )}
                                {activeTab === 'customers' && (
                                    <CustomersTab customers={customers} />
                                )}
                                {activeTab === 'employees' && (
                                    <EmployeesTab
                                        employees={employees}
                                        setShowEmployeeForm={setShowEmployeeForm}
                                        handleViewEmployee={handleViewEmployee}
                                        handleEditEmployee={handleEditEmployee}
                                        handleDeleteEmployee={handleDeleteEmployee}
                                    />
                                )}
                                {activeTab === 'attendance' && (
                                    <AttendanceTab
                                        attendances={attendances}
                                        employees={employees}
                                        attendanceFilters={attendanceFilters}
                                        setAttendanceFilters={setAttendanceFilters}
                                        resetAttendanceFilters={resetAttendanceFilters}
                                        setShowAttendanceForm={setShowAttendanceForm}
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
                                        setShowNewProductForm={setShowNewProductForm}
                                        handleEditProduct={handleEditProduct}
                                        handleDeleteProduct={handleDeleteProduct}
                                    />
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

                    <DeleteConfirmationModal
                        isOpen={showProductDeleteConfirm}
                        onClose={() => setShowProductDeleteConfirm(false)}
                        onConfirm={handleProductDeleteConfirm}
                        title="Delete Product"
                        message={`Are you sure you want to delete ${deleteProductData?.name}? This action cannot be undone.`}
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

                    <ProductFormModal
                        isOpen={showNewProductForm}
                        onClose={() => setShowNewProductForm(false)}
                        product={currentProduct}
                        onChange={handleProductChange}
                        onSubmit={handleProductSubmit}
                        isLoading={isLoading}
                    />

                    <ProductFormModal
                        isOpen={showEditProductForm}
                        onClose={() => setShowEditProductForm(false)}
                        product={editProductData || {}}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            setEditProductData((prev: any) => ({
                                ...prev,
                                [name]: value
                            }));
                        }}
                        onSubmit={handleProductEditSubmit}
                        isLoading={isLoading}
                        isEditing={true}
                    />
                </main>
            </div >
        </div >
    );
}