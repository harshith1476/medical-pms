import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import BackButton from '../components/BackButton'
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner'
import AppointmentBookingModal from '../components/AppointmentBookingModal'

const Doctors = () => {

  const { speciality: specialityParam } = useParams()
  const speciality = specialityParam ? decodeURIComponent(specialityParam) : null

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [patientData, setPatientData] = useState(null)
  const navigate = useNavigate();

  const { doctors, isDoctorsLoading } = useContext(AppContext)

  const specialties = [
    'General physician', 
    'Gynecologist', 
    'Dermatologist', 
    'Pediatricians', 
    'Neurologist', 
    'Gastroenterologist'
  ]

  const applyFilter = () => {
    let filteredDocs = []
    if (speciality) {
      filteredDocs = doctors.filter(doc => doc.speciality === speciality)
    } else {
      filteredDocs = [...doctors]
    }
    
    // Sort: Available doctors first, then unavailable doctors
    filteredDocs.sort((a, b) => {
      if (a.available === b.available) return 0
      return a.available ? -1 : 1
    })
    
    setFilterDoc(filteredDocs)
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div className='page-container fade-in'>
      {/* Back Button */}
      <div className='mb-6'>
        <BackButton to="/" label="Back to Home" />
      </div>

      {/* Professional Page Header */}
      <div className='mb-6 pb-4 border-b border-gray-200'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-1'>
              {speciality ? `${speciality} Specialists` : 'All Doctors'}
            </h1>
            <p className='text-sm text-gray-600'>
              {speciality 
                ? `Find experienced ${speciality.toLowerCase()} specialists`
                : 'Browse our directory of verified medical professionals'
              }
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1.5 px-3 py-1.5 bg-white rounded border border-gray-200'>
              <svg className='w-4 h-4 text-green-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className='text-xs font-medium text-gray-700'>Verified</span>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Sidebar Filter */}
        <div className='w-full lg:w-64 flex-shrink-0'>
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setShowFilter(!showFilter)} 
            className='w-full flex items-center justify-between py-2 px-3 bg-white border border-gray-300 rounded-md text-sm font-medium transition-colors lg:hidden mb-3 hover:bg-gray-50'
          >
            <span className='flex items-center gap-2 text-gray-700'>
              <svg className='w-4 h-4 text-gray-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {showFilter ? 'Hide Filters' : 'Filter by Specialty'}
            </span>
            <svg 
              className={`w-4 h-4 text-gray-600 transition-transform ${showFilter ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Filter Panel - Professional Design */}
          <div className={`${showFilter ? 'block' : 'hidden'} lg:block`}>
            <div className='bg-white rounded-lg border border-gray-200'>
              <div className='px-4 py-3 border-b border-gray-200'>
                <h3 className='text-sm font-semibold text-gray-900'>Specialty</h3>
              </div>
              <div className='p-2 space-y-0.5'>
                {/* All Doctors Option */}
                <button
                  onClick={() => navigate('/doctors')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    !speciality
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Doctors
                </button>

                {specialties.map((spec) => {
                  const isActive = speciality === spec
                  return (
                    <button
                      key={spec}
                      onClick={() => navigate(`/doctors/${spec}`)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {spec}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className='flex-1 min-w-0'>
          {isDoctorsLoading ? (
            <div className='doctors-grid'>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filterDoc.length === 0 ? (
            <div className='empty-state card'>
              <svg className='empty-state-icon' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className='empty-state-title'>No Doctors Found</h3>
              <p className='empty-state-text'>
                {speciality 
                  ? `No ${speciality} specialists are currently available.` 
                  : 'No doctors are currently available.'
                }
              </p>
            </div>
          ) : (
            <>
              {/* Results Count - Professional Style */}
              <div className='mb-4 flex items-center gap-2'>
                <p className='text-sm font-medium text-gray-700'>
                  <span className='text-blue-600 font-semibold'>{filterDoc.length}</span> {filterDoc.length !== 1 ? 'doctors' : 'doctor'} found
                </p>
              </div>

              {/* Doctor Cards */}
              <div className='doctors-grid w-full'>
                {filterDoc.map((item, index) => (
                  <div
                    onClick={() => {
                      setSelectedDoctor(item)
                      setShowBookingModal(true)
                    }}
                    className='doctor-card slide-in-up'
                    key={index}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Image Container - Card Type */}
                    <div className='relative p-3 pb-0'>
                      <div className='relative rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'>
                        <img 
                          className='doctor-card-image' 
                          src={item.image} 
                          alt={item.name} 
                        />
                        {/* Availability Badge */}
                        <div className='absolute top-2 right-2'>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            item.available 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-400 text-white'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full bg-white`}></span>
                            {item.available ? 'Available' : 'Busy'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className='doctor-card-content'>
                      <div className='mb-2'>
                        <h3 className='doctor-card-name'>
                          {item.name}
                        </h3>
                        <div className='flex items-center gap-1.5 mt-1'>
                          <p className='doctor-card-specialty'>{item.speciality}</p>
                          <svg className='w-3.5 h-3.5 text-blue-600 flex-shrink-0' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                      </div>
                      
                      {item.experience && (
                        <div className='mb-2'>
                          <div className='inline-flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 border border-amber-300 rounded'>
                            <div className='flex items-center justify-center w-3.5 h-3.5 rounded-full bg-amber-500'>
                              <svg className='w-2 h-2 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className='text-[10px] font-semibold text-amber-900'>
                              {item.experience} {item.experience !== 1 ? 'Yrs' : 'Yr'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Book Appointment Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctor(item);
                          setShowBookingModal(true);
                        }}
                        className='w-full mt-auto py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-1.5'
                      >
                        <svg className='w-3.5 h-3.5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Appointment Booking Modal */}
      {selectedDoctor && (
        <AppointmentBookingModal
          doctor={selectedDoctor}
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedDoctor(null)
            setPatientData(null)
          }}
          onProceed={(docId, patientInfo) => {
            setPatientData(patientInfo)
            // Store patient data in sessionStorage to pass to Appointment page
            sessionStorage.setItem('appointmentPatientData', JSON.stringify(patientInfo))
            navigate(`/appointment/${docId}`)
            window.scrollTo(0, 0)
          }}
        />
      )}
    </div>
  )
}

export default Doctors
