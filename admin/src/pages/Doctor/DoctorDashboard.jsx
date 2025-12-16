import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import AnimatedCounter from '../../components/ui/AnimatedCounter'

const DoctorDashboard = () => {

  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {

    if (dToken) {
      getDashData()
    }

  }, [dToken])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return dashData && (
    <div className='w-full p-6 animate-fade-in-up'>

      {/* Enhanced Clock and Date Widget */}
      <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6'>
        {/* Live Clock Card */}
        <div className='flex-1 bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-white/50 hover-lift'>
          <div className='flex items-center gap-3 sm:gap-4'>
            <div className='bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md flex-shrink-0'>
              <svg className='w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-500 icon-glow' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className='min-w-0 flex-1'>
              <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wider text-gray-800'>{formatTime(currentTime)}</h2>
              <p className='text-cyan-600 text-xs sm:text-sm mt-1 font-medium'>Live Clock</p>
            </div>
          </div>
        </div>
        
        {/* Current Date Card */}
        <div className='flex-1 bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-white/50 hover-lift'>
          <div className='flex items-center gap-3 sm:gap-4'>
            <div className='bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md flex-shrink-0'>
              <svg className='w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-base sm:text-lg lg:text-xl font-semibold text-gray-800 break-words'>{formatDate(currentTime)}</p>
              <p className='text-cyan-600 text-[10px] sm:text-xs mt-1 font-medium'>Current Date</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Analytics Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6'>
        {/* Earnings Card */}
        <div className='bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover-lift relative overflow-hidden group'>
          <div className='absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16'></div>
          <div className='relative z-10 flex items-center gap-3 sm:gap-4'>
            <div className='p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0'>
              <svg className='w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-gray-500 text-xs sm:text-sm font-medium mb-1'>Total Earnings</p>
              <p className='text-xl sm:text-2xl font-bold text-gray-800'>
                <AnimatedCounter value={dashData.earnings} prefix={currency + ' '} duration={2000} />
              </p>
            </div>
          </div>
        </div>

        {/* Appointments Card */}
        <div className='bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover-lift relative overflow-hidden group'>
          <div className='absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16'></div>
          <div className='relative z-10 flex items-center gap-3 sm:gap-4'>
            <div className='p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0'>
              <svg className='w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-gray-500 text-xs sm:text-sm font-medium mb-1'>Appointments</p>
              <p className='text-xl sm:text-2xl font-bold text-gray-800'>
                <AnimatedCounter value={dashData.appointments} duration={2000} />
              </p>
            </div>
          </div>
        </div>

        {/* Patients Card */}
        <div className='bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover-lift relative overflow-hidden group'>
          <div className='absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16'></div>
          <div className='relative z-10 flex items-center gap-3 sm:gap-4'>
            <div className='p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0'>
              <svg className='w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-gray-500 text-xs sm:text-sm font-medium mb-1'>Total Patients</p>
              <p className='text-xl sm:text-2xl font-bold text-gray-800'>
                <AnimatedCounter value={dashData.patients} duration={2000} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className='bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
        <div className='flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200'>
          <div className='p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0'>
            <svg className='w-4 h-4 sm:w-5 sm:h-5 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className='font-bold text-gray-800 text-base sm:text-lg'>Latest Bookings</p>
        </div>

        <div className='divide-y divide-gray-100'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 gap-3 sm:gap-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-300 group' key={index}>
              <div className='relative flex-shrink-0'>
                <img 
                  className='rounded-full w-10 h-10 sm:w-12 sm:h-12 object-cover ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all duration-300 shadow-md' 
                  src={item.userData.image} 
                  alt="" 
                />
                <div className='absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white shadow-md'></div>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-gray-800 font-semibold text-sm sm:text-base truncate'>
                  {item.actualPatient && !item.actualPatient.isSelf 
                    ? item.actualPatient.name 
                    : item.userData.name}
                </p>
                {item.actualPatient && !item.actualPatient.isSelf && (
                  <div className='flex items-center gap-2 mt-1 flex-wrap'>
                    <span className='pill-badge bg-cyan-100 text-cyan-700 border border-cyan-300 text-[10px] sm:text-xs'>
                      {item.actualPatient.relationship}
                    </span>
                    <span className='text-[10px] sm:text-xs text-gray-500'>
                      Booked by: <span className='font-medium'>{item.userData.name}</span>
                    </span>
                  </div>
                )}
                <p className='text-gray-600 text-xs sm:text-sm mt-1'>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              <div className='flex items-center gap-2 sm:gap-3 flex-shrink-0'>
                {item.cancelled ? (
                  <span className='pill-badge bg-red-100 text-red-700 border border-red-300 text-[10px] sm:text-xs'>Cancelled</span>
                ) : item.isCompleted ? (
                  <span className='pill-badge bg-green-100 text-green-700 border border-green-300 text-[10px] sm:text-xs'>Completed</span>
                ) : (
                  <div className='flex gap-1.5 sm:gap-2'>
                    <button 
                      onClick={() => cancelAppointment(item._id)} 
                      className='p-1.5 sm:p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-300 hover:scale-110'
                      title="Cancel Appointment"
                    >
                      <svg className='w-4 h-4 sm:w-5 sm:h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => completeAppointment(item._id)} 
                      className='p-1.5 sm:p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-all duration-300 hover:scale-110'
                      title="Complete Appointment"
                    >
                      <svg className='w-4 h-4 sm:w-5 sm:h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default DoctorDashboard