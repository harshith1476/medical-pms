import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { SkeletonCard } from './LoadingSpinner'

const TopDoctors = () => {

    const navigate = useNavigate()
    const { doctors, isDoctorsLoading } = useContext(AppContext)

    // Sort doctors: Available first, then unavailable
    const sortedDoctors = [...doctors].sort((a, b) => {
        if (a.available === b.available) return 0
        return a.available ? -1 : 1
    })

    return (
        <div className='py-12 px-4 sm:px-6 lg:px-8'>
            {/* Section Header */}
            <div className='text-center mb-8'>
                <h2 className='section-title'>Top Doctors to Book</h2>
                <p className='section-subtitle max-w-xl mx-auto'>
                    Simply browse through our extensive list of trusted doctors and book your appointment hassle-free.
                </p>
            </div>

            {/* Loading State */}
            {isDoctorsLoading ? (
                <div className='doctors-grid'>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : (
                <>
                    {/* Doctor Cards Grid - Circular Profile Design */}
                    <div className='top-doctors-grid'>
                        {sortedDoctors.slice(0, 8).map((item, index) => (
                            <div 
                                onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0) }} 
                                className='top-doctor-card group slide-in-up'
                                key={index}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {/* Circular Profile Picture Container */}
                                <div className='top-doctor-image-wrapper'>
                                    <div className='top-doctor-image-container'>
                                        <img 
                                            className='top-doctor-image' 
                                            src={item.image} 
                                            alt={item.name} 
                                        />
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className='top-doctor-content'>
                                    <h3 className='top-doctor-name'>
                                        {item.name}
                                    </h3>
                                    <p className='top-doctor-specialty'>{item.speciality}</p>
                                    {item.experience && (
                                        <p className='top-doctor-experience'>
                                            {item.experience} Year{item.experience !== 1 ? 's' : ''} Experience
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View More Button */}
                    <div className='flex justify-center mt-8'>
                        <button 
                            onClick={() => navigate('/doctors')} 
                            className='btn btn-secondary btn-lg group'
                        >
                            View All Doctors
                            <svg className='w-5 h-5 transform group-hover:translate-x-1 transition-transform' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default TopDoctors
