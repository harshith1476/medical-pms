import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Icon colors based on category
  const getIconColor = (path) => {
    if (path.includes('dashboard')) return 'text-blue-500'
    if (path.includes('appointment')) return 'text-purple-500'
    if (path.includes('doctor') || path.includes('add-doctor')) return 'text-green-500'
    if (path.includes('job')) return 'text-orange-500'
    return 'text-gray-600'
  }

  const MenuItem = ({ to, icon, label, iconColor, neonColor = '#6F2CFF', textColor = 'blue' }) => {
    const isActive = location.pathname === to
    
    // Get active text color based on menu item
    const getActiveTextColor = () => {
      if (textColor === 'blue') return 'text-blue-700'
      if (textColor === 'purple') return 'text-purple-700'
      if (textColor === 'green') return 'text-green-700'
      if (textColor === 'indigo') return 'text-indigo-700'
      return 'text-blue-700'
    }
    
    const getHoverTextColor = () => {
      if (textColor === 'blue') return 'group-hover:text-blue-600'
      if (textColor === 'purple') return 'group-hover:text-purple-600'
      if (textColor === 'green') return 'group-hover:text-green-600'
      if (textColor === 'indigo') return 'group-hover:text-indigo-600'
      return 'group-hover:text-blue-600'
    }
    
    return (
      <NavLink
        to={to}
        className={`
          group relative flex items-center gap-3 py-3.5 px-4 lg:px-6 w-full
          cursor-pointer transition-all duration-300
          ${isActive 
            ? 'bg-gradient-to-r from-blue-50/80 via-cyan-50/80 to-purple-50/80 border-r-4 shadow-lg hover-lift' 
            : 'hover:bg-white/30 hover:shadow-md hover-lift'
          }
        `}
        style={isActive ? {
          borderRightColor: neonColor,
          boxShadow: `0 0 20px ${neonColor}40`
        } : {}}
      >
        {/* Neon accent bar with animation */}
        {isActive && (
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full neon-accent"
            style={{
              background: `linear-gradient(180deg, ${neonColor}, ${neonColor}80)`,
              boxShadow: `0 0 10px ${neonColor}60`
            }}
          />
        )}
        
        {/* Hover glow effect */}
        <div className={`
          absolute inset-0 rounded-r-xl 
          ${iconColor || 'bg-blue-500/0'} 
          opacity-0 group-hover:opacity-10 
          transition-opacity duration-300
          blur-xl
        `} />
        
        <div 
          className={`
            min-w-5 transition-all duration-300 relative z-10
            ${isActive ? 'icon-glow' : ''}
            ${iconColor || getIconColor(to)}
          `}
        >
          {icon}
        </div>
        <p className={`
          font-medium transition-colors duration-300 relative z-10
          ${isActive ? getActiveTextColor() + ' font-semibold' : 'text-gray-700 ' + getHoverTextColor()}
        `}>
          {label}
        </p>
      </NavLink>
    )
  }

  const MenuList = () => (
    <>
      {aToken && (
        <ul className='text-[#515151] mt-5 space-y-1'>
          <MenuItem
            to='/admin-dashboard'
            icon={<img className='w-5 h-5' src={assets.home_icon} alt='' />}
            label='Dashboard'
            iconColor='text-blue-500'
            neonColor='#007BFF'
          />
          <MenuItem
            to='/all-appointments'
            icon={<img className='w-5 h-5' src={assets.appointment_icon} alt='' />}
            label='Appointments'
            iconColor='text-purple-500'
            neonColor='#6F2CFF'
          />
          <MenuItem
            to='/add-doctor'
            icon={<img className='w-5 h-5' src={assets.add_icon} alt='' />}
            label='Add Doctor'
            iconColor='text-green-500'
            neonColor='#21C47B'
          />
          <MenuItem
            to='/doctor-list'
            icon={<img className='w-5 h-5' src={assets.people_icon} alt='' />}
            label='Doctors List'
            iconColor='text-green-500'
            neonColor='#21C47B'
          />
          <MenuItem
            to='/job-applications'
            icon={
              <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11s1.343 3 3 3 3-1.343 3-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19v-1a4 4 0 014-4h0a4 4 0 014 4v1" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 5h4M18 3v4" />
              </svg>
            }
            label='Job Applications'
            iconColor='text-orange-500'
            neonColor='#FF8C42'
          />
          <MenuItem
            to='/specialty-helpline'
            icon={
              <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
            label='Specialty Helpline'
            iconColor='text-teal-500'
            neonColor='#14B8A6'
          />
        </ul>
      )}

      {dToken && (
        <ul className='text-[#515151] mt-5 space-y-1'>
          <MenuItem
            to='/doctor-dashboard'
            icon={
              <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'inherit' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
            label='Dashboard'
            iconColor='text-blue-500'
            neonColor='#007BFF'
            textColor='blue'
          />
          <MenuItem
            to='/doctor-appointments'
            icon={
              <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'inherit' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label='Appointments'
            iconColor='text-purple-500'
            neonColor='#6F2CFF'
            textColor='purple'
          />
          <MenuItem
            to='/queue-management'
            icon={
              <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'inherit' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
            label='Queue Management'
            iconColor='text-green-500'
            neonColor='#21C47B'
            textColor='green'
          />
          <MenuItem
            to='/doctor-profile'
            icon={
              <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'inherit' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            label='Profile'
            iconColor='text-indigo-600'
            neonColor='#4F46E5'
            textColor='indigo'
          />
        </ul>
      )}
    </>
  )

  return (
    <>
      {/* Mobile Menu Button - Fixed in header area */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className='fixed top-3 left-3 z-[1001] lg:hidden bg-white/95 backdrop-blur-xl p-2.5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all'
        aria-label="Toggle menu"
        style={{ height: '40px', width: '40px' }}
      >
        <svg className='w-6 h-6 text-gray-700' fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: Always visible, Mobile: Drawer */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        min-h-screen bg-gradient-to-b from-white/50 to-white/30 backdrop-blur-2xl border-r border-white/40 shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 lg:w-[260px]
      `}>
        <MenuList />
      </div>
    </>
  )
}

export default Sidebar
