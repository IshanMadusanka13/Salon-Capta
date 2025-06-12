// markAttendanceModal.tsx
import React from 'react';
import { X, Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';

interface AttendanceFormData {
    selectedEmployee: string;
    attendanceDate: Date;
    attendanceStatus: 'PRESENT' | 'ABSENT' | 'LEAVE';
    checkInTime: string;
    checkOutTime: string;
}

interface AttendanceModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    employees: any[];
    formData: AttendanceFormData;
    onFormChange: (field: keyof AttendanceFormData, value: any) => void;
    isLoading?: boolean;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
    show,
    onClose,
    onSubmit,
    employees,
    formData,
    onFormChange,
    isLoading = false
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative top-10 mx-auto p-6 border-0 w-full max-w-4xl shadow-2xl rounded-2xl bg-white dark:bg-gray-900 m-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Mark Attendance
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Record employee attendance for the selected date
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-8">
                    {/* Employee Selection Section */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-600" />
                            Employee Information
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Employee Selection */}
                            <div className="space-y-2">
                                <label htmlFor="selectedEmployee" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Select Employee *
                                </label>
                                <div className="relative">
                                    <select
                                        name="selectedEmployee"
                                        id="selectedEmployee"
                                        value={formData.selectedEmployee}
                                        onChange={(e) => onFormChange('selectedEmployee', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map((emp: any) => (
                                            <option key={emp.employeeId} value={emp.employeeId}>
                                                {emp.name}
                                            </option>
                                        ))}
                                    </select>
                                    <Users className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="space-y-2">
                                <label htmlFor="attendanceDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Attendance Date *
                                </label>
                                <div className="relative">
                                    <DatePicker
                                        selected={formData.attendanceDate}
                                        onChange={(date: Date | null) => date && onFormChange('attendanceDate', date)}
                                        className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                        required
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="Select date"
                                    />
                                    <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Details Section */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-indigo-600" />
                            Attendance Details
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            {/* Attendance Status */}
                            <div className="space-y-2">
                                <label htmlFor="attendanceStatus" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Attendance Status *
                                </label>
                                <select
                                    name="attendanceStatus"
                                    id="attendanceStatus"
                                    value={formData.attendanceStatus}
                                    onChange={(e) => onFormChange('attendanceStatus', e.target.value as 'PRESENT' | 'ABSENT' | 'LEAVE')}
                                    required
                                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                >
                                    <option value="PRESENT">Present</option>
                                    <option value="ABSENT">Absent</option>
                                    <option value="LEAVE">Leave</option>
                                </select>
                            </div>

                            {/* Check-in Time (only show when PRESENT) */}
                            {formData.attendanceStatus === 'PRESENT' && (
                                <div className="space-y-2">
                                    <label htmlFor="checkInTime" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Check-in Time *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            name="checkInTime"
                                            id="checkInTime"
                                            value={formData.checkInTime}
                                            onChange={(e) => onFormChange('checkInTime', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                        />
                                        <Clock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            )}

                            {/* Check-out Time (only show when PRESENT) */}
                            {formData.attendanceStatus === 'PRESENT' && (
                                <div className="space-y-2">
                                    <label htmlFor="checkOutTime" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Check-out Time *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            name="checkOutTime"
                                            id="checkOutTime"
                                            value={formData.checkOutTime}
                                            onChange={(e) => onFormChange('checkOutTime', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                        />
                                        <Clock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 border-2 border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </span>
                            ) : (
                                'Mark Attendance'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AttendanceModal;