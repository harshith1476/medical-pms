import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({ speciality, docId }) => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)
    const [relDoc, setRelDoc] = useState([])

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            // Sort: Available doctors first, then unavailable
            doctorsData.sort((a, b) => {
                if (a.available === b.available) return 0
                return a.available ? -1 : 1
            })
            setRelDoc(doctorsData)
        }
    }, [doctors, speciality, docId])

    if (relDoc.length === 0) {
        return null
    }

    return (
        <div className='py-12 mt-8 fade-in'>
            {/* Section Header */}
            <div className='text-center mb-8'>
                <h2 className='section-title'>Related Doctors</h2>
                <p className='section-subtitle max-w-xl mx-auto'>
                    Discover other trusted {speciality} specialists who can provide excellent care.
                </p>
            </div>

            {/* Doctor Cards Grid */}
            <div className='doctors-grid'>
                {relDoc.slice(0, 4).map((item, index) => (
                    <div 
                        onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0) }} 
                        className='doctor-card slide-in-up'
                        key={index}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {/* Image Container */}
                        <div className='relative overflow-hidden'>
                            <img 
                                className='doctor-card-image' 
                                src={item.image} 
                                alt={item.name} 
                            />
                            {/* Availability Badge */}
                            <div className='absolute top-2 right-2'>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${
                                    item.available 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                    {item.available ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className='doctor-card-content'>
                            <h3 className='doctor-card-name'>
                                {item.name}
                            </h3>
                            <p className='doctor-card-specialty'>{item.speciality}</p>
                            
                            {/* Experience if available */}
                            {item.experience && (
                                <p className='doctor-card-experience' style={{ marginTop: 'auto', paddingTop: '8px' }}>
                                    Experience: {item.experience} Year{item.experience !== 1 ? 's' : ''}
                                </p>
                            )}
                            
                            {/* Book Appointment Button */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/appointment/${item._id}`);
                                    window.scrollTo(0, 0);
                                }}
                                className='w-full mt-3 py-2 px-3 bg-gradient-to-r from-[#007BFF] to-[#41D6C3] text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1.5'
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
        </div>
    )
}

export default RelatedDoctors
