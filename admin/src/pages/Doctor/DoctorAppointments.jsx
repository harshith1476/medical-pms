import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import AppointmentDetailModal from '../../components/AppointmentDetailModal'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='w-full min-h-full bg-white p-4 sm:p-4 animate-fade-in-up mobile-safe-area'>

      <div className='mb-3 sm:mb-4'>
        <h1 className='text-lg sm:text-xl font-bold text-gray-800 mb-1'>All Appointments</h1>
        <p className='text-xs sm:text-sm text-gray-600'>Manage and track all your patient appointments</p>
      </div>

      <div className='bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
        {/* Table Body with Scroll */}
        <div 
          className='overflow-y-auto overflow-x-auto'
          style={{
            maxHeight: 'calc(100vh - 300px)',
            scrollBehavior: 'smooth'
          }}
        >
          <div className='min-w-[1000px]'>
            {/* Table Header - Sticky */}
            <div 
              className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_2.5fr_1fr_1.5fr] gap-2.5 sm:gap-3 py-2.5 px-3 sm:px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-xs sm:text-sm border-b border-blue-600'
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 5
              }}
            >
              <p className='text-center'>#</p>
              <p className='text-left'>Patient</p>
              <p className='text-center'>Token</p>
              <p className='text-center'>Payment</p>
              <p className='text-center'>Age</p>
              <p className='text-left'>Date & Time</p>
              <p className='text-right'>Fees</p>
              <p className='text-center'>Action</p>
            </div>
          {appointments.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6'>
              <svg className='w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mb-3 sm:mb-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className='text-gray-500 text-base sm:text-lg font-medium'>No appointments found</p>
              <p className='text-gray-400 text-xs sm:text-sm mt-1'>Your appointments will appear here</p>
            </div>
          ) : (
            <>
            {/* Mobile Cards */}
            <div className='sm:hidden space-y-3 p-0'>
              {appointments.map((item, index) => (
                <div key={index} className='bg-white rounded-xl p-4 border border-gray-200 shadow-sm w-full'>
                    <div className='flex items-start gap-3'>
                      <img src={item.userData.image} className='w-12 h-12 rounded-full object-cover ring-2 ring-blue-200 flex-shrink-0' alt="" />
                      <div className='flex-1 min-w-0'>
                        <p className='font-semibold text-sm text-gray-800'>
                          {item.actualPatient && !item.actualPatient.isSelf ? item.actualPatient.name : item.userData.name}
                        </p>
                        {item.actualPatient && !item.actualPatient.isSelf && (
                          <p className='text-xs text-cyan-600 mt-0.5 font-medium'>{item.actualPatient.relationship}</p>
                        )}
                        <p className='text-xs text-gray-500 mt-1'>{slotDateFormat(item.slotDate)} • {item.slotTime}</p>
                        <div className='flex items-center justify-between mt-3'>
                          <span className='text-base font-bold text-blue-600'>{currency}{item.amount}</span>
                          {item.cancelled ? (
                            <span className='px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full badge-cancelled'>Cancelled</span>
                          ) : item.isCompleted ? (
                            <span className='px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full badge-completed'>Completed</span>
                          ) : (
                            <div className='flex gap-2'>
                              <button onClick={() => cancelAppointment(item._id)} className='p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors'>
                                <svg className='w-5 h-5 text-red-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                              <button onClick={() => completeAppointment(item._id)} className='p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors'>
                                <svg className='w-5 h-5 text-green-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
            {/* Desktop Table Rows */}
            {appointments.map((item, index) => (
              <div 
                className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_2.5fr_1fr_1.5fr] gap-2.5 sm:gap-3 items-center text-gray-700 py-2.5 px-3 sm:px-4 border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors duration-150 group' 
                key={index}
              >
                <p className='text-center text-gray-500 font-medium'>{index + 1}</p>
                
                <div className='flex items-center gap-3 min-w-0'>
                  <div className='relative flex-shrink-0'>
                    <img 
                      src={item.userData.image} 
                      className='w-10 h-10 rounded-full object-cover ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all duration-300 shadow-md' 
                      alt="" 
                    />
                    <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='font-semibold text-gray-800 truncate text-sm'>
                      {item.actualPatient && !item.actualPatient.isSelf 
                        ? item.actualPatient.name 
                        : item.userData.name}
                    </p>
                    {item.actualPatient && !item.actualPatient.isSelf && (
                      <div className='flex items-center gap-2 mt-1 flex-wrap'>
                        <span className='pill-badge bg-cyan-100 text-cyan-700 border border-cyan-300 text-xs'>
                          {item.actualPatient.relationship}
                        </span>
                        <span className='text-xs text-gray-500'>
                          by {item.userData.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex justify-center'>
                  {item.tokenNumber ? (
                    <span className='pill-badge bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 border border-cyan-300 font-semibold text-xs inline-block'>
                      #{item.tokenNumber}
                    </span>
                  ) : (
                    <span className='text-xs text-gray-400'>-</span>
                  )}
                </div>

                <div className='flex justify-center'>
                  <span className={`pill-badge text-xs font-semibold inline-block ${
                    item.payment 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-300' 
                      : 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-300'
                  }`}>
                    {item.payment ? 'Online' : 'CASH'}
                  </span>
                </div>

                <p className='text-center text-gray-600 font-medium text-sm'>
                  {item.actualPatient && !item.actualPatient.isSelf 
                    ? item.actualPatient.age 
                    : calculateAge(item.userData.dob)}
                </p>

                <p className='text-left text-gray-700 font-medium text-sm'>
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>

                <p className='text-right font-bold text-gray-800 text-sm'>{currency}{item.amount}</p>

                <div className='flex items-center justify-center gap-2'>
                  <button
                    onClick={() => setSelectedAppointment(item)}
                    className='px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ripple'
                    title="View Details & Reports"
                  >
                    View
                  </button>
                  {item.cancelled ? (
                    <span className='pill-badge bg-red-100 text-red-700 border border-red-300 text-xs'>Cancelled</span>
                  ) : item.isCompleted ? (
                    <span className='pill-badge bg-green-100 text-green-700 border border-green-300 text-xs'>Completed</span>
                  ) : (
                    <div className='flex gap-2'>
                      <button 
                        onClick={() => cancelAppointment(item._id)} 
                        className='p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-300'
                        title="Cancel"
                      >
                        <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => completeAppointment(item._id)} 
                        className='p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-all duration-300'
                        title="Complete"
                      >
                        <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            </>
          )}
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

    </div>
  )
}

export default DoctorAppointments