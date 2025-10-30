import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData, userData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [showTicket, setShowTicket] = useState(false)
    const [appointmentData, setAppointmentData] = useState(null)

    const navigate = useNavigate()

    // Get experience badge based on years
    const getExperienceBadge = (experience) => {
        // Extract numeric value from experience (handle "9 Year", "10 years", "9", etc.)
        let years = 0
        if (typeof experience === 'string') {
            // Extract number from string like "9 Year", "10 years", etc.
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
                label: 'Gold', 
                color: 'text-yellow-600', 
                bg: 'bg-gradient-to-r from-yellow-100 to-yellow-50', 
                border: 'border-yellow-400',
                glow: 'shadow-[0_0_15px_rgba(234,179,8,0.5)]'
            }
        } else if (years >= 5) {
            return { 
                emoji: '🥈', 
                label: 'Silver', 
                color: 'text-gray-600', 
                bg: 'bg-gradient-to-r from-gray-100 to-gray-50', 
                border: 'border-gray-400',
                glow: 'shadow-[0_0_15px_rgba(156,163,175,0.5)]'
            }
        } else {
            return { 
                emoji: '🥉', 
                label: 'Bronze', 
                color: 'text-orange-600', 
                bg: 'bg-gradient-to-r from-orange-100 to-orange-50', 
                border: 'border-orange-400',
                glow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]'
            }
        }
    }

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSolts = async () => {

        setDocSlots([])

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {

            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting hours 
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

                    // Add slot to array
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                // Increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setDocSlots(prev => ([...prev, timeSlots]))

        }

    }

    // Generate unique appointment ID
    const generateAppointmentId = () => {
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 100000)
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const randomLetter = letters[Math.floor(Math.random() * letters.length)]
        return `APT-${randomLetter}${timestamp.toString().slice(-6)}${random.toString().padStart(5, '0')}`
    }

    // Generate QR code data
    const generateQRData = (appointmentId, docId, slotDate, slotTime) => {
        return JSON.stringify({
            id: appointmentId,
            doctorId: docId,
            date: slotDate,
            time: slotTime,
            timestamp: Date.now()
        })
    }

    // Simple QR Code Generator (SVG-based)
    const QRCodeSVG = ({ value, size = 150 }) => {
        // This is a simplified QR representation - for production, use a proper QR library
        const qrPattern = value.split('').reduce((acc, char, i) => {
            const code = char.charCodeAt(0)
            const pattern = (code % 16).toString(2).padStart(4, '0') + 
                          ((code >> 4) % 16).toString(2).padStart(4, '0')
            return acc + pattern
        }, '').slice(0, 225) // 15x15 grid
        
        const cellSize = size / 15
        
        return (
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="bg-white">
                {qrPattern.split('').map((bit, idx) => {
                    const row = Math.floor(idx / 15)
                    const col = idx % 15
                    return (
                        <rect
                            key={idx}
                            x={col * cellSize}
                            y={row * cellSize}
                            width={cellSize}
                            height={cellSize}
                            fill={bit === '1' ? '#000000' : '#FFFFFF'}
                        />
                    )
                })}
                {/* Add finder patterns (corners) */}
                <rect x={0} y={0} width={cellSize * 7} height={cellSize * 7} fill="#000000" />
                <rect x={cellSize} y={cellSize} width={cellSize * 5} height={cellSize * 5} fill="#FFFFFF" />
                <rect x={cellSize * 2} y={cellSize * 2} width={cellSize * 3} height={cellSize * 3} fill="#000000" />
                
                <rect x={size - cellSize * 7} y={0} width={cellSize * 7} height={cellSize * 7} fill="#000000" />
                <rect x={size - cellSize * 6} y={cellSize} width={cellSize * 5} height={cellSize * 5} fill="#FFFFFF" />
                <rect x={size - cellSize * 5} y={cellSize * 2} width={cellSize * 3} height={cellSize * 3} fill="#000000" />
                
                <rect x={0} y={size - cellSize * 7} width={cellSize * 7} height={cellSize * 7} fill="#000000" />
                <rect x={cellSize} y={size - cellSize * 6} width={cellSize * 5} height={cellSize * 5} fill="#FFFFFF" />
                <rect x={cellSize * 2} y={size - cellSize * 5} width={cellSize * 3} height={cellSize * 3} fill="#000000" />
            </svg>
        )
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

        const date = docSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try {

            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
            if (data.success) {
                // Generate unique appointment ID
                const appointmentId = generateAppointmentId()
                
                // Create ticket data
                const ticketData = {
                    id: appointmentId,
                    patientName: userData?.name || 'Patient',
                    doctorName: docInfo.name,
                    doctorSpecialty: docInfo.speciality,
                    date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    day: daysOfWeek[date.getDay()],
                    time: slotTime,
                    price: docInfo.fees,
                    qrData: generateQRData(appointmentId, docId, slotDate, slotTime)
                }

                setAppointmentData(ticketData)
                setShowTicket(true)
                toast.success(data.message)
                getDoctosData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

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

    return docInfo ? (
        <div>

            {/* ---------- Doctor Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

                    {/* ----- Doc Info : name, degree, experience ----- */}

                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
                    <div className='flex items-center gap-3 mt-2 flex-wrap'>
                        <p className='text-gray-600'>{docInfo.degree} - {docInfo.speciality}</p>
                        {(() => {
                            const badge = getExperienceBadge(docInfo.experience)
                            return (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 ${badge.bg} ${badge.border} ${badge.glow} transition-all duration-300 hover:scale-110 cursor-default relative overflow-hidden`}
                                >
                                    {/* Shine effect */}
                                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full animate-shine'></div>
                                    <span className='text-2xl relative z-10'>{badge.emoji}</span>
                                    <span className={`font-bold text-sm ${badge.color} relative z-10`}>
                                        {badge.label}
                                    </span>
                                    <span className='text-gray-700 font-semibold text-sm relative z-10'>
                                        ({docInfo.experience})
                                    </span>
                                </motion.div>
                            )
                        })()}
                    </div>

                    {/* ----- Doc About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span> </p>
                </div>
            </div>

            {/* Enhanced Booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-12'>
                <div className='mb-6'>
                    <h2 className='text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2'>
                        Select Date & Time
                    </h2>
                    <p className='text-gray-600'>Choose your preferred appointment slot</p>
                </div>

                {/* Date Selection - Enhanced */}
                <div className='mb-8'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2'>
                        <svg className='w-4 h-4 text-cyan-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Select Date
                    </h3>
                    <div className='flex gap-3 items-center w-full overflow-x-auto pb-2 scrollbar-hide'>
                        {docSlots.length && docSlots.map((item, index) => {
                            const isSelected = slotIndex === index
                            const date = item[0]?.datetime
                            return (
                                <div 
                                    onClick={() => setSlotIndex(index)} 
                                    key={index} 
                                    className={`group date-slot flex flex-col items-center justify-center min-w-[80px] py-4 px-3 rounded-xl cursor-pointer transition-all duration-300 transform ${
                                        isSelected 
                                            ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 scale-110' 
                                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-cyan-400 hover:bg-cyan-50 hover:scale-105 hover:shadow-md'
                                    }`}
                                >
                                    {isSelected && (
                                        <div className='absolute inset-0 bg-white/20 rounded-xl animate-pulse-glow'></div>
                                    )}
                                    <p className={`text-xs font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                                        {date && daysOfWeek[date.getDay()]}
                                    </p>
                                    <p className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                        {date && date.getDate()}
                                    </p>
                                    <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                                        {date && date.toLocaleDateString('en-US', { month: 'short' })}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Time Slots - Enhanced */}
                <div className='mb-8'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2'>
                        <svg className='w-4 h-4 text-cyan-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Available Times
                    </h3>
                    <div className='flex items-center gap-3 w-full overflow-x-auto pb-2 scrollbar-hide flex-wrap'>
                        {docSlots.length && docSlots[slotIndex].map((item, index) => {
                            const isSelected = item.time === slotTime
                            return (
                                <button
                                    onClick={() => setSlotTime(item.time)}
                                    key={index}
                                    className={`time-slot relative flex-shrink-0 px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 transform ${
                                        isSelected
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 scale-105'
                                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-cyan-400 hover:bg-cyan-50 hover:scale-105 hover:shadow-md'
                                    }`}
                                >
                                    {isSelected && (
                                        <>
                                            <div className='absolute inset-0 bg-white/20 rounded-full animate-pulse-glow'></div>
                                            <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-bounce'></div>
                                        </>
                                    )}
                                    <span className='relative z-10 flex items-center gap-2'>
                                        <svg className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-cyan-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {item.time.toLowerCase()}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Enhanced Book Button */}
                <div className='flex justify-center'>
                    <button 
                        onClick={bookAppointment}
                        disabled={!slotTime}
                        className={`group relative overflow-hidden px-12 py-4 rounded-full font-semibold text-base transition-all duration-300 transform ${
                            slotTime
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70 hover:scale-105'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {slotTime && (
                            <>
                                <div className='absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                            </>
                        )}
                        <span className='relative z-10 flex items-center gap-2'>
                            Book Appointment
                            <svg className='w-5 h-5 transform group-hover:translate-x-1 transition-transform' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }

                @keyframes pulse-glow {
                    0%, 100% {
                        opacity: 0.2;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.4;
                        transform: scale(1.05);
                    }
                }

                .animate-pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }

                .date-slot, .time-slot {
                    position: relative;
                }

                .date-slot:hover, .time-slot:hover {
                    transform: translateY(-2px) scale(1.05);
                }

                @keyframes shine {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(200%);
                    }
                }

                .animate-shine {
                    animation: shine 3s infinite;
                }
            `}</style>

            {/* Listing Releated Doctors */}
            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />

            {/* Movie Ticket Style Modal */}
            <AnimatePresence>
                {showTicket && appointmentData && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowTicket(false)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
                        />

                        {/* Ticket Modal */}
                        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                                transition={{ type: 'spring', duration: 0.6 }}
                                className="pointer-events-auto w-full max-w-[320px]"
                            >
                                {/* Movie Ticket Style - Narrow Vertical Design */}
                                <div className="relative bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-2xl overflow-hidden border border-gray-200">
                                    {/* Left Side Perforations */}
                                    <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col items-center justify-around py-8">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-300 border border-gray-400"></div>
                                        ))}
                                    </div>

                                    {/* Right Side Perforations */}
                                    <div className="absolute right-0 top-0 bottom-0 w-3 flex flex-col items-center justify-around py-8">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-300 border border-gray-400"></div>
                                        ))}
                                    </div>

                                    {/* Ticket Content */}
                                    <div className="relative px-4 py-5 ml-3 mr-3">
                                        {/* Header */}
                                        <div className="text-center mb-4 pb-3 border-b-2 border-dashed border-gray-300">
                                            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1.5 rounded-full mb-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-xs font-bold">CONFIRMED</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-semibold tracking-wider">MEDICHAIN HEALTHCARE</p>
                                        </div>

                                        {/* Appointment ID */}
                                        <div className="text-center mb-3 pb-2 border-b border-dashed border-gray-200">
                                            <p className="text-[8px] text-gray-500 uppercase tracking-wide mb-0.5">Appointment ID</p>
                                            <p className="text-xs font-mono font-bold text-gray-900 tracking-tight">{appointmentData.id}</p>
                                        </div>

                                        {/* Patient & Doctor - Compact */}
                                        <div className="mb-3 pb-2 border-b border-dashed border-gray-200 space-y-1.5">
                                            <div className="flex justify-between items-start">
                                                <span className="text-[8px] text-gray-500 uppercase">Patient</span>
                                                <span className="text-[10px] font-semibold text-gray-800 text-right max-w-[60%] truncate">{appointmentData.patientName}</span>
                                            </div>
                                            <div className="flex justify-between items-start">
                                                <span className="text-[8px] text-gray-500 uppercase">Doctor</span>
                                                <span className="text-[10px] font-semibold text-gray-800 text-right max-w-[60%] truncate">{appointmentData.doctorName}</span>
                                            </div>
                                        </div>

                                        {/* Specialty */}
                                        <div className="mb-3 pb-2 border-b border-dashed border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] text-gray-500 uppercase">Specialty</span>
                                                <span className="text-[10px] font-semibold text-cyan-600">{appointmentData.doctorSpecialty}</span>
                                            </div>
                                        </div>

                                        {/* Date & Time - Side by Side */}
                                        <div className="mb-3 pb-2 border-b border-dashed border-gray-200">
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <p className="text-[8px] text-gray-500 uppercase">Date</p>
                                                    <p className="text-[9px] font-semibold text-gray-800">{appointmentData.date.split(' ')[0]} {appointmentData.date.split(' ')[1].slice(0, 3)}</p>
                                                    <p className="text-[8px] text-gray-500">{appointmentData.day}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] text-gray-500 uppercase">Time</p>
                                                    <p className="text-[9px] font-semibold text-gray-800">{appointmentData.time}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="mb-3 pb-2 border-b border-dashed border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] text-gray-500 uppercase">Fee</span>
                                                <span className="text-sm font-bold text-green-600">{currencySymbol}{appointmentData.price}</span>
                                            </div>
                                        </div>

                                        {/* QR Code - Smaller */}
                                        <div className="flex flex-col items-center pt-2">
                                            <p className="text-[8px] text-gray-500 uppercase mb-1.5 tracking-wide">Scan for Details</p>
                                            <div className="bg-white p-1.5 rounded border border-gray-300 shadow-sm">
                                                <QRCodeSVG value={appointmentData.qrData} size={80} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons - Compact */}
                                    <div className="px-4 pb-4 pt-2 space-y-2 ml-3 mr-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setShowTicket(false)
                                                navigate('/my-appointments')
                                            }}
                                            className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                                        >
                                            View Appointments
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowTicket(false)}
                                            className="w-full py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-all"
                                        >
                                            Close
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    ) : null
}

export default Appointment