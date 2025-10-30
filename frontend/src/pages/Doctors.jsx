import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div className='pb-8'>
      {/* Page Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
          Browse Doctors by Specialty
        </h1>
        <p className='text-gray-600 text-lg'>Find the perfect healthcare professional for your needs</p>
      </div>

      <div className='flex flex-col sm:flex-row items-start gap-6 mt-6'>
        {/* Enhanced Sidebar Filter */}
        <div className='w-full sm:w-64 flex-shrink-0'>
          <button 
            onClick={() => setShowFilter(!showFilter)} 
            className={`w-full py-3 px-4 border-2 rounded-xl text-sm font-semibold transition-all sm:hidden mb-4 ${
              showFilter 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/50' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-cyan-400 hover:text-cyan-600'
            }`}
          >
            {showFilter ? 'Hide Filters' : 'Show Filters'} 
            <span className='ml-2'>{showFilter ? '▲' : '▼'}</span>
          </button>
          
          <div className={`flex-col gap-3 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
            <div className='bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-lg'>
              <h3 className='text-sm font-bold text-gray-800 mb-3 flex items-center gap-2'>
                <svg className='w-4 h-4 text-cyan-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter by Specialty
              </h3>
              
              {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map((spec) => {
                const isActive = speciality === spec
                return (
                  <div
                    key={spec}
                    onClick={() => spec === speciality ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
                    className={`group relative mb-2 pl-4 py-3 pr-4 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 transform scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700 hover:shadow-md border border-transparent hover:border-cyan-200'
                    }`}
                  >
                    {isActive && (
                      <div className='absolute inset-0 bg-white/20 animate-shimmer'></div>
                    )}
                    <div className='relative flex items-center gap-3'>
                      <div className={`w-2 h-2 rounded-full transition-all ${isActive ? 'bg-white' : 'bg-cyan-500 group-hover:scale-150'}`}></div>
                      <span className='font-medium text-sm'>{spec}</span>
                      {isActive && (
                        <svg className='w-4 h-4 ml-auto animate-bounce-in' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Doctor Cards Grid */}
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filterDoc.map((item, index) => (
            <div
              onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
              className='group doctor-card bg-white rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative'
              key={index}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Overlay on Hover */}
              <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-500 z-10 pointer-events-none'></div>
              
              {/* Image Container with Overlay */}
              <div className='relative overflow-hidden bg-gradient-to-br from-cyan-100 to-blue-100 h-64'>
                <img 
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700' 
                  src={item.image} 
                  alt={item.name} 
                />
                {/* Availability Badge */}
                <div className='absolute top-4 right-4 z-20'>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg ${
                    item.available 
                      ? 'bg-green-500/90 text-white' 
                      : 'bg-gray-500/90 text-white'
                  }`}>
                    <div className={`relative w-2 h-2 ${item.available ? 'bg-white' : 'bg-gray-200'}`}>
                      {item.available && (
                        <>
                          <div className='absolute inset-0 bg-white rounded-full animate-ping'></div>
                          <div className='absolute inset-0 bg-white rounded-full animate-pulse'></div>
                        </>
                      )}
                    </div>
                    <span className='text-xs font-semibold'>{item.available ? 'Available' : 'Not Available'}</span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className='p-5 relative z-10 bg-white'>
                <h3 className='text-xl font-bold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors duration-300'>
                  {item.name}
                </h3>
                <div className='flex items-center gap-2 mb-3'>
                  <svg className='w-4 h-4 text-cyan-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className='text-gray-600 text-sm font-medium'>{item.speciality}</p>
                </div>
                
                {/* Hover Effect Arrow */}
                <div className='flex items-center text-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2'>
                  <span className='text-sm font-semibold mr-2'>Book Appointment</span>
                  <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

              {/* Shine Effect */}
              <div className='absolute inset-0 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        .doctor-card {
          animation: fadeInUp 0.6s ease-out both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Doctors