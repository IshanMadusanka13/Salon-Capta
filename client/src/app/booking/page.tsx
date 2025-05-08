"use client"

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { api } from '../../utils/apicall';
import React, { useState, useEffect } from 'react';

interface Service {
    serviceId: number;
    name: string;
    price: number;
    duration_minutes: number;
    description: string;
    service_type: string;
}

interface Stylist {
    employeeId: number;
    name: string;
}

interface BookingSummary {
    service: string;
    stylist: string;
    date: string;
    time: string;
    price: string;
}

interface Appointment {
    appointmentId: number;
    service: {
        name: string;
        price: number;
    };
    employee: {
        name: string;
    };
    timeSlot: string;
    status: string;
    notes?: string;
}

export default function BookingAppointment() {
    const state = useSelector((state: any) => state);
    const { user, token } = state.auth || {};
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'book' | 'view'>('book');
    const [services, setServices] = useState<Service[]>([]);
    const [stylists, setStylists] = useState<Stylist[]>([]);
    const [selectedStylist, setSelectedStylist] = useState<string>();
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [slots, setSlots] = useState<string[]>([]);
    const [isDateSelectable, setIsDateSelectable] = useState<boolean>(false);
    const [bookingSummary, setBookingSummary] = useState<BookingSummary>({
        service: "Not selected",
        stylist: "Not selected",
        date: "Not selected",
        time: "Not selected",
        price: "-"
    });
    const [tipAmounts, setTipAmounts] = useState<{ [key: number]: number }>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [bookingStatus, setBookingStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });
    const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!token) {
            router.push("/");
        } else if (activeTab === 'view') {
            fetchUserAppointments();
        }
    }, [token, router, activeTab]);

    useEffect(() => {
        setIsDateSelectable(!!selectedStylist && !!selectedService);
    }, [selectedStylist, selectedService]);

    useEffect(() => {
        setBookingSummary({
            service: selectedService?.name || "Not selected",
            stylist: stylists.find(s => s.employeeId.toString() === selectedStylist)?.name || "Not selected",
            date: selectedDate || "Not selected",
            time: selectedTime || "Not selected",
            price: selectedService ? `LKR${selectedService.price}` : "-"
        });
    }, [selectedService, selectedStylist, selectedDate, selectedTime, stylists]);

    const fetchUserAppointments = async () => {
        if (!user || !token) return;

        setIsLoading(true);
        try {
            // Assuming there's an API endpoint to get user appointments
            const response = await api.getUserAppointments(token, user.userId);
            setUserAppointments(response || []);
        } catch (error) {
            console.error('Error fetching user appointments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStylistSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const stylist = event.target.id;
        setSelectedStylist(stylist);
    };

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
    };

    const isSunday = (dateString: string): boolean => {
        const date = new Date(dateString);
        return date.getDay() === 0;
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    const loadServices = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedServiceType = event.target.value;

        if (!selectedServiceType) {
            setServices([]);
            return;
        }

        try {
            const response = await api.getServiceByType(selectedServiceType, token);
            if (!response) {
                throw new Error(`HTTP error!`);
            }

            setServices(response as Service[]);
            loadStylists();
        } catch (err) {
            console.error('Error fetching services:', err);
        }
    };

    const loadStylists = async () => {
        try {
            const response = await api.getAllEmployees(token);
            if (!response) {
                throw new Error(`HTTP error!`);
            }

            setStylists(response as Stylist[]);
        } catch (err) {
            console.error('Error fetching stylists:', err);
        }
    };

    const loadTimeSlots = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = event.target.value;
        setSelectedDate(date);

        const startHour = 9;
        const endHour = 19;
        const excludedSlots = new Set(["13", "16"]);
        const bookedSlots = new Set<number>();
        const timeSlots: string[] = [];

        try {
            if (selectedStylist) {
                const response = await api.getTimeSlots(token, selectedStylist, date);

                response.forEach((appointment: any) => {
                    const hour = new Date(appointment.timeSlot).getHours();
                    bookedSlots.add(hour);
                });
            }

            const isToday = new Date().toISOString().split("T")[0] === date;
            const currentHour = new Date().getHours();

            for (let hour = startHour; hour < endHour; hour++) {
                if (excludedSlots.has(hour.toString())) continue;
                if (bookedSlots.has(hour)) continue;
                if (isToday && hour <= currentHour) continue;

                const from = formatHour(hour);
                const to = formatHour(hour + 1);
                timeSlots.push(`${from} - ${to}`);
            }
        } catch (error) {
            console.error('Error fetching time slots:', error);
        }

        setSlots(timeSlots);
    };

    const formatHour = (hour: number): string => {
        const suffix = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        return `${pad(hour12)}:00 ${suffix}`;
    };

    const pad = (n: number): string => (n < 10 ? `0${n}` : `${n}`);


    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        setBookingStatus({ type: null, message: '' });

        try {
            const formattedTime = formatTime();

            const response = await api.createBooking(token, {
                serviceId: selectedService?.serviceId,
                employeeId: selectedStylist,
                timeSlot: formattedTime,
                userId: user.userId,
                notes: notes
            });

            if (response.appointment) {
                setBookingStatus({
                    type: 'success',
                    message: 'Your appointment has been successfully booked! A confirmation email has been sent to you.'
                });
                const url = await api.getStripeURL(token, response.appointment, selectedService?.name, `${selectedService?.price}`);
                router.push(url.url)
            } else {
                setBookingStatus({
                    type: 'error',
                    message: response.message || 'Unable to book your appointment. Please try again.'
                });
            }
        } catch (error) {
            console.error('Booking error:', error);
            setBookingStatus({
                type: 'error',
                message: 'An unexpected error occurred. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTip = async (appointmentId: number) => {
        const tipAmount = tipAmounts[appointmentId];

        if (!tipAmount || tipAmount <= 0) {
            alert("Please enter a valid tip amount");
            return;
        }
        try {

            // Call your backend API to process the tip
            const url = await api.getStripeURL(token, appointmentId, "Tip", tipAmount);
            router.push(url.url)

        } catch (error) {
            console.error("Error processing tip:", error);
            alert("An error occurred while processing your tip");
        }
    };

    const formatTime = () => {
        const startTime12hr = selectedTime.split(' - ')[0];
        const [time, modifier] = startTime12hr.split(' ');
        let [hours, minutes] = time.split(':');
        if (modifier === 'PM' && hours !== '12') {
            hours = String(parseInt(hours, 10) + 12);
        }
        const startTime24hr = `${hours.padStart(2, '0')}:${minutes}:00`;
        return `${selectedDate}T${startTime24hr}`;
    };

    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };

    return (
        <section className="py-10 bg-gray-50 dark:bg-gray-800 transition-colors duration-300" id="Booking">
            <div className="container mx-auto px-4 mt-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Salon Appointments
                    </h2>
                    <div className="w-16 h-1 bg-indigo-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Book and manage your salon appointments
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button
                            type="button"
                            className={`px-6 py-3 text-sm font-medium rounded-l-lg ${activeTab === 'book'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                } border border-gray-200 dark:border-gray-700 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-600`}
                            onClick={() => setActiveTab('book')}
                        >
                            Book Appointment
                        </button>
                        <button
                            type="button"
                            className={`px-6 py-3 text-sm font-medium rounded-r-lg ${activeTab === 'view'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                } border border-gray-200 dark:border-gray-700 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-600`}
                            onClick={() => setActiveTab('view')}
                        >
                            My Appointments
                        </button>
                    </div>
                </div>

                {/* Book Appointment Tab */}
                {activeTab === 'book' && (
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Select Service</h3>
                                        <div className="mb-4">
                                            <label htmlFor="service-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Service Type
                                            </label>
                                            <select
                                                id="service-type"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                onChange={loadServices}
                                            >
                                                <option value="ALL">Select Category</option>
                                                <option value="HAIRCUTS">Haircuts</option>
                                                <option value="COLORING">Coloring</option>
                                                <option value="TREATMENTS">Treatments</option>
                                            </select>
                                        </div>

                                        <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
                                            {services.map((service) => (
                                                <div
                                                    key={service.serviceId}
                                                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${selectedService?.serviceId === service.serviceId
                                                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                                                        : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                                                        }`}
                                                    onClick={() => handleServiceSelect(service)}
                                                >
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id={`service-${service.serviceId}`}
                                                            name="service"
                                                            checked={selectedService?.serviceId === service.serviceId}
                                                            onChange={() => handleServiceSelect(service)}
                                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                        />
                                                        <label htmlFor={`service-${service.serviceId}`} className="ml-3 block">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{service.name}</span>
                                                            <span className="block text-xs text-gray-500 dark:text-gray-400">{service.duration_minutes} min</span>
                                                        </label>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">LKR{service.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Select Stylist</h3>
                                        <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
                                            {stylists.map((stylist) => (
                                                <div
                                                    key={stylist.employeeId}
                                                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedStylist === `${stylist.employeeId}`
                                                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                                                        : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                                                        }`}
                                                    onClick={() => setSelectedStylist(`${stylist.employeeId}`)}
                                                >
                                                    <input
                                                        type="radio"
                                                        id={`${stylist.employeeId}`}
                                                        name="stylist"
                                                        checked={selectedStylist === `${stylist.employeeId}`}
                                                        onChange={handleStylistSelect}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <label htmlFor={`${stylist.employeeId}`} className="ml-3 block">
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stylist.name}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Date & Time</h3>
                                        <div className="mb-4">
                                            <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                id="appointment-date"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500"
                                                onChange={loadTimeSlots}
                                                disabled={!isDateSelectable}
                                                min={new Date().toISOString().split('T')[0]}
                                                onInput={(e) => {
                                                    const input = e.target as HTMLInputElement;
                                                    if (isSunday(input.value)) {
                                                        alert("We're closed on Sundays. Please select another day.");
                                                        input.value = "";
                                                        setSelectedDate("");
                                                    }
                                                }}
                                            />
                                            {!isDateSelectable && (
                                                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                                    Please select both a service and stylist first
                                                </p>
                                            )}
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Available Time Slots
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {slots.map((time, index) => (
                                                    <div
                                                        key={index}
                                                        className={`px-3 py-2 text-sm font-medium rounded-md border cursor-pointer text-center ${selectedTime === time
                                                            ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200"
                                                            : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                                            }`}
                                                        onClick={() => handleTimeSelect(time)}
                                                    >
                                                        {time}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-6">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Special Requests or Notes
                                </label>
                                <textarea
                                    id="notes"
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Any specific concerns or requests for your stylist..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sticky top-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Booking Summary</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-300">Service:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{bookingSummary.service}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-300">Stylist:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{bookingSummary.stylist}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-300">Date:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{bookingSummary.date}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-300">Time:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{bookingSummary.time}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600 dark:text-gray-300">Price:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{bookingSummary.price}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                    <div className="flex items-start">
                                        <input
                                            id="policy-agreement"
                                            name="policy-agreement"
                                            type="checkbox"
                                            className="h-4 w-4 mt-1 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="policy-agreement" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">cancellation policy</a>. I understand that I need to provide at least 24 hours notice to cancel or reschedule.
                                        </label>
                                    </div>
                                </div>
                                {bookingStatus.type && (
                                    <div className={`mb-4 p-4 rounded-lg ${bookingStatus.type === 'success'
                                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                                        : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                                        }`}>
                                        <div className="flex items-start">
                                            {bookingStatus.type === 'success' ? (
                                                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            )}
                                            <p>{bookingStatus.message}</p>
                                        </div>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!selectedService || !selectedStylist || !selectedDate || !selectedTime || isSubmitting}
                                    onClick={handleConfirmBooking}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Appointments Tab */}
                {activeTab === 'view' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Appointments</h3>

                            {isLoading ? (
                                <div className="flex justify-center items-center py-10">
                                    <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : userAppointments.length === 0 ? (
                                <div className="text-center py-10">
                                    <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No appointments found</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You haven't booked any appointments yet.</p>
                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('book')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                            </svg>
                                            Book an Appointment
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Service
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Stylist
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Date & Time
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                            {userAppointments.map((appointment) => (
                                                <tr key={appointment.appointmentId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        #{appointment.appointmentId}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {appointment.service.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {appointment.employee.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDateTime(appointment.timeSlot)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        LKR{appointment.service.price}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {new Date(appointment.timeSlot) > new Date() ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                                Upcoming
                                                            </span>
                                                        ) : (
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    placeholder="Amount"
                                                                    className="w-20 px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-700"
                                                                    onChange={(e) => {
                                                                        const appointmentTips = { ...tipAmounts };
                                                                        appointmentTips[appointment.appointmentId] = parseInt(e.target.value);
                                                                        setTipAmounts(appointmentTips);
                                                                    }}
                                                                />
                                                                <button
                                                                    className="px-3 py-1 text-xs font-medium rounded-md 
                    bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200
                    hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                                                                    onClick={() => handleTip(appointment.appointmentId)}
                                                                >
                                                                    Tip
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>


                                                </tr>
                                            ))}                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}