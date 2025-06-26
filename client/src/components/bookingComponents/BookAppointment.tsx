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
  role: string;
}

interface BookingSummary {
  service: string;
  stylist: string;
  date: string;
  time: string;
  price: string;
}

export default function BookAppointment() {
  const state = useSelector((state: any) => state);
  const { user, token } = state.auth || {};
  const router = useRouter();

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingStatus, setBookingStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [openSections, setOpenSections] = useState({
    service: true,
    stylist: false,
    datetime: false
  });

  const toggleSection = (section: 'service' | 'stylist' | 'datetime') => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

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
        router.push(url.url);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Book Your Appointment
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose your preferred service, stylist, and time slot for the perfect salon experience
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
                <h2 className="text-2xl font-semibold text-white">Select Your Preferences</h2>
              </div>

              <div className="p-8">
                <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('service')}
                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">1</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Select Service</h3>
                      {selectedService && (
                        <span className="text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded-full">
                          ✓ {selectedService.name}
                        </span>
                      )}
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${openSections.service ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {openSections.service && (
                    <div className="p-6 space-y-6 bg-white dark:bg-gray-900">
                      <div>
                        <label htmlFor="service-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Service Category
                        </label>
                        <select
                          id="service-type"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                          onChange={loadServices}
                        >
                          <option value="ALL">Choose a category</option>
                          <option value="HAIRCUTS">✂️ Haircuts</option>
                          <option value="COLORING">🎨 Coloring</option>
                          <option value="TREATMENTS">💆 Treatments</option>
                        </select>
                      </div>

                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        <div className="space-y-3">
                          {services.map((service) => (
                            <div
                              key={service.serviceId}
                              className={`group relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${selectedService?.serviceId === service.serviceId
                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg"
                                : "border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-gray-800"
                                }`}
                              onClick={() => {
                                handleServiceSelect(service);
                                if (!openSections.stylist) {
                                  setOpenSections(prev => ({ ...prev, service: false }));
                                  setOpenSections(prev => ({ ...prev, stylist: true }));
                                }
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                  <input
                                    type="radio"
                                    id={`service-${service.serviceId}`}
                                    name="service"
                                    checked={selectedService?.serviceId === service.serviceId}
                                    onChange={() => handleServiceSelect(service)}
                                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                  />
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                      {service.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      ⏱️ {service.duration_minutes} minutes
                                    </p>
                                    {service.description && (
                                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                                        {service.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    LKR{service.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stylist Selection Section */}
                <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('stylist')}
                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">2</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Select Stylist</h3>
                      {selectedStylist && (
                        <span className="text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded-full">
                          ✓ {stylists.find(s => s.employeeId.toString() === selectedStylist)?.name}
                        </span>
                      )}
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${openSections.stylist ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {openSections.stylist && (
                    <div className="p-6 bg-white dark:bg-gray-900">
                      <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        <div className="space-y-3">
                          {stylists.map((stylist) => (
                            <div
                              key={stylist.employeeId}
                              className={`group relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${selectedStylist === `${stylist.employeeId}`
                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg"
                                : "border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-gray-800"
                                }`}
                              onClick={() => {
                                setSelectedStylist(`${stylist.employeeId}`);
                                if (!openSections.datetime) {
                                  setOpenSections(prev => ({ ...prev, stylist: false }));
                                  setOpenSections(prev => ({ ...prev, datetime: true }));
                                }
                              }}
                            >
                              <div className="flex items-center space-x-4">
                                <input
                                  type="radio"
                                  id={`${stylist.employeeId}`}
                                  name="stylist"
                                  checked={selectedStylist === `${stylist.employeeId}`}
                                  onChange={handleStylistSelect}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                      {stylist.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                      {stylist.name}
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {stylist.role}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('datetime')}
                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">3</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Date & Time</h3>
                      {selectedDate && selectedTime && (
                        <span className="text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded-full">
                          ✓ {selectedDate} at {selectedTime}
                        </span>
                      )}
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${openSections.datetime ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {openSections.datetime && (
                    <div className="p-6 space-y-6 bg-white dark:bg-gray-900">
                      <div>
                        <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          📅 Select Date
                        </label>
                        <input
                          type="date"
                          id="appointment-date"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 transition-all duration-200 shadow-sm"
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
                          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              Please select both a service and stylist first
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-600">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                          🕒 Available Time Slots
                        </label>
                        {slots.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {slots.map((time, index) => (
                              <button
                                key={index}
                                type="button"
                                className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 hover:shadow-md ${selectedTime === time
                                  ? "border-indigo-500 bg-indigo-500 text-white shadow-lg transform scale-105"
                                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                  }`}
                                onClick={() => {
                                  handleTimeSelect(time);
                                  setOpenSections(prev => ({ ...prev, datetime: false }));
                                }}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Select a date to view available time slots
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-4">
                <h3 className="text-lg font-semibold text-white">Special Requests</h3>
              </div>
              <div className="p-8">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  💬 Additional Notes or Requests
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200 shadow-sm"
                  placeholder="Any specific concerns, hair type details, or requests for your stylist..."
                />
              </div>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 sticky top-8 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Booking Summary
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-8">
                  {[
                    { label: "Service", value: bookingSummary.service, icon: "✂️" },
                    { label: "Stylist", value: bookingSummary.stylist, icon: "👨‍💼" },
                    { label: "Date", value: bookingSummary.date, icon: "📅" },
                    { label: "Time", value: bookingSummary.time, icon: "🕒" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-300 flex items-center">
                        <span className="mr-2">{item.icon}</span>
                        {item.label}:
                      </span>
                      <span className={`font-medium text-right max-w-32 truncate ${item.value === "Not selected"
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-gray-900 dark:text-white"
                        }`}>
                        {item.value}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between py-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg px-4 mt-4">
                    <span className="text-gray-900 dark:text-white font-semibold flex items-center">
                      <span className="mr-2">💰</span>
                      Total Price:
                    </span>
                    <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                      {bookingSummary.price}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start">
                    <input
                      id="policy-agreement"
                      name="policy-agreement"
                      type="checkbox"
                      className="h-4 w-4 mt-1 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="policy-agreement" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                      I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium underline">cancellation policy</a>. I understand that I need to provide at least 24 hours notice to cancel or reschedule.
                    </label>
                  </div>
                </div>

                {bookingStatus.type && (
                  <div className={`mb-6 p-4 rounded-xl border-2 ${bookingStatus.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                    }`}>
                    <div className="flex items-start">
                      {bookingStatus.type === 'success' ? (
                        <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <p className="text-sm font-medium">{bookingStatus.message}</p>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
                  disabled={!selectedService || !selectedStylist || !selectedDate || !selectedTime || isSubmitting}
                  onClick={handleConfirmBooking}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Booking...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Confirm Booking
                    </span>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    🔒 Secure payment processing via Stripe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}