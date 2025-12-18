import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()
    const [isHovered, setIsHovered] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ 
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className='relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl px-6 sm:px-10 md:px-14 lg:px-16 my-20 md:mx-10 overflow-hidden group'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
            
            {/* Grid pattern background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-grid-pattern bg-center bg-cover"></div>
            </div>

            <div className='relative z-10 flex flex-col lg:flex-row items-center'>
                {/* ------- Left Content ------- */}
                <div className='flex-1 py-10 md:py-16 lg:py-20 transform transition-transform duration-700'
                    style={{
                        transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
                    }}
                >
                    <div className='text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6'>
                        <h1 className='mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-md'>
                            Book Appointment
                        </h1>
                        <h2 className='bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent drop-shadow-md'>
                            With 100+ Trusted Doctors
                        </h2>
                    </div>
                    
                    <p className='text-blue-100 text-base md:text-lg max-w-xl leading-relaxed mb-6'>
                        Connect with verified healthcare professionals through our secure blockchain platform.
                    </p>
                    
                    <div className='flex items-center gap-4 flex-wrap'>
                        {['HIPAA Compliant', 'Instant Booking', '24/7 Support'].map((feature, index) => (
                            <div key={index} className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                <span className="text-green-300 mr-2">✓</span>
                                <span className="text-white text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ------- Right Image (Even Larger Size) ------- */}
                <div className='w-full lg:w-1/2 relative mt-8 lg:mt-0 lg:pl-12'
                    style={{
                        transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`
                    }}
                >
                    <div className="relative w-full h-full flex justify-center items-center">
                        <img 
                            className='w-full max-w-lg lg:max-w-xl xl:max-w-2xl transform transition-transform duration-1000 group-hover:scale-105' 
                            src={assets.appointment_img} 
                            alt="Doctor appointment" 
                            style={{ 
                                maxHeight: '400px',
                                objectFit: 'contain'
                            }}
                        />
                        
                        {/* Floating medical badges - repositioned for larger image */}
                        <div className='absolute top-12 -left-4 lg:-left-6 w-20 h-20 rounded-2xl bg-blue-400/20 backdrop-blur-sm border border-blue-300/30 animate-float flex items-center justify-center shadow-lg'>
                            <span className="text-blue-300 text-3xl">❤️</span>
                        </div>
                        <div className='absolute bottom-24 -right-4 lg:-right-6 w-18 h-18 rounded-2xl bg-green-400/20 backdrop-blur-sm border border-green-300/30 animate-float flex items-center justify-center shadow-lg' style={{animationDelay: '1s'}}>
                            <span className="text-green-300 text-2xl">🩺</span>
                        </div>
                        <div className='absolute top-1/2 -left-6 lg:-left-8 w-16 h-16 rounded-2xl bg-purple-400/20 backdrop-blur-sm border border-purple-300/30 animate-float flex items-center justify-center shadow-lg' style={{animationDelay: '2s'}}>
                            <span className="text-purple-300 text-xl">💊</span>
                        </div>
                        <div className='absolute bottom-12 right-12 w-14 h-14 rounded-2xl bg-yellow-400/20 backdrop-blur-sm border border-yellow-300/30 animate-float flex items-center justify-center shadow-lg' style={{animationDelay: '1.5s'}}>
                            <span className="text-yellow-300 text-lg">🏥</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/20"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/20"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/20"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/20"></div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(5deg); }
                }
                
                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-shine {
                    animation: shine 1.5s ease-in-out;
                }
                
                .bg-grid-pattern {
                    background-image: url("data:image/svg+xml,%3csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0 0h100v100H0z' fill='none'/%3e%3cpath d='M0 0v100M20 0v100M40 0v100M60 0v100M80 0v100M100 0v100 M0 0h100M0 20h100M0 40h100M0 60h100M0 80h100M0 100h100' stroke='%23FFFFFF' stroke-width='0.5' stroke-opacity='0.2' fill='none'/%3e%3c/svg%3e");
                }
            `}</style>
        </div>
    )
}

export default Banner