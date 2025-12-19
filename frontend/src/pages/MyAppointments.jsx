import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import BackButton from '../components/BackButton'
import LoadingSpinner, { SkeletonAppointment, ButtonSpinner } from '../components/LoadingSpinner'
import QueueTracker from '../components/QueueTracker'

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState(null)
    const [payingId, setPayingId] = useState(null)

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        setIsLoading(true)
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {
        setCancellingId(appointmentId)
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setCancellingId(null)
        }
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to make payment using razorpay
    const appointmentRazorpay = async (appointmentId) => {
        setPayingId(appointmentId)
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setPayingId(null)
        }
    }

    // Function to make payment using stripe
    const appointmentStripe = async (appointmentId) => {
        setPayingId(appointmentId)
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setPayingId(null)
        }
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    // Get status badge
    const getStatusBadge = (item) => {
        if (item.isCompleted) {
            return <span className="badge badge-success">Completed</span>
        }
        if (item.cancelled) {
            return <span className="badge badge-error">Cancelled</span>
        }
        if (item.payment) {
            return <span className="badge badge-info">Paid</span>
        }
        return <span className="badge badge-warning">Pending Payment</span>
    }

    return (
        <div className="page-container fade-in">
            {/* Back Button */}
            <div className="mb-6">
                <BackButton to="/" label="Back to Home" />
            </div>

            {/* Page Header */}
            <div className="section-header">
                <h1 className="section-title">My Appointments</h1>
                <p className="section-subtitle">Manage and track all your medical appointments</p>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <SkeletonAppointment key={i} />
                    ))}
                </div>
            ) : appointments.length === 0 ? (
                /* Empty State */
                <div className="empty-state card">
                    <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="empty-state-title">No Appointments Yet</h3>
                    <p className="empty-state-text mb-4">
                        You haven't booked any appointments. Browse our doctors and schedule your first visit.
                    </p>
                    <button 
                        onClick={() => navigate('/doctors')}
                        className="btn btn-primary"
                    >
                        Find a Doctor
                    </button>
                </div>
            ) : (
                /* Appointments Grid */
                <div className="space-y-3 sm:space-y-4">
                    {appointments.map((item, index) => (
                        <div 
                            key={index} 
                            className="appointment-card slide-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Doctor Image */}
                            <div className="relative flex-shrink-0">
                                <img 
                                    className="appointment-card-image" 
                                    src={item.docData.image} 
                                    alt={item.docData.name}
                                    onClick={() => navigate(`/appointment/${item.docData._id}`)}
                                />
                                <div className="absolute top-2 left-2 sm:hidden">
                                    {getStatusBadge(item)}
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="appointment-card-content">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{item.docData.name}</h3>
                                        <p className="text-cyan-600 font-medium text-xs sm:text-sm mt-0.5">{item.docData.speciality}</p>
                                    </div>
                                    <div className="hidden sm:block flex-shrink-0">
                                        {getStatusBadge(item)}
                                    </div>
                                </div>

                                <div className="space-y-2.5 text-xs sm:text-sm">
                                    {/* Location Section */}
                                    <div className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 sm:w-4 sm:h-4 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div className="flex-1 min-w-0 text-gray-600 leading-relaxed">
                                            <p className="break-words">{item.docData.address.line1}</p>
                                            {item.docData.address.line2 && (
                                                <p className="break-words">{item.docData.address.line2}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date & Time Section */}
                                    <div className="flex items-center gap-2.5">
                                        <svg className="w-4 h-4 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
                                            <p className="font-medium text-gray-800">
                                                {slotDateFormat(item.slotDate)} at {item.slotTime}
                                            </p>
                                            {item.tokenNumber && (
                                                <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                                                    Token #{item.tokenNumber}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Queue Tracker - Show for upcoming appointments */}
                                {!item.cancelled && !item.isCompleted && item.payment && (
                                    <div className="mt-4">
                                        <QueueTracker
                                            appointmentId={item._id}
                                            docId={item.docId}
                                            slotDate={item.slotDate}
                                            slotTime={item.slotTime}
                                            onTokenAlert={(tokenNumber) => {
                                                toast.success(`🎯 Token #${tokenNumber} - Your turn is next!`, {
                                                    autoClose: 10000,
                                                    position: "top-center"
                                                })
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Actions - Right Side Payment Section */}
                            <div className="appointment-card-actions">
                                {/* Completed Status */}
                                {item.isCompleted && (
                                    <button className="btn btn-success" disabled>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Completed
                                    </button>
                                )}

                                {/* Cancelled Status */}
                                {item.cancelled && !item.isCompleted && (
                                    <button className="btn btn-danger" disabled>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Cancelled
                                    </button>
                                )}

                                {/* Payment Options - Pay Online Button */}
                                {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                                    <>
                                        <button 
                                            onClick={() => setPayment(item._id)} 
                                            className="btn btn-primary"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            Pay Online
                                        </button>
                                        {/* Cancel Button */}
                                        <button 
                                            onClick={() => cancelAppointment(item._id)}
                                            disabled={cancellingId === item._id}
                                            className="btn btn-outline-danger"
                                        >
                                            {cancellingId === item._id ? (
                                                <ButtonSpinner />
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Cancel
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}

                                {/* Payment Methods - Stripe & Razorpay */}
                                {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                    <>
                                        <button 
                                            onClick={() => appointmentStripe(item._id)}
                                            disabled={payingId === item._id}
                                            className="btn btn-secondary"
                                        >
                                            {payingId === item._id ? (
                                                <ButtonSpinner />
                                            ) : (
                                                <img className="h-4" src={assets.stripe_logo} alt="Stripe" />
                                            )}
                                        </button>
                                        <button 
                                            onClick={() => appointmentRazorpay(item._id)}
                                            disabled={payingId === item._id}
                                            className="btn btn-secondary"
                                        >
                                            {payingId === item._id ? (
                                                <ButtonSpinner />
                                            ) : (
                                                <img className="h-4" src={assets.razorpay_logo} alt="Razorpay" />
                                            )}
                                        </button>
                                        {/* Cancel Button */}
                                        <button 
                                            onClick={() => cancelAppointment(item._id)}
                                            disabled={cancellingId === item._id}
                                            className="btn btn-outline-danger"
                                        >
                                            {cancellingId === item._id ? (
                                                <ButtonSpinner />
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Cancel
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}

                                {/* Paid Status */}
                                {!item.cancelled && item.payment && !item.isCompleted && (
                                    <button className="btn btn-success" disabled>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Paid
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyAppointments

