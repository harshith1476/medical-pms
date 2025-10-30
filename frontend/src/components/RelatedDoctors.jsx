import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({ speciality, docId }) => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)
    const [relDoc, setRelDoc] = useState([])
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelDoc(doctorsData)
        }
    }, [doctors, speciality, docId])

    useEffect(() => {
        // Trigger animation when component mounts
        setIsVisible(true)
    }, [])

    if (relDoc.length === 0) {
        return null // Don't render if no related doctors
    }

    return (
        <div className={`flex flex-col items-center gap-6 my-20 text-gray-800 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-center">
                <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    Related Doctors
                </h1>
                <p className='max-w-2xl text-gray-600 mt-3 text-sm md:text-base'>
                    Discover other trusted specialists in the same field who can provide excellent care.
                </p>
            </div>
            
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6 px-4 sm:px-0'>
                {relDoc.map((item, index) => (
                    <div 
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} 
                        className='group bg-white border border-blue-100 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative'
                        key={index}
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        {/* Availability Badge */}
                        <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-medium ${item.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {item.available ? 'Available' : 'Not Available'}
                        </div>
                        
                        {/* Doctor Image */}
                        <div className='h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden relative'>
                            <img 
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700' 
                                src={item.image} 
                                alt={item.name} 
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        
                        {/* Doctor Info */}
                        <div className='p-5'>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                <span className={`text-xs ${item.available ? 'text-green-600' : 'text-gray-500'}`}>
                                    {item.available ? 'Available today' : 'Check availability'}
                                </span>
                            </div>
                            
                            <h3 className='text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300'>
                                {item.name}
                            </h3>
                            <p className='text-blue-600 font-medium text-sm mt-1'>{item.speciality}</p>
                            
                            {/* Rating and Experience (if available) */}
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                {item.experience && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                        </svg>
                                        {item.experience}+ years
                                    </span>
                                )}
                            </div>
                            
                            {/* CTA Button */}
                            <button className="w-full mt-4 bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-300 group-hover:bg-blue-100 group-hover:text-blue-700">
                                Book Appointment
                            </button>
                        </div>
                        
                        {/* Hover effect border */}
                        <div className="absolute inset-0 border-2 border-blue-200 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                ))}
            </div>
            
            {/* View More Button (commented out but enhanced) */}
            {/* <button className='bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 px-8 py-3 rounded-full mt-8 font-medium hover:from-blue-100 hover:to-purple-100 transition-all duration-300 hover:shadow-lg border border-blue-200'>
                View More Specialists
            </button> */}
        </div>
    )
}

export default RelatedDoctors