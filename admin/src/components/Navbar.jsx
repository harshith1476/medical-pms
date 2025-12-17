import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import BrandLogo from './BrandLogo'

const Navbar = () => {
  const { dToken, setDToken, profileData, getProfileData } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch doctor profile data if not already loaded
  useEffect(() => {
    if (dToken && !profileData) {
      getProfileData()
    }
  }, [dToken, profileData, getProfileData])

  // Handle scroll for blur effect - only apply to main content area, not window
  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.querySelector('.main-content-area')
      if (mainContent) {
        setScrolled(mainContent.scrollTop > 10)
      }
    }
    
    // Use a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const mainContent = document.querySelector('.main-content-area')
      if (mainContent) {
        mainContent.addEventListener('scroll', handleScroll)
      }
    }, 100)
    
    return () => {
      clearTimeout(timeoutId)
      const mainContent = document.querySelector('.main-content-area')
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  // Get doctor/admin name and photo
  const adminName = aToken ? 'Admin User' : (dToken && profileData) ? profileData.name : 'User'
  const adminPhoto = aToken 
    ? 'https://ui-avatars.com/api/?name=' + encodeURIComponent(adminName) + '&background=667eea&color=fff&size=128'
    : (dToken && profileData && profileData.image) 
      ? profileData.image 
      : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(adminName) + '&background=667eea&color=fff&size=128'

  return (
    <div 
      className={`sticky top-0 z-20 flex justify-between items-center px-4 sm:px-4 lg:px-8 py-2.5 border-b border-white/30 transition-all duration-300 header ${
        scrolled 
          ? 'bg-white/95 shadow-lg' 
          : 'bg-white/90 shadow-sm'
      }`}
      style={{
        WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'blur(4px)',
        backdropFilter: scrolled ? 'blur(8px)' : 'blur(4px)',
        height: '64px',
        minHeight: '64px',
        maxHeight: '64px'
      }}
    >
      <div className='flex items-center gap-2 sm:gap-3'>
        {/* Official MediChain Logo */}
        <div className='flex items-center'>
          <BrandLogo 
            size="medium" 
            variant="header" 
            clickable={true}
            className="mr-1 sm:mr-2"
          />
        </div>
        <div className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-cyan-100 to-purple-100 border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in'>
          <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50' />
          <p className='text-[10px] sm:text-xs font-semibold text-gray-700'>{aToken ? 'Admin' : 'Doctor'}</p>
        </div>
      </div>

      <div className='flex items-center gap-2 sm:gap-3'>
        {/* Admin/Doctor Photo + Name Badge */}
        <div className='flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group hover-lift'>
          <img
            src={adminPhoto}
            alt={aToken ? 'Admin' : 'Doctor'}
            className='w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-blue-500/30 group-hover:ring-blue-500/60 transition-all duration-300 shadow-md'
          />
          <div className='hidden md:block'>
            <p className='text-xs font-semibold text-gray-800'>{adminName}</p>
            <p className='text-[9px] text-gray-500 font-medium'>{aToken ? 'Administrator' : 'Doctor'}</p>
          </div>
        </div>

        {/* Premium Gradient Logout Button */}
        <button
          onClick={logout}
          className='ripple relative bg-gradient-to-r from-[#6F2CFF] via-[#8B5CF6] to-[#E94057] text-white text-xs sm:text-sm px-3 sm:px-5 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold overflow-hidden group'
        >
          <span className='relative z-10 flex items-center gap-1.5'>
            <svg className='w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className='hidden sm:inline'>Logout</span>
          </span>
        </button>
      </div>
    </div>
  )
}

export default Navbar
