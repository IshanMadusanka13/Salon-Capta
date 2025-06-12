const API_URL = 'http://localhost:8080/api';

const fetchApi = async (endpoint, token, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return null;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } else {
            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            return { success: true };
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};


export const api = {

    login: (credentials) =>
        fetchApi('/users/login', undefined, {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),

    register: (userData) =>
        fetchApi('/users/register', undefined, {
            method: 'POST',
            body: JSON.stringify(userData)
        }),

    getServiceByType: (type, token) =>
        fetchApi('/services/type/' + type, token, {
            method: 'GET'
        }),

    getAllEmployees: (token) =>
        fetchApi('/employee', token, {
            method: 'GET'
        }),

    addEmployees: (employeeData, token) =>
        fetchApi('/employee', token, {
            method: 'POST',
            body: JSON.stringify(employeeData)
        }),

    updateEmployee: (employeeData, token) =>
        fetchApi('/employee/' + employeeData.employeeId, token, {
            method: 'PUT',
            body: JSON.stringify(employeeData)
        }),

    deleteEmployee: (employeeId, token) =>
        fetchApi('/employee/' + employeeId, token, {
            method: 'DELETE',
        }),

    getTimeSlots: (token, id, date) =>
        fetchApi('/appointments/slots/' + id + "/" + date, token, {
            method: 'GET'
        }),

    createBooking: (token, booking) =>
        fetchApi('/appointments', token, {
            method: 'POST',
            body: JSON.stringify(booking)
        }),

    getStripeURL: (token, appointmentId, service, amount) =>
        fetchApi(`/payments/stripe/${appointmentId}/${service}/${amount}`, token, {
            method: 'GET'
        }),

    getAllCustomers: (token) =>
        fetchApi('/users', token, {
            method: 'GET'
        }),

    getDashboardSummary: (token) =>
        fetchApi('/employee/stats', token, {
            method: 'GET'
        }),

    getAllServices: (token) =>
        fetchApi('/services', token, {
            method: 'GET'
        }),

    createService: (service, token) =>
        fetchApi('/services', token, {
            method: 'POST',
            body: JSON.stringify(service)
        }),

    updateService: (token, id, service) =>
        fetchApi('/services/' + id, token, {
            method: 'PUT',
            body: JSON.stringify(service)
        }),

    deleteService: (serviceId, token) =>
        fetchApi('/services/' + serviceId, token, {
            method: 'DELETE',
        }),

    getAllAppointments: (token) =>
        fetchApi('/appointments', token, {
            method: 'GET'
        }),

    getUserAppointments: (token, userid) =>
        fetchApi('/appointments/user/' + userid, token, {
            method: 'GET'
        }),

    getRecentAppointments: (token) =>
        fetchApi('/appointments/recent', token, {
            method: 'GET'
        }),

    getAppointmentsByRange: (token, start, end) =>
        fetchApi(`/appointments/range/${start}/${end}`, token, {
            method: 'GET'
        }),

    updateAppointments: (status, token, appointmentId) =>
        fetchApi('/' + appointmentId, token, {
            method: 'PUT',
            body: JSON.stringify(status)
        }),

    rescheduleAppointment: (appointment, token, appointmentId) =>
        fetchApi('/appointments/' + appointmentId, token, {
            method: 'PUT',
            body: JSON.stringify(appointment)
        }),

    cancelAppointment: (status, token, appointmentId) =>
        fetchApi('/appointments/status/' + appointmentId, token, {
            method: 'PUT',
            body: JSON.stringify(status)
        }),

    markAttendance: (attendanceData, token) =>
        fetchApi('/attendance', token, {
            method: 'POST',
            body: JSON.stringify(attendanceData)
        }),

    getAttendances: (token) =>
        fetchApi('/attendance', token, {
            method: 'GET',
        }),

    getAttendancesFiltered: (user,startDate, endDate, token) =>
        fetchApi(`/attendance/filter/${user}/${startDate}/${endDate}`, token, {
            method: 'GET',
        }),

};

export default api;
