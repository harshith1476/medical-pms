import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <nav className='sticky top-0 z-[100] bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 w-full'>
      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-12'>
        <div className='flex items-center justify-between py-2.5'>
          
          {/* Logo Section */}
          <div 
            onClick={() => navigate('/')} 
            className='flex items-center cursor-pointer group'
          >
            <img className='h-9 w-auto transition-transform duration-300 group-hover:scale-105' src={assets.logo} alt="MediChain Logo" />
          </div>

          {/* Desktop Navigation */}
          <ul className='hidden lg:flex items-center gap-1'>
            <li>
              <NavLink 
                to='/' 
                className={({ isActive }) => 
                  `nav-link group px-4 py-1.5 rounded-lg font-semibold text-sm transition-all duration-300 relative inline-block ${
                    isActive 
                      ? 'text-cyan-600 bg-cyan-50 active' 
                      : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                  }`
                }
              >
                HOME
                <span className='nav-link-line absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100'></span>
        </NavLink>
            </li>
            <li>
              <NavLink 
                to='/doctors' 
                className={({ isActive }) => 
                  `nav-link group px-4 py-1.5 rounded-lg font-semibold text-sm transition-all duration-300 relative inline-block ${
                    isActive 
                      ? 'text-cyan-600 bg-cyan-50 active' 
                      : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                  }`
                }
              >
                ALL DOCTORS
                <span className='nav-link-line absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100'></span>
        </NavLink>
            </li>
            <li>
              <NavLink 
                to='/about' 
                className={({ isActive }) => 
                  `nav-link group px-4 py-1.5 rounded-lg font-semibold text-sm transition-all duration-300 relative inline-block ${
                    isActive 
                      ? 'text-cyan-600 bg-cyan-50 active' 
                      : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                  }`
                }
              >
                ABOUT
                <span className='nav-link-line absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100'></span>
        </NavLink>
            </li>
            <li>
              <NavLink 
                to='/contact' 
                className={({ isActive }) => 
                  `nav-link group px-4 py-1.5 rounded-lg font-semibold text-sm transition-all duration-300 relative inline-block ${
                    isActive 
                      ? 'text-cyan-600 bg-cyan-50 active' 
                      : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                  }`
                }
              >
                CONTACT
                <span className='nav-link-line absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100'></span>
        </NavLink>
            </li>
      </ul>

          {/* Right Side Actions */}
          <div className='flex items-center gap-4'>
            {token && userData ? (
              <div className='relative'>
                {/* Profile Avatar - Direct Navigation */}
                <div 
                  onClick={() => navigate('/my-profile')}
                  className='flex items-center gap-2 cursor-pointer group px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200'
                  title="View Profile"
                >
                  <div className='relative'>
                    {/* Animated Profile Picture */}
                    <div className='relative'>
                      <div className='absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/40 via-blue-400/40 to-purple-400/40 animate-spin-slow blur-sm'></div>
                      <img 
                        className='relative w-9 h-9 rounded-full ring-2 ring-cyan-400/30 group-hover:ring-cyan-400/60 transition-all duration-300 object-cover z-10' 
                        src={userData.image} 
                        alt="Profile" 
                      />
                    </div>
                    {/* Online Status - Better Aligned */}
                    <div className='absolute bottom-0 right-0 z-20 flex items-center justify-center'>
                      <div className='bg-green-500 border-2 border-white rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-md'>
                        <div className='w-2 h-2 bg-green-300 rounded-full animate-pulse'></div>
                      </div>
                    </div>
                  </div>
                  <svg 
                    className="w-4 h-4 text-gray-600 transition-transform duration-200 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className='hidden md:flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-2 rounded-full font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300'
              >
                <span>Create account</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMenu(true)}
              className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
              aria-label="Menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

            {/* Mobile Menu Overlay */}
            {showMenu && (
              <>
                <div 
                  className='fixed inset-0 bg-black/50 z-[9998] lg:hidden backdrop-blur-sm' 
                  onClick={() => setShowMenu(false)}
                ></div>
                <div className='fixed top-0 right-0 bottom-0 w-80 bg-white z-[9999] lg:hidden shadow-2xl transform transition-transform duration-300 ease-in-out'>
            <div className='flex items-center justify-between px-6 py-6 border-b border-gray-200'>
              <div className='flex items-center'>
                <img src={assets.logo} className='h-8 w-auto' alt="" />
              </div>
              <button 
                onClick={() => setShowMenu(false)}
                className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
                aria-label="Close"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className='px-6 py-6'>
              {token && userData && (
                <div className='mb-6 pb-6 border-b border-gray-200'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='relative'>
                      <img className='w-12 h-12 rounded-full ring-2 ring-cyan-400/30 object-cover relative z-10' src={userData.image} alt="" />
                      <div className='absolute bottom-0 right-0 z-20'>
                        <div className='bg-green-500 border-2 border-white rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-sm'>
                          <div className='w-2 h-2 bg-green-300 rounded-full animate-pulse'></div>
                        </div>
                      </div>
                    </div>
                    <div className='flex-1'>
                      <p className='font-semibold text-gray-900'>{userData.name}</p>
                      <div className='flex items-center gap-2 mt-0.5'>
                        <div className='relative'>
                          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                          <div className='absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75'></div>
                        </div>
                        <p className='text-xs text-gray-500 font-medium'>Online</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <ul className='flex flex-col gap-2'>
                <li>
                  <NavLink 
                    onClick={() => setShowMenu(false)} 
                    to='/' 
                    className={({ isActive }) => 
                      `block px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        isActive 
                          ? 'text-cyan-600 bg-cyan-50' 
                          : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    HOME
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    onClick={() => setShowMenu(false)} 
                    to='/doctors' 
                    className={({ isActive }) => 
                      `block px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        isActive 
                          ? 'text-cyan-600 bg-cyan-50' 
                          : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    ALL DOCTORS
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    onClick={() => setShowMenu(false)} 
                    to='/about' 
                    className={({ isActive }) => 
                      `block px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        isActive 
                          ? 'text-cyan-600 bg-cyan-50' 
                          : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    ABOUT
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    onClick={() => setShowMenu(false)} 
                    to='/contact' 
                    className={({ isActive }) => 
                      `block px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        isActive 
                          ? 'text-cyan-600 bg-cyan-50' 
                          : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    CONTACT
                  </NavLink>
                </li>
              </ul>

              {token && userData ? (
                <div className='mt-6 pt-6 border-t border-gray-200 space-y-2'>
                  <button 
                    onClick={() => { navigate('/my-profile'); setShowMenu(false); }} 
                    className='w-full px-4 py-3 rounded-lg text-left font-semibold text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    My Profile
                  </button>
                  <button 
                    onClick={() => { navigate('/my-appointments'); setShowMenu(false); }} 
                    className='w-full px-4 py-3 rounded-lg text-left font-semibold text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    My Appointments
                  </button>
                  <button 
                    onClick={() => { logout(); setShowMenu(false); }} 
                    className='w-full px-4 py-3 rounded-lg text-left font-semibold text-red-600 hover:bg-red-50 transition-colors'
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { navigate('/login'); setShowMenu(false); }} 
                  className='mt-6 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300'
                >
                  Create account
                </button>
              )}
      </div>
    </div>
        </>
      )}
    </nav>
  )
}

export default Navbar