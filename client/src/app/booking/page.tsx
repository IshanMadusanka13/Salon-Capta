"use client"

import { useState } from 'react';
import BookAppointment from '../../components/bookingComponents/BookAppointment';
import ViewAppointments from '../../components/bookingComponents/ViewAppointments';

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<'book' | 'view'>('book');

  return (
    <section className="py-10 bg-gray-50 dark:bg-gray-800 transition-colors duration-300" id="Booking">
      <div className="container mx-auto px-4 mt-15">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Salon Appointments
          </h2>
          <div className="w-16 h-1 bg-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Book and manage your salon appointments
          </p>
        </div>

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

        {activeTab === 'book' ? <BookAppointment /> : <ViewAppointments />}
      </div>
    </section>
  );
}
