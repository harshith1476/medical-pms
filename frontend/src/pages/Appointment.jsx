import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import BackButton from '../components/BackButton'
import LoadingSpinner, { ButtonSpinner } from '../components/LoadingSpinner'
import UploadReportsModal from '../components/UploadReportsModal'
import SymptomsBySpecialization from '../components/SymptomsBySpecialization'
import BrandLogo from '../components/BrandLogo'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'react-qr-code'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData, userData, isDoctorsLoading } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [showTicket, setShowTicket] = useState(false)
    const [appointmentData, setAppointmentData] = useState(null)
    const [isBooking, setIsBooking] = useState(false)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [selectedSymptoms, setSelectedSymptoms] = useState([])
    // Removed: selectedAgeGroup state (no longer needed)
    const [symptomError, setSymptomError] = useState(false)
    // Removed: All age-related states (no longer needed)
    const [patientData, setPatientData] = useState(null) // Patient data from booking modal

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const preSelectedDate = searchParams.get('date') || null
    const preSelectedTime = searchParams.get('time') || null

    // Get experience badge based on years
    const getExperienceBadge = (experience) => {
        let years = 0
        if (typeof experience === 'string') {
            const match = experience.match(/\d+/)
            years = match ? parseInt(match[0]) : 0
        } else if (typeof experience === 'number') {
            years = experience
        } else {
            years = parseInt(experience) || 0
        }
        
        if (years >= 10) {
            return { 
                emoji: '🥇', 
                label: 'Gold Expert', 
                color: 'text-yellow-600', 
                bg: 'bg-gradient-to-r from-yellow-100 to-amber-50', 
                border: 'border-yellow-400'
            }
        } else if (years >= 5) {
            return { 
                emoji: '🥈', 
                label: 'Senior', 
                color: 'text-gray-600', 
                bg: 'bg-gradient-to-r from-gray-100 to-slate-50', 
                border: 'border-gray-400'
            }
        } else {
            return { 
                emoji: '🥉', 
                label: 'Professional', 
                color: 'text-orange-600', 
                bg: 'bg-gradient-to-r from-orange-100 to-amber-50', 
                border: 'border-orange-400'
            }
        }
    }

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
        
        // Fetch doctor-specific age groups and symptoms
        if (docInfo && docId) {
            await fetchDoctorAgeSymptoms(docId)
        }
    }

    // Fetch doctor-specific age groups and symptoms
    const fetchDoctorAgeSymptoms = async (doctorId) => {
        setIsLoadingAgeSymptoms(true)
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/age-symptoms/${doctorId}`)
            if (data.success) {
                console.log('Doctor age symptoms data:', data) // Debug log
                setDoctorAgeGroups(data.supportedAgeGroups || [])
                setDoctorAgeSymptomsMap(data.ageSymptomsMap || {})
            } else {
                console.warn('No age symptoms data returned for doctor:', doctorId)
                // If doctor doesn't have configured age groups, use empty arrays
                setDoctorAgeGroups([])
                setDoctorAgeSymptomsMap({})
            }
        } catch (error) {
            console.error('Error fetching doctor age symptoms:', error)
            // Fallback to empty arrays if API fails
            setDoctorAgeGroups([])
            setDoctorAgeSymptomsMap({})
        } finally {
            setIsLoadingAgeSymptoms(false)
        }
    }

    const getAvailableSolts = async () => {
        setDocSlots([])
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setDocSlots(prev => ([...prev, timeSlots]))
        }
    }

    const generateAppointmentId = () => {
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 100000)
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const randomLetter = letters[Math.floor(Math.random() * letters.length)]
        return `APT-${randomLetter}${timestamp.toString().slice(-6)}${random.toString().padStart(5, '0')}`
    }

    const generateQRData = (appointmentId, docId, slotDate, slotTime) => {
        return JSON.stringify({
            id: appointmentId,
            doctorId: docId,
            date: slotDate,
            time: slotTime,
            timestamp: Date.now()
        })
    }

    const getDoctorHighlights = (doctor) => {
        if (!doctor) return []
        const spec = (doctor.speciality || '').toLowerCase()
        if (spec.includes('general')) {
            return [
                'Focuses on preventive health checks and early diagnosis of lifestyle diseases.',
                'Helps coordinate care between different specialists when needed.'
            ]
        }
        if (spec.includes('gyne')) {
            return [
                'Provides end‑to‑end care from adolescent health to pregnancy and menopause.',
                'Experienced in counselling patients on fertility, PCOS, and menstrual health.'
            ]
        }
        if (spec.includes('derma')) {
            return [
                'Treats acne, pigmentation, allergies, and long‑term skin conditions.',
                'Combines medical treatment with daily‑routine skin‑care guidance.'
            ]
        }
        if (spec.includes('pediatric')) {
            return [
                'Monitors growth, nutrition, and vaccinations from infancy to adolescence.',
                'Known for a child‑friendly approach that keeps kids relaxed during visits.'
            ]
        }
        if (spec.includes('neuro')) {
            return [
                'Manages migraines, seizure disorders, and nerve‑related conditions.',
                'Works on long‑term neurological rehabilitation and follow‑up plans.'
            ]
        }
        if (spec.includes('gastro')) {
            return [
                'Experienced with acidity, IBS, liver issues, and other digestive problems.',
                'Focuses on diet, lifestyle, and medical therapy for long‑term relief.'
            ]
        }
        return [
            'Provides patient‑centric care with clear explanations at every step.',
            'Believes in building long‑term, trust‑based relationships with patients.'
        ]
    }


    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        if (!slotTime) {
            toast.error('Please select a time slot')
            return
        }

        // Validate doctor selection first
        if (!docInfo || !docId) {
            toast.error('Please select a doctor first')
            return
        }

        // Validate symptoms selection (optional - can be removed if symptoms are not mandatory)
        if (selectedSymptoms.length === 0) {
            setSymptomError(true)
            toast.error('Please select at least one symptom')
            return
        }
        setSymptomError(false)

        setIsBooking(true)
        const date = docSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try {
            // Prepare form data for file upload
            const formData = new FormData()
            formData.append('docId', docId)
            formData.append('slotDate', slotDate)
            formData.append('slotTime', slotTime)
            formData.append('symptoms', JSON.stringify(selectedSymptoms))
            
            // Add actualPatient data if available
            if (patientData) {
                formData.append('actualPatient', JSON.stringify(patientData))
                // Add prescription file if available
                if (patientData.prescription) {
                    formData.append('prescription', patientData.prescription)
                }
            }

            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', formData, { 
                headers: { 
                    token,
                    'Content-Type': 'multipart/form-data'
                } 
            })
            if (data.success) {
                const appointmentId = generateAppointmentId()
                
                // Use actual patient name if booking for someone else
                const displayPatientName = patientData && !patientData.isSelf 
                    ? patientData.name 
                    : (userData?.name || 'Patient')

                const ticketData = {
                    id: appointmentId,
                    patientName: displayPatientName,
                    doctorName: docInfo.name,
                    doctorSpecialty: docInfo.speciality,
                    date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    day: daysOfWeek[date.getDay()],
                    time: slotTime,
                    price: docInfo.fees,
                    qrData: generateQRData(appointmentId, docId, slotDate, slotTime),
                    whatsappLink: data.whatsappLink, // Include WhatsApp link
                    actualPatient: patientData // Store for reference
                }

                setAppointmentData(ticketData)
                setShowTicket(true)
                toast.success(data.message)
                
                // WhatsApp message sent automatically via API (no link needed)
                
                getDoctosData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setIsBooking(false)
        }
    }

    // Load patient data from sessionStorage on mount
    useEffect(() => {
        const storedPatientData = sessionStorage.getItem('appointmentPatientData')
        if (storedPatientData) {
            try {
                const parsed = JSON.parse(storedPatientData)
                setPatientData(parsed)
                // Clear from sessionStorage after reading
                sessionStorage.removeItem('appointmentPatientData')
            } catch (e) {
                console.error('Error parsing patient data:', e)
            }
        }
    }, [])

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts()
        }
    }, [docInfo])

    // Handle pre-selected slot from chatbot
    useEffect(() => {
        if (preSelectedDate && preSelectedTime && docSlots.length > 0 && docInfo) {
            // Find the slot index for the pre-selected date
            const dateArray = preSelectedDate.split('_')
            const targetDay = parseInt(dateArray[0])
            const targetMonth = parseInt(dateArray[1]) - 1
            const targetYear = parseInt(dateArray[2])
            
            const slotIndex = docSlots.findIndex(slots => {
                if (slots.length > 0) {
                    const slotDate = slots[0].datetime
                    return slotDate.getDate() === targetDay &&
                           slotDate.getMonth() === targetMonth &&
                           slotDate.getFullYear() === targetYear
                }
                return false
            })

            if (slotIndex !== -1) {
                setSlotIndex(slotIndex)
                // Find and select the time slot
                const timeSlots = docSlots[slotIndex]
                const timeSlot = timeSlots.find(slot => {
                    // Normalize time format for comparison
                    const slotTimeNormalized = slot.time.replace(/\s/g, '').toUpperCase()
                    const selectedTimeNormalized = preSelectedTime.replace(/\s/g, '').toUpperCase()
                    return slotTimeNormalized === selectedTimeNormalized
                })
                if (timeSlot) {
                    setSlotTime(timeSlot.time)
                    toast.success(`Slot pre-selected: ${timeSlot.time}`)
                }
            }
        }
    }, [preSelectedDate, preSelectedTime, docSlots, docInfo])

    // Prevent body scroll when modal is open (mobile fix)
    useEffect(() => {
        if (showTicket) {
            document.body.classList.add('modal-open')
            document.body.style.overflow = 'hidden'
        } else {
            document.body.classList.remove('modal-open')
            document.body.style.overflow = ''
        }
        
        return () => {
            document.body.classList.remove('modal-open')
            document.body.style.overflow = ''
        }
    }, [showTicket])

    if (isDoctorsLoading) {
        return <LoadingSpinner fullScreen text="Loading doctor information..." />
    }

    if (!docInfo) {
        return (
            <div className="page-container">
                <BackButton to="/doctors" label="Back to Doctors" />
                <div className="empty-state card mt-6">
                    <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="empty-state-title">Doctor Not Found</h3>
                    <p className="empty-state-text">We couldn't find the doctor you're looking for.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="page-container fade-in">
            {/* Back Button */}
            <div className="mb-6">
                <BackButton to="/doctors" label="Back to Doctors" />
            </div>

            {/* Doctor Details Card */}
            <div className='card mb-8 overflow-visible'>
                <div className='flex flex-col lg:flex-row gap-6 p-4 sm:p-6'>
                    {/* Doctor Image */}
                    <div className='flex-shrink-0 mx-auto lg:mx-0'>
                        <img 
                            className='w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-cover rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100' 
                            src={docInfo.image} 
                            alt={docInfo.name} 
                        />
                    </div>

                    {/* Doctor Info */}
                    <div className='flex-1 min-w-0'>
                        <div className='flex items-start gap-2 flex-wrap justify-center lg:justify-start'>
                            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center lg:text-left'>
                                {docInfo.name}
                            </h1>
                            <img className='w-5 h-5 mt-1' src={assets.verified_icon} alt="Verified" />
                        </div>

                        <div className='flex items-center gap-2 sm:gap-3 mt-2 flex-wrap justify-center lg:justify-start'>
                            <p className='text-gray-600 text-sm sm:text-base'>{docInfo.degree} - {docInfo.speciality}</p>
                            {(() => {
                                const badge = getExperienceBadge(docInfo.experience)
                                return (
                                    <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border-2 ${badge.bg} ${badge.border} text-xs sm:text-sm font-medium`}>
                                        <span>{badge.emoji}</span>
                                        <span className={badge.color}>{badge.label}</span>
                                        <span className='text-gray-600 hidden sm:inline'>({docInfo.experience})</span>
                                    </span>
                                )
                            })()}
                        </div>

                        {/* About */}
                        <div className='mt-4'>
                            <p className='flex items-center gap-2 text-sm font-semibold text-gray-800 justify-center lg:justify-start'>
                                <svg className='w-4 h-4 text-cyan-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                About
                            </p>
                            <p className='text-sm text-gray-600 mt-1 leading-relaxed text-center lg:text-left'>{docInfo.about}</p>
                            {getDoctorHighlights(docInfo).length > 0 && (
                                <ul className='mt-2 list-disc list-inside text-sm text-gray-600 space-y-1 text-left'>
                                    {getDoctorHighlights(docInfo).map((point, idx) => (
                                        <li key={idx}>{point}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Fee */}
                        <div className='mt-4 flex justify-center lg:justify-start'>
                            <div className='inline-flex items-center gap-2 bg-cyan-50 px-4 py-2 rounded-lg'>
                                <span className='text-gray-600 font-medium text-sm sm:text-base'>Consultation Fee:</span>
                                <span className='text-lg sm:text-xl font-bold text-cyan-600'>{currencySymbol}{docInfo.fees}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Section */}
            <div className='card p-4 sm:p-6 overflow-visible'>
                <div className='mb-6'>
                    <h2 className='text-lg sm:text-xl font-bold text-gray-900'>Select Date & Time</h2>
                    <p className='text-gray-600 text-sm mt-1'>Choose your preferred appointment slot</p>
                </div>

                {/* Date Selection */}
                <div className='mb-6'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2'>
                        <svg className='w-4 h-4 text-cyan-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Select Date
                    </h3>
                    <div className='flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar'>
                        {docSlots.length > 0 && docSlots.map((item, index) => {
                            const isSelected = slotIndex === index
                            const date = item[0]?.datetime
                            if (!date) return null
                            
                            return (
                                <button 
                                    onClick={() => { setSlotIndex(index); setSlotTime(''); }} 
                                    key={index} 
                                    className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[60px] sm:min-w-[70px] py-3 sm:py-4 px-2 sm:px-3 rounded-xl border-2 transition-all duration-200 ${
                                        isSelected 
                                            ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-cyan-500 shadow-lg scale-105' 
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-cyan-300 hover:bg-cyan-50'
                                    }`}
                                >
                                    <span className='text-[10px] sm:text-xs font-bold opacity-70'>
                                        {daysOfWeek[date.getDay()]}
                                    </span>
                                    <span className='text-lg sm:text-xl font-bold'>
                                        {date.getDate()}
                                    </span>
                                    <span className='text-[10px] sm:text-xs opacity-70'>
                                        {date.toLocaleDateString('en-US', { month: 'short' })}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Symptoms Based on Doctor Specialization (between Date & Available Times) */}
                <div className='mb-6 p-4 sm:p-5 bg-white rounded-lg border border-gray-200 shadow-sm'>
                    <SymptomsBySpecialization 
                        doctorSpecialization={docInfo?.speciality}
                        doctorName={docInfo?.name || ''}
                        onSymptomsChange={(symptoms) => {
                            setSelectedSymptoms(symptoms)
                            if (symptoms.length > 0) setSymptomError(false)
                        }}
                        selectedSymptoms={selectedSymptoms}
                        isLoading={false}
                    />
                    {symptomError && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Please select at least one symptom
                            </p>
                        </div>
                    )}
                </div>

                {/* Time Slots */}
                <div className='mb-6'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2'>
                        <svg className='w-4 h-4 text-cyan-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Available Times
                    </h3>
                    {docSlots.length > 0 && docSlots[slotIndex]?.length > 0 ? (
                        <div className='grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3'>
                            {docSlots[slotIndex].map((item, index) => {
                                const isSelected = item.time === slotTime
                                return (
                                    <button
                                        onClick={() => setSlotTime(item.time)}
                                        key={index}
                                        className={`flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                                            isSelected
                                                ? 'bg-black text-white border-black shadow-lg'
                                                : 'bg-white border-black text-black hover:bg-gray-100'
                                        }`}
                                    >
                                        <svg className='w-3.5 h-3.5 sm:w-4 sm:h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {item.time.toLowerCase()}
                                    </button>
                                )
                            })}
                        </div>
                    ) : (
                        <p className='text-gray-500 text-sm py-4'>No available slots for this date</p>
                    )}
                </div>

                {/* Upload Reports Section */}
                {token && (
                    <div className='mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200'>
                        <div className='flex items-start gap-3'>
                            <div className='flex-shrink-0 mt-1'>
                                <svg className='w-6 h-6 text-blue-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className='flex-1'>
                                <h3 className='text-sm font-semibold text-gray-900 mb-1'>Have Medical Reports?</h3>
                                <p className='text-xs text-gray-600 mb-3'>
                                    Upload your lab reports, X-rays, or scans before your appointment. Dr. {docInfo.name} will be able to review them during consultation.
                                </p>
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className='btn btn-sm btn-secondary'
                                >
                                    <svg className='w-4 h-4 mr-2' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Upload Reports
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Book Button - Left Aligned */}
                <div className='flex justify-start pt-4 border-t border-gray-100'>
                    <button 
                        onClick={bookAppointment}
                        disabled={!slotTime || isBooking}
                        className={`btn ${slotTime ? 'btn-primary' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        {isBooking ? (
                            <>
                                <ButtonSpinner />
                                Booking...
                            </>
                        ) : (
                            <>
                                Book Appointment
                                <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Upload Reports Modal */}
            {showUploadModal && (
                <UploadReportsModal
                    docId={docId}
                    docName={docInfo.name}
                    appointmentId={null}
                    onClose={() => setShowUploadModal(false)}
                    onSuccess={() => {
                        toast.success('Reports uploaded successfully!');
                    }}
                />
            )}

            {/* Related Doctors */}
            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />

            {/* Ticket Modal - Responsive Card */}
            <AnimatePresence>
                {showTicket && appointmentData && (
                    <>
                        {/* Backdrop - Darker and solid on mobile */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowTicket(false)}
                            className="fixed inset-0 bg-black/80 md:bg-black/50 md:backdrop-blur-sm z-modal-backdrop"
                        />

                        {/* Modal */}
                        <div className="fixed inset-0 z-modal flex items-center justify-center md:p-4 pointer-events-none overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="pointer-events-auto w-full h-full md:h-auto md:max-w-[700px] md:my-4"
                            >
                                {/* Responsive Card - Full screen on mobile, card on desktop */}
                                <div className="bg-white md:rounded-2xl shadow-2xl overflow-hidden border-0 md:border md:border-gray-200 h-full md:h-auto flex flex-col max-h-screen md:max-h-[90vh]">
                                    
                                    {/* Top Header - Sticky on mobile */}
                                    <div className='flex sticky top-0 z-[11000] shadow-md'>
                                        <div className='bg-cyan-500 px-5 md:px-6 py-3 md:py-3 flex-1 flex items-center gap-3'>
                                            <div className='hidden sm:block'>
                                                <BrandLogo size="small" variant="header" clickable={false} className="brightness-0 invert" />
                                            </div>
                                            <div>
                                                <p className='text-white text-base md:text-base font-bold tracking-wide'>MediChain</p>
                                                <p className='text-white/80 text-xs md:text-xs'>Appointment Confirmation</p>
                                            </div>
                                        </div>
                                        <div className='bg-green-500 px-4 md:px-6 py-3 md:py-3 flex items-center gap-2 md:gap-2'>
                                            <svg className="w-5 h-5 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className='text-white font-bold text-sm md:text-sm'>BOOKED</span>
                                        </div>
                                        {/* Close button for mobile */}
                                        <button
                                            onClick={() => setShowTicket(false)}
                                            className='absolute top-3 right-3 md:hidden w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm'
                                            style={{ zIndex: 11001 }}
                                        >
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Body - Vertical on mobile, Horizontal on desktop - Scrollable on mobile */}
                                    <div className='flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-visible'>
                                        
                                        {/* Details */}
                                        <div className='flex-1 p-5 md:p-6 order-1'>
                                            {/* Patient & ID */}
                                            <div className='border-b border-dashed border-gray-200 pb-3 md:pb-3 mb-4 md:mb-4'>
                                                <p className='text-gray-800 font-bold text-2xl md:text-xl leading-tight'>{appointmentData.patientName}</p>
                                                <p className='font-mono text-gray-500 text-xs md:text-xs mt-1.5'>ID: {appointmentData.id}</p>
                                            </div>

                                            {/* Details Grid - 2 columns */}
                                            <div className='grid grid-cols-2 gap-x-5 md:gap-x-6 gap-y-4 md:gap-y-4'>
                                                <div>
                                                    <p className='text-[11px] md:text-[10px] text-gray-500 uppercase font-semibold tracking-wide'>Doctor</p>
                                                    <p className='font-semibold text-gray-800 text-sm md:text-sm mt-1.5 md:mt-1 leading-tight'>{appointmentData.doctorName}</p>
                                                </div>
                                                <div>
                                                    <p className='text-[11px] md:text-[10px] text-gray-500 uppercase font-semibold tracking-wide'>Specialty</p>
                                                    <p className='font-semibold text-cyan-600 text-sm md:text-sm mt-1.5 md:mt-1 leading-tight'>{appointmentData.doctorSpecialty}</p>
                                                </div>
                                                <div>
                                                    <p className='text-[11px] md:text-[10px] text-gray-500 uppercase font-semibold tracking-wide'>Date</p>
                                                    <p className='font-semibold text-gray-800 text-sm md:text-sm mt-1.5 md:mt-1 leading-tight'>{appointmentData.date}</p>
                                                </div>
                                                <div>
                                                    <p className='text-[11px] md:text-[10px] text-gray-500 uppercase font-semibold tracking-wide'>Time</p>
                                                    <p className='font-semibold text-gray-800 text-sm md:text-sm mt-1.5 md:mt-1 leading-tight'>{appointmentData.time}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fee & QR - Side by side on mobile, separate sections on desktop */}
                                        <div className='flex md:contents order-2 border-t md:border-t-0 border-dashed border-gray-200'>
                                            {/* Fee - Shows in middle on desktop */}
                                            <div className='bg-gradient-to-b from-green-50 to-emerald-50 p-5 md:p-6 flex flex-col items-center justify-center flex-1 md:flex-initial md:min-w-[120px] md:border-x border-r md:border-r-0 border-dashed border-gray-200 md:order-1'>
                                                <p className='text-xs md:text-[10px] text-gray-600 uppercase font-bold tracking-wide'>Consultation</p>
                                                <p className='text-xs md:text-[10px] text-gray-600 uppercase font-bold tracking-wide'>Fee</p>
                                                <p className='font-bold text-green-600 text-2xl md:text-lg mt-2'>{currencySymbol}{appointmentData.price}</p>
                                            </div>

                                            {/* QR Code - Shows at end on desktop */}
                                            <div className='p-5 md:p-6 flex items-center justify-center bg-gray-50 flex-1 md:flex-initial md:order-2'>
                                                <div className='p-3 md:p-3 bg-white border-2 border-gray-200 rounded-xl md:rounded-xl shadow-sm'>
                                                    {/* Mobile QR */}
                                                    <div className='block md:hidden'>
                                                        <QRCode value={appointmentData.qrData} size={120} level="H" />
                                                    </div>
                                                    {/* Desktop QR */}
                                                    <div className='hidden md:block'>
                                                        <QRCode value={appointmentData.qrData} size={140} level="H" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Buttons */}
                                    <div className='flex gap-3 md:gap-3 p-4 md:p-4 bg-gray-50 border-t border-gray-200'>
                                        <button
                                            onClick={() => { setShowTicket(false); navigate('/my-appointments') }}
                                            className="flex-1 py-3 md:py-3 bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-semibold rounded-xl md:rounded-xl text-sm md:text-sm transition-colors shadow-sm"
                                        >
                                            View Appointments
                                        </button>
                                        <button
                                            onClick={() => setShowTicket(false)}
                                            className="flex-1 py-3 md:py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold rounded-xl md:rounded-xl text-sm md:text-sm transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Appointment

