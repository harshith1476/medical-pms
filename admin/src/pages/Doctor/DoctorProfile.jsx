import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {

        try {

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div className='w-full bg-white p-4 sm:p-4 lg:p-6 animate-fade-in-up mobile-safe-area pb-6'>
            <div className='flex flex-col lg:flex-row gap-4 lg:gap-6'>
                {/* Profile Picture Section */}
                <div className='w-full lg:w-72 flex-shrink-0'>
                    <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5 lg:sticky lg:top-24'>
                        <div className='relative mx-auto w-40 h-40 mb-5'>
                            <img 
                                className='w-full h-full object-cover rounded-full border-2 border-gray-200' 
                                src={profileData.image} 
                                alt={profileData.name}
                            />
                            <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
                                profileData.available ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                        </div>
                        <div className='text-center'>
                            <h2 className='text-xl font-bold text-gray-900 mb-1'>{profileData.name}</h2>
                            <p className='text-sm text-gray-600'>{profileData.degree}</p>
                            {profileData.available && (
                                <p className='text-xs text-green-600 mt-1 font-medium'>Available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Doctor Details Section */}
                <div className='flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6'>
                    {/* Header with Edit Button */}
                    <div className='flex items-center justify-between mb-5 pb-3 border-b border-gray-200'>
                        <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>Profile Information</h1>
                        <button
                            onClick={() => setIsEdit(!isEdit)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                isEdit
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {isEdit ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    {/* Specialization & Experience Badges */}
                    <div className='flex flex-wrap gap-2 mb-5'>
                        <span className='px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-300 rounded text-xs font-medium'>
                            {profileData.speciality}
                        </span>
                        <span className='px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-300 rounded text-xs font-medium'>
                            {profileData.experience} Experience
                        </span>
                        <span className='px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-300 rounded text-xs font-medium'>
                            {profileData.degree}
                        </span>
                    </div>

                    {/* Divider */}
                    <div className='h-px bg-gray-200 mb-5'></div>

                    {/* About Section */}
                    <div className='mb-5'>
                        <h3 className='text-base font-semibold text-gray-900 mb-3'>About Doctor</h3>
                        {isEdit ? (
                            <textarea 
                                onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} 
                                className='w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white resize-none text-sm' 
                                rows={5} 
                                value={profileData.about}
                                placeholder="Write about your medical background, expertise, and achievements..."
                            />
                        ) : (
                            <p className='text-gray-700 leading-relaxed px-3 py-2.5 bg-gray-50 rounded-md border border-gray-200 text-sm'>
                                {profileData.about || 'No information provided yet.'}
                            </p>
                        )}
                    </div>

                    {/* Divider */}
                    <div className='h-px bg-gray-200 mb-5'></div>

                    {/* Appointment Fee */}
                    <div className='mb-5'>
                        <h3 className='text-base font-semibold text-gray-900 mb-3'>Appointment Fee</h3>
                        {isEdit ? (
                            <input 
                                type='number' 
                                onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} 
                                value={profileData.fees}
                                className='w-full max-w-xs px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-sm'
                                placeholder="Enter consultation fee"
                            />
                        ) : (
                            <p className='text-xl font-bold text-gray-900 px-3 py-2.5 bg-gray-50 rounded-md border border-gray-200 inline-block'>
                                {currency} {profileData.fees}
                            </p>
                        )}
                    </div>

                    {/* Divider */}
                    <div className='h-px bg-gray-200 mb-5'></div>

                    {/* Address Section */}
                    <div className='mb-5'>
                        <h3 className='text-base font-semibold text-gray-900 mb-3'>Address</h3>
                        {isEdit ? (
                            <div className='space-y-2.5'>
                                <input 
                                    type='text' 
                                    onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                                    value={profileData.address.line1}
                                    className='w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-sm'
                                    placeholder="Street Address, Locality"
                                />
                                <input 
                                    type='text' 
                                    onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                                    value={profileData.address.line2}
                                    className='w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-sm'
                                    placeholder="City, State, Pincode"
                                />
                            </div>
                        ) : (
                            <div className='px-3 py-2.5 bg-gray-50 rounded-md border border-gray-200'>
                                <p className='text-gray-700 text-sm font-medium'>{profileData.address.line1}</p>
                                {profileData.address.line2 && (
                                    <p className='text-gray-600 text-sm mt-1'>{profileData.address.line2}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Availability Toggle */}
                    <div className='mb-5'>
                        <h3 className='text-base font-semibold text-gray-900 mb-3'>Availability Status</h3>
                        <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-200'>
                            <label className='relative inline-flex items-center cursor-pointer'>
                                <input 
                                    type="checkbox" 
                                    onChange={async (e) => {
                                        const newAvailable = e.target.checked
                                        setProfileData(prev => ({ ...prev, available: newAvailable }))
                                        
                                        // Auto-save availability
                                        try {
                                            const updateData = {
                                                address: profileData.address,
                                                fees: profileData.fees,
                                                about: profileData.about,
                                                available: newAvailable
                                            }
                                            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })
                                            if (data.success) {
                                                toast.success('Availability updated')
                                            } else {
                                                toast.error(data.message)
                                                // Revert on error
                                                setProfileData(prev => ({ ...prev, available: !newAvailable }))
                                            }
                                        } catch (error) {
                                            toast.error(error.message)
                                            // Revert on error
                                            setProfileData(prev => ({ ...prev, available: !newAvailable }))
                                        }
                                    }} 
                                    checked={profileData.available}
                                    className='sr-only peer'
                                />
                                <div className={`w-12 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all cursor-pointer ${
                                    profileData.available ? 'bg-green-500' : 'bg-gray-300'
                                }`}></div>
                            </label>
                            <div>
                                <p className='font-medium text-sm text-gray-900'>
                                    {profileData.available ? 'Currently Available' : 'Currently Unavailable'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    {isEdit && (
                        <button 
                            onClick={updateProfile} 
                            className='w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile