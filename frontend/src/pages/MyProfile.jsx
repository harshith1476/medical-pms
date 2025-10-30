import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const MyProfile = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const { token, backendUrl, userData, setUserData, loadUserProfileData, setToken } = useContext(AppContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        setToken(false)
        toast.success('Logged out successfully!')
        navigate('/login')
    }

    // Function to update user profile data using API
    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return userData ? (
        <div className='relative z-50 max-w-4xl mx-auto pt-8 pb-16'>
            {/* Animated Profile Styles */}
            <style>{`
                @keyframes pulse-ring {
                    0% {
                        transform: scale(0.95);
                        opacity: 1;
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                    }
                    50% {
                        transform: scale(1.05);
                        opacity: 0.8;
                        box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
                    }
                    100% {
                        transform: scale(0.95);
                        opacity: 1;
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                    }
                }
                
                @keyframes rotate-ring {
                    0% {
                        transform: rotate(0deg);
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.5;
                    }
                    100% {
                        transform: rotate(360deg);
                        opacity: 0.3;
                    }
                }
                
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }
                
                .animate-pulse-ring {
                    animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                .animate-rotate-ring {
                    animation: rotate-ring 8s linear infinite;
                }
                
                .animate-shimmer {
                    background: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.3) 50%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 3s infinite;
                }
            `}</style>
            {/* Profile Card Container */}
            <div className='relative z-50 bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-white/50'>
                {/* Profile Header with Gradient */}
                <div className='bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 px-8 py-12 relative'>
                    <div className='absolute inset-0 bg-black/10'></div>
                    
                    {/* Profile Picture Section */}
                    <div className='relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6'>
                        {isEdit ? (
                            <label htmlFor='image' className='cursor-pointer group relative'>
                                <div className='relative'>
                                    <img 
                                        className='w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-2xl object-cover group-hover:opacity-90 transition-opacity' 
                                        src={image ? URL.createObjectURL(image) : userData.image} 
                                        alt="Profile" 
                                    />
                                    <div className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" accept="image/*" hidden />
                            </label>
                        ) : (
                            <div className='relative'>
                                {/* Animated Profile Picture with Pulsing Ring */}
                                <div className='relative'>
                                    {/* Outer Pulsing Ring */}
                                    <div className='absolute inset-0 rounded-full animate-pulse-ring'></div>
                                    {/* Middle Ring */}
                                    <div className='absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/30 via-blue-400/30 to-purple-400/30 animate-rotate-ring'></div>
                                    {/* Profile Image */}
                                    <img 
                                        className='relative w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-2xl object-cover z-10 transition-all duration-300 hover:scale-105' 
                                        src={userData.image} 
                                        alt="Profile" 
                                    />
                                </div>
                                {/* Online Status Indicator - Better Aligned */}
                                <div className='absolute bottom-0 right-0 z-20 flex items-center justify-center'>
                                    <div className='bg-green-500 border-4 border-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg animate-pulse'>
                                        <div className='w-5 h-5 bg-white rounded-full animate-ping absolute'></div>
                                        <div className='w-3 h-3 bg-green-400 rounded-full relative z-10'></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className='flex-1 text-white pb-4'>
                            {isEdit ? (
                                <input 
                                    className='bg-white/20 backdrop-blur-sm text-3xl sm:text-4xl font-bold text-white placeholder-white/70 border-2 border-white/30 rounded-lg px-4 py-2 w-full sm:w-auto focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all' 
                                    type="text" 
                                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} 
                                    value={userData.name}
                                    placeholder="Your Name"
                                />
                            ) : (
                                <h1 className='text-3xl sm:text-4xl font-bold mb-2'>{userData.name}</h1>
                            )}
                            <p className='text-blue-100 text-lg'>Patient Account</p>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className='relative z-50 px-8 py-8 bg-white'>
                    {/* Contact Information Card */}
                    <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='bg-blue-500 p-2 rounded-lg'>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className='text-xl font-bold text-gray-800'>CONTACT INFORMATION</h2>
                        </div>

                        <div className='space-y-4'>
                            <div className='flex items-start gap-4'>
                                <div className='bg-white p-3 rounded-lg shadow-sm'>
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm text-gray-500 mb-1'>Email Address</p>
                                    <p className='text-blue-600 font-medium'>{userData.email}</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='bg-white p-3 rounded-lg shadow-sm'>
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm text-gray-500 mb-1'>Phone Number</p>
                                    {isEdit ? (
                                        <input 
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all' 
                                            type="tel" 
                                            onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
                                            value={userData.phone}
                                        />
                                    ) : (
                                        <p className='text-blue-600 font-medium'>{userData.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='bg-white p-3 rounded-lg shadow-sm'>
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm text-gray-500 mb-1'>Address</p>
                                    {isEdit ? (
                                        <div className='space-y-2'>
                                            <input 
                                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all' 
                                                type="text" 
                                                placeholder="Street Address"
                                                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                                                value={userData.address.line1} 
                                            />
                                            <input 
                                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all' 
                                                type="text" 
                                                placeholder="City, State, ZIP"
                                                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                                                value={userData.address.line2} 
                                            />
                                        </div>
                                    ) : (
                                        <p className='text-gray-700 font-medium'>
                                            {userData.address.line1 || userData.address.line2 
                                                ? `${userData.address.line1} ${userData.address.line2}`.trim() 
                                                : 'No address provided'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information Card */}
                    <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border border-purple-100 shadow-sm'>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='bg-purple-500 p-2 rounded-lg'>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className='text-xl font-bold text-gray-800'>BASIC INFORMATION</h2>
            </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='flex items-start gap-4'>
                                <div className='bg-white p-3 rounded-lg shadow-sm'>
                                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm text-gray-500 mb-1'>Gender</p>
                                    {isEdit ? (
                                        <select 
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white' 
                                            onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} 
                                            value={userData.gender}
                                        >
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                        </select>
                                    ) : (
                                        <p className='text-gray-700 font-medium'>{userData.gender}</p>
                                    )}
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='bg-white p-3 rounded-lg shadow-sm'>
                                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm text-gray-500 mb-1'>Date of Birth</p>
                                    {isEdit ? (
                                        <input 
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white' 
                                            type='date' 
                                            onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} 
                                            value={userData.dob}
                                        />
                                    ) : (
                                        <p className='text-gray-700 font-medium'>{userData.dob === 'Not Selected' ? 'Not Selected' : new Date(userData.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Section */}
                    <div className='bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200'>
                        <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Quick Actions
                        </h3>
                        <div className='flex flex-col sm:flex-row gap-3'>
                            <button 
                                onClick={() => navigate('/my-appointments')}
                                className='flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2'
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                My Appointments
                            </button>
                            <button 
                                onClick={handleLogout}
                                className='flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2'
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col sm:flex-row gap-4 justify-end'>
                        {isEdit ? (
                            <>
                                <button 
                                    onClick={() => { setIsEdit(false); setImage(false); loadUserProfileData(); }} 
                                    className='px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300'
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={updateUserProfileData} 
                                    className='px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2'
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => setIsEdit(true)} 
                                className='px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2'
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) : null
}

export default MyProfile