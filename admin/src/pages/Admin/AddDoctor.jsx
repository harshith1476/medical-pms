import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import GlassCard from '../../components/ui/GlassCard'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const { backendUrl } = useContext(AppContext)
    const { aToken, doctors, getAllDoctors } = useContext(AdminContext)

    useEffect(() => {
        if (aToken) {
            getAllDoctors()
        }
    }, [aToken])

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
                setExperience('1 Year')
                setSpeciality('General physician')
                getAllDoctors() // Refresh doctors list
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Get recently added doctors (last 3)
    const recentDoctors = doctors && doctors.length > 0 
        ? [...doctors].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
        : []

    // Calculate experience preview
    const getExperiencePreview = () => {
        const years = parseInt(experience) || 1
        if (years >= 10) return `${years} Years — Senior Specialist`
        if (years >= 5) return `${years} Years — Experienced Professional`
        if (years >= 3) return `${years} Years — Skilled Practitioner`
        return `${years} Year — Junior Doctor`
    }

    return (
        <div className='w-full min-h-full bg-white flex flex-col lg:flex-row mobile-safe-area'>
            <div className='flex flex-col lg:flex-row flex-1 gap-0 items-stretch min-h-full'>
                {/* Main Form Container */}
                <div className='flex-1 w-full p-4 sm:p-4 lg:p-4'>
                    <h2 className='text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2'>
                        <div className='bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-1.5'>
                            <svg className='w-5 h-5 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        Add New Doctor
                    </h2>

                    <form onSubmit={onSubmitHandler}>
                        <GlassCard className="p-3 sm:p-4">
                            <div className='h-0.5 w-full bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 rounded-full mb-3 sm:mb-4 opacity-60'></div>
                            
                            {/* Image Upload Section */}
                            <div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-4 sm:mb-5'>
                                <label htmlFor="doc-img" className='cursor-pointer group flex-shrink-0'>
                                    <div className='relative'>
                                        <img 
                                            className='w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full object-cover ring-2 ring-indigo-200 group-hover:ring-indigo-400 transition-all shadow-lg' 
                                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
                                            alt="Doctor" 
                                        />
                                        {docImg && (
                                            <div className='absolute inset-0 bg-green-500/20 rounded-full flex items-center justify-center'>
                                                <svg className='w-5 h-5 sm:w-6 sm:h-6 text-green-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </label>
                                <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden accept="image/*" />
                                <div className='text-center sm:text-left'>
                                    <p className='text-sm sm:text-base font-semibold text-gray-700'>Upload Doctor Picture</p>
                                    <p className='text-[10px] sm:text-xs text-gray-500'>Click to select or drag & drop</p>
                                </div>
                            </div>

                            {/* Form Grid */}
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-gray-700'>
                                {/* Left Column */}
                                <div className='w-full flex flex-col gap-3'>
                                    <div className='flex-1 flex flex-col gap-1.5'>
                                        <label className='text-xs font-semibold text-gray-600'>Doctor Name</label>
                                        <input 
                                            onChange={e => setName(e.target.value)} 
                                            value={name} 
                                            className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/50' 
                                            type="text" 
                                            placeholder='Enter full name' 
                                            required 
                                        />
                                    </div>

                                    <div className='flex-1 flex flex-col gap-1.5'>
                                        <label className='text-xs font-semibold text-gray-600'>Email Address</label>
                                        <input 
                                            onChange={e => setEmail(e.target.value)} 
                                            value={email} 
                                            className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/50' 
                                            type="email" 
                                            placeholder='doctor@example.com' 
                                            required 
                                        />
                                    </div>

                                    <div className='flex-1 flex flex-col gap-1.5'>
                                        <label className='text-xs font-semibold text-gray-600'>Password</label>
                                        <input 
                                            onChange={e => setPassword(e.target.value)} 
                                            value={password} 
                                            className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/50' 
                                            type="password" 
                                            placeholder='Minimum 8 characters' 
                                            required 
                                            minLength={8}
                                        />
                                    </div>

                                    <div className='flex-1 flex flex-col gap-2'>
                                        <label className='text-sm font-semibold text-gray-600'>Experience</label>
                                        <select 
                                            onChange={e => setExperience(e.target.value)} 
                                            value={experience} 
                                            className='border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/50'
                                        >
                                            <option value="1 Year">1 Year</option>
                                            <option value="2 Year">2 Years</option>
                                            <option value="3 Year">3 Years</option>
                                            <option value="4 Year">4 Years</option>
                                            <option value="5 Year">5 Years</option>
                                            <option value="6 Year">6 Years</option>
                                            <option value="8 Year">8 Years</option>
                                            <option value="9 Year">9 Years</option>
                                            <option value="10 Year">10 Years</option>
                                        </select>
                                        {experience && (
                                            <p className='text-xs text-indigo-600 font-medium mt-1 flex items-center gap-1'>
                                                <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {getExperiencePreview()}
                                            </p>
                                        )}
                                    </div>

                                    <div className='flex-1 flex flex-col gap-2'>
                                        <label className='text-sm font-semibold text-gray-600'>Consultation Fees</label>
                                        <input 
                                            onChange={e => setFees(e.target.value)} 
                                            value={fees} 
                                            className='border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/50' 
                                            type="number" 
                                            placeholder='₹ 500' 
                                            required 
                                            min="0"
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className='w-full flex flex-col gap-5'>
                                    <div className='flex-1 flex flex-col gap-2'>
                                        <label className='text-sm font-semibold text-gray-600'>Speciality</label>
                                        <select 
                                            onChange={e => setSpeciality(e.target.value)} 
                                            value={speciality} 
                                            className='border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/50'
                                        >
                                            <option value="General physician">General Physician</option>
                                            <option value="Gynecologist">Gynecologist</option>
                                            <option value="Dermatologist">Dermatologist</option>
                                            <option value="Pediatricians">Pediatrician</option>
                                            <option value="Neurologist">Neurologist</option>
                                            <option value="Gastroenterologist">Gastroenterologist</option>
                                        </select>
                                    </div>

                                    <div className='flex-1 flex flex-col gap-2'>
                                        <label className='text-sm font-semibold text-gray-600'>Medical Degree</label>
                                        <input 
                                            onChange={e => setDegree(e.target.value)} 
                                            value={degree} 
                                            className='border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/50' 
                                            type="text" 
                                            placeholder='e.g., MBBS, MD, MS' 
                                            required 
                                        />
                                    </div>

                                    <div className='flex-1 flex flex-col gap-2'>
                                        <label className='text-sm font-semibold text-gray-600'>Address</label>
                                        <input 
                                            onChange={e => setAddress1(e.target.value)} 
                                            value={address1} 
                                            className='border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/50 mb-2' 
                                            type="text" 
                                            placeholder='Street Address' 
                                            required 
                                        />
                                        <input 
                                            onChange={e => setAddress2(e.target.value)} 
                                            value={address2} 
                                            className='border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/50' 
                                            type="text" 
                                            placeholder='City, State, ZIP' 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* About Doctor */}
                            <div className='mt-6'>
                                <label className='text-sm font-semibold text-gray-600 mb-2 block'>About Doctor</label>
                                <textarea 
                                    onChange={e => setAbout(e.target.value)} 
                                    value={about} 
                                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/50 resize-none' 
                                    rows={5} 
                                    placeholder="Write about the doctor's background, expertise, and achievements..."
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type='submit' 
                                className='mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 px-10 py-3 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2 w-full justify-center'
                            >
                                <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Doctor to System
                            </button>
                        </GlassCard>
                    </form>
                </div>

                {/* Right Sidebar - Preview & Guidelines */}
                <div className='w-full lg:w-96 flex-shrink-0 p-4 sm:p-6 lg:sticky lg:top-24 lg:h-fit'>
                    <GlassCard className="p-6">
                        <div className='mb-6'>
                            <h3 className='text-xl font-bold text-gray-800 mb-2 flex items-center gap-2'>
                                <svg className='w-6 h-6 text-indigo-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Doctor Preview & Guidelines
                            </h3>
                            <div className='h-1 w-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full'></div>
                        </div>

                        {/* Quick Instructions */}
                        <div className='mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100'>
                            <h4 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                                <svg className='w-5 h-5 text-indigo-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Quick Instructions
                            </h4>
                            <ul className='space-y-2 text-sm text-gray-600'>
                                <li className='flex items-start gap-2'>
                                    <span className='text-indigo-600 font-bold'>•</span>
                                    <span>Upload a clear professional photo</span>
                                </li>
                                <li className='flex items-start gap-2'>
                                    <span className='text-indigo-600 font-bold'>•</span>
                                    <span>Fill all required fields accurately</span>
                                </li>
                                <li className='flex items-start gap-2'>
                                    <span className='text-indigo-600 font-bold'>•</span>
                                    <span>Use a strong password (min 8 chars)</span>
                                </li>
                                <li className='flex items-start gap-2'>
                                    <span className='text-indigo-600 font-bold'>•</span>
                                    <span>Verify email format before submission</span>
                                </li>
                            </ul>
                        </div>

                        {/* Live Preview */}
                        {(name || speciality || docImg) && (
                            <div className='mb-6 p-4 bg-white/50 rounded-xl border border-gray-200'>
                                <h4 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                                    <svg className='w-5 h-5 text-purple-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Live Preview
                                </h4>
                                <div className='space-y-3'>
                                    {docImg && (
                                        <img 
                                            src={URL.createObjectURL(docImg)} 
                                            alt="Preview" 
                                            className='w-20 h-20 rounded-full object-cover border-2 border-indigo-300 mx-auto'
                                        />
                                    )}
                                    {name && (
                                        <p className='text-center font-semibold text-gray-800'>{name}</p>
                                    )}
                                    {speciality && (
                                        <p className='text-center text-sm text-gray-600'>{speciality}</p>
                                    )}
                                    {experience && (
                                        <p className='text-center text-xs text-indigo-600 font-medium'>{getExperiencePreview()}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Stats Cards */}
                        <div className='space-y-4'>
                            <div className='p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm text-gray-600'>Total Doctors</p>
                                        <p className='text-2xl font-bold text-indigo-600'>{doctors?.length || 0}</p>
                                    </div>
                                    <div className='bg-indigo-500 rounded-full p-3'>
                                        <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className='p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm text-gray-600'>Active Doctors</p>
                                        <p className='text-2xl font-bold text-purple-600'>
                                            {doctors?.filter(doc => doc.available).length || 0}
                                        </p>
                                    </div>
                                    <div className='bg-purple-500 rounded-full p-3'>
                                        <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Recently Added Doctors */}
                            {recentDoctors.length > 0 && (
                                <div className='p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100'>
                                    <h4 className='font-semibold text-gray-800 mb-3 text-sm'>Recently Added</h4>
                                    <div className='space-y-2'>
                                        {recentDoctors.map((doc, idx) => (
                                            <div key={idx} className='flex items-center gap-2 text-sm'>
                                                <img src={doc.image} alt={doc.name} className='w-8 h-8 rounded-full object-cover' />
                                                <div className='flex-1 min-w-0'>
                                                    <p className='font-medium text-gray-800 truncate'>{doc.name}</p>
                                                    <p className='text-xs text-gray-500 truncate'>{doc.speciality}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    )
}

export default AddDoctor
