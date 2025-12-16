import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const PatientDetailsModal = ({ isOpen, onClose, appointment, backendUrl, aToken }) => {
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'history', 'records'

    useEffect(() => {
        if (isOpen && appointment) {
            fetchPatientData();
        }
    }, [isOpen, appointment]);

    const fetchPatientData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${backendUrl}/api/admin/patient-by-appointment/${appointment._id}`,
                { headers: { aToken } }
            );

            if (response.data.success) {
                setPatientData(response.data.data);
            } else {
                toast.error(response.data.message || 'Failed to fetch patient data');
            }
        } catch (error) {
            console.error('Error fetching patient data:', error);
            toast.error('Failed to load patient information');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (slotDate, time) => {
        if (!slotDate || !time) return 'N/A';
        // slotDate is in DD_MM_YYYY format
        const [day, month, year] = slotDate.split('_');
        const dateStr = `${month}/${day}/${year}`;
        return `${dateStr} at ${time}`;
    };

    if (!isOpen) return null;

    const patient = patientData?.patient;
    const appointments = patientData?.appointments || [];
    const healthRecords = patientData?.healthRecords || [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold">Patient Details</h2>
                        <p className="text-xs sm:text-sm opacity-90">Complete medical information</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 sm:p-2 transition-colors"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 flex overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                            activeTab === 'profile'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                            activeTab === 'history'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Visit History ({appointments.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('records')}
                        className={`px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                            activeTab === 'records'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Medical Records ({healthRecords.length})
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <>
                            {/* Profile Tab */}
                            {activeTab === 'profile' && patient && (
                                <div className="space-y-6">
                                    <div className="flex items-start gap-6">
                                        <img
                                            src={patient.image}
                                            alt={patient.name}
                                            className="w-24 h-24 rounded-full border-4 border-indigo-100"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{patient.name}</h3>
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                                    <p className="text-sm font-medium text-gray-900">{patient.email || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                                                    <p className="text-sm font-medium text-gray-900">{patient.phone || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Gender</p>
                                                    <p className="text-sm font-medium text-gray-900">{patient.gender || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Age</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {patient.age || (patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : 'N/A')}
                                                    </p>
                                                </div>
                                                {patient.relationship && patient.relationship !== 'Self' && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Relationship</p>
                                                        <p className="text-sm font-medium text-gray-900">{patient.relationship}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Visit History Tab */}
                            {activeTab === 'history' && (
                                <div className="space-y-4">
                                    {appointments.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500">
                                            <p>No visit history available</p>
                                        </div>
                                    ) : (
                                        appointments.map((apt, index) => (
                                            <div
                                                key={index}
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                {formatDateTime(apt.slotDate, apt.slotTime)}
                                                            </span>
                                                            <span
                                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                                    apt.status === 'Completed'
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : apt.status === 'Cancelled'
                                                                        ? 'bg-red-100 text-red-700'
                                                                        : 'bg-blue-100 text-blue-700'
                                                                }`}
                                                            >
                                                                {apt.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-800 mb-1">
                                                            Dr. {apt.doctor}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mb-2">{apt.doctorSpeciality}</p>
                                                        {apt.symptoms && apt.symptoms.length > 0 && (
                                                            <div className="mt-2">
                                                                <p className="text-xs text-gray-500 mb-1">Symptoms:</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {apt.symptoms.map((symptom, i) => (
                                                                        <span
                                                                            key={i}
                                                                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                                                        >
                                                                            {symptom}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-indigo-600">₹{apt.fees}</p>
                                                        {apt.tokenNumber && (
                                                            <p className="text-xs text-gray-500 mt-1">Token: #{apt.tokenNumber}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Medical Records Tab */}
                            {activeTab === 'records' && (
                                <div className="space-y-4">
                                    {healthRecords.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500">
                                            <p>No medical records available</p>
                                        </div>
                                    ) : (
                                        healthRecords.map((record, index) => (
                                            <div
                                                key={index}
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{record.title}</h4>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatDate(record.date)} • {record.recordType.replace('_', ' ')}
                                                        </p>
                                                    </div>
                                                    {record.isImportant && (
                                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                                                            Important
                                                        </span>
                                                    )}
                                                </div>
                                                {record.description && (
                                                    <p className="text-sm text-gray-700 mb-2">{record.description}</p>
                                                )}
                                                {record.doctorName && (
                                                    <p className="text-xs text-gray-600">By: {record.doctorName}</p>
                                                )}
                                                {record.files && record.files.length > 0 && (
                                                    <div className="mt-3">
                                                        <p className="text-xs text-gray-500 mb-2">Attachments:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {record.files.map((file, i) => (
                                                                <a
                                                                    key={i}
                                                                    href={file.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-indigo-600 hover:underline"
                                                                >
                                                                    {file.fileName}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDetailsModal;

