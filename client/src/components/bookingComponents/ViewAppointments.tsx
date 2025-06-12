"use client"

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { api } from '../../utils/apicall';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Appointment {
  appointmentId: number;
  service: {
    name: string;
    price: number;
  };
  employee: {
    employeeId: number,
    name: string;
  };
  timeSlot: string;
  status: string;
  notes?: string;
  tipAmount?: number;
}

export default function ViewAppointments() {
  const state = useSelector((state: any) => state);
  const { user, token } = state.auth || {};
  const router = useRouter();

  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showRescheduleCard, setShowRescheduleCard] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDateTime, setNewDateTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      fetchUserAppointments();
    }
  }, [token]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setNewDateTime(date + 'T00:00');
    loadAvailableTimeSlots(date);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {

    const startTime = timeSlot.split(' - ')[0];
    const [time, modifier] = startTime.split(' ');
    let [hours, minutes] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
      hours = String(parseInt(hours, 10) + 12);
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    const datePart = newDateTime.split('T')[0];

    setNewDateTime(`${datePart}T${hours.padStart(2, '0')}:${minutes}`);
  };

  const pad = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

  const formatHour = (hour: number): string => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${pad(hour12)}:00 ${suffix}`;
  };

  const loadAvailableTimeSlots = async (date: string) => {
    if (!selectedAppointment || !date) return;

    setIsLoadingSlots(true);

    try {
      const startHour = 9;
      const endHour = 19;
      const excludedSlots = new Set(["13", "16"]);
      const bookedSlots = new Set<number>();
      const timeSlots: string[] = [];

      const response = await api.getTimeSlots(
        token,
        selectedAppointment.employee.employeeId.toString(),
        date
      );

      response.forEach((appointment: any) => {
        const hour = new Date(appointment.timeSlot).getHours();
        bookedSlots.add(hour);
      });

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

      setAvailableSlots(timeSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const formatTimeFromDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${pad(hour12)}:00 ${suffix}`;
  };

  const fetchUserAppointments = async () => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      const response = await api.getUserAppointments(token, user.userId);
      setUserAppointments(response || []);
    } catch (error) {
      console.error('Error fetching user appointments:', error);
    } finally {
      setIsLoading(false);
    }
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'tipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const openRescheduleCard = (appointment: Appointment) => {
    setSelectedAppointment(appointment);

    const currentDateTime = new Date(appointment.timeSlot);
    const localDateTimeString = new Date(
      currentDateTime.getTime() - currentDateTime.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 16);
    setNewDateTime(localDateTimeString);
    setShowRescheduleCard(true);
  };

  const closeRescheduleCard = () => {
    setShowRescheduleCard(false);
    setSelectedAppointment(null);
    setNewDateTime('');
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment || !newDateTime || newDateTime.endsWith('T00:00')) return;

    try {

      const updatedAppointment = {
        ...selectedAppointment,
        timeSlot: newDateTime
      };

      const response = await api.rescheduleAppointment(
        updatedAppointment,
        token,
        selectedAppointment.appointmentId
      );
      if (response.status == "UPCOMING") {
        closeRescheduleCard();
        fetchUserAppointments();
      } else {
        console.log("Failed to reschedule appointment: " + response.message);
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      console.log("An error occurred while rescheduling your appointment");
    }
  };

  const handleCancel = async (appointment: Appointment) => {
    console.log(appointment)
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const response = await api.cancelAppointment('CANCELLED', token, appointment.appointmentId);

        if (response.success) {
          fetchUserAppointments();
        } else {
          console.log("Failed to cancel appointment: " + response.message);
        }
      } catch (error) {
        console.error("Error cancelling appointment:", error);
        console.log("An error occurred while cancelling your appointment");
      }
    }
  };

  const handleTip = async (appointment: Appointment) => {
    if (!appointment.tipAmount || appointment.tipAmount <= 0) {
      alert("Please enter a valid tip amount");
      return;
    }

    try {
      const url = await api.getStripeURL(token, appointment.appointmentId, "Tip", appointment.tipAmount);
      router.push(url.url);
    } catch (error) {
      console.error("Error processing tip:", error);
      console.log("An error occurred while processing your tip");
    }
  };

  const renderAppointmentActions = (appointment: Appointment) => {
    switch (appointment.status.toLowerCase()) {
      case 'upcoming':
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openRescheduleCard(appointment)}
              className="px-3 py-1 text-xs font-medium rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
            >
              Reschedule
            </button>
            <button
              onClick={() => handleCancel(appointment)}
              className="px-3 py-1 text-xs font-medium rounded-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              placeholder="Amount"
              className="w-20 px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-700"
              onChange={(e) => {
                const updatedAppointments = [...userAppointments];
                const index = updatedAppointments.findIndex(a => a.appointmentId === appointment.appointmentId);
                if (index !== -1) {
                  updatedAppointments[index].tipAmount = parseInt(e.target.value);
                  setUserAppointments(updatedAppointments);
                }
              }}
            />
            <button
              className="px-3 py-1 text-xs font-medium rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
              onClick={() => handleTip(appointment)}
            >
              Tip
            </button>
          </div>
        );
      case 'cancelled':
      case 'tipped':
      default:
        return <span className="text-xs text-gray-500">No actions available</span>;
    }
  };

  return (
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
                    Status
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderAppointmentActions(appointment)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showRescheduleCard && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reschedule Appointment
              </h3>
              <button
                onClick={closeRescheduleCard}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Current appointment: <span className="font-medium">{formatDateTime(selectedAppointment.timeSlot)}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Service: <span className="font-medium">{selectedAppointment.service.name}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stylist: <span className="font-medium">{selectedAppointment.employee.name}</span>
              </p>
            </div>

            <form onSubmit={handleRescheduleSubmit}>
              <div className="mb-4">
                <label htmlFor="newDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select New Date
                </label>
                <input
                  type="date"
                  id="newDate"
                  value={newDateTime.split('T')[0]}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {isLoadingSlots ? (
                <div className="flex justify-center items-center py-4">
                  <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {availableSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`px-3 py-2 text-sm font-medium rounded-md border cursor-pointer text-center ${format(new Date(newDateTime), "hh:mm a").toUpperCase() === slot.split(' -')[0]
                          ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200"
                          : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        onClick={() => handleTimeSlotSelect(slot)}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
              ) : newDateTime.split('T')[0] ? (
                <div className="mb-4 text-center py-4 text-sm text-amber-600 dark:text-amber-400">
                  No available time slots for this date. Please select another date.
                </div>
              ) : null}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeRescheduleCard}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newDateTime || !newDateTime.includes('T') || newDateTime.endsWith('T00:00')}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

