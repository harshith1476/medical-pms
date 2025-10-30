import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const blockchainRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!blockchainRef.current) return;

    const blockchainElement = blockchainRef.current;
    const blocks = blockchainElement.querySelectorAll('.blockchain-block');
    
    blocks.forEach((block, index) => {
      block.style.animationDelay = `${index * 0.3}s`;
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 overflow-hidden">

      {/* Animated Header Section */}
      <div className='text-center pt-16 pb-8'>
        <div className={`relative inline-block ${isVisible ? 'animate-float' : 'opacity-0'}`}>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>
            ABOUT <span className='text-primary'>MEDICHAIN+</span>
          </h1>
          <div className="absolute -inset-4 bg-blue-50 rounded-full blur-lg opacity-30 -z-10"></div>
        </div>
        <p className='text-gray-600 max-w-2xl mx-auto mt-4'>
          Revolutionizing healthcare through blockchain technology and decentralized patient data management
        </p>
      </div>

      {/* Blockchain Connection Animation */}
      <div ref={blockchainRef} className="blockchain-animation hidden md:flex justify-center items-center my-8">
        {[...Array(5)].map((_, i) => (
          <React.Fragment key={i}>
            <div className="blockchain-block bg-primary/20 h-4 w-4 rounded-full animate-pulse"></div>
            {i < 4 && <div className="blockchain-connection h-1 w-16 bg-gradient-to-r from-primary/40 to-primary/20"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Main Content with Staggered Animation */}
      <div ref={sectionRef} className='my-12 flex flex-col md:flex-row gap-12 items-center'>
        <div className={`w-full md:max-w-[400px] rounded-lg overflow-hidden relative ${isVisible ? 'animate-fadeInLeft' : 'opacity-0'}`}>
          <img className='w-full transform transition-all duration-700 hover:scale-105' src={assets.about_image} alt="MediChain+ Healthcare Technology" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-700'>
          <p className={isVisible ? 'animate-fadeInRight delay-100' : 'opacity-0'}>
            Welcome to MediChain+, where we're transforming healthcare through the power of blockchain technology. 
            We understand the critical importance of secure, accessible, and interoperable health data in today's digital world.
          </p>
          
          <p className={isVisible ? 'animate-fadeInRight delay-200' : 'opacity-0'}>
            MediChain+ is committed to revolutionizing healthcare by putting patients in control of their medical records. 
            Our decentralized platform ensures your health data remains secure, private, and easily accessible to authorized providers when you need care most.
          </p>
          
          <b className='text-gray-800 text-lg mt-4'>Our Vision</b>
          <p className={isVisible ? 'animate-fadeInRight delay-300' : 'opacity-0'}>
            We envision a future where healthcare data flows seamlessly between patients and providers while maintaining the highest standards of security and privacy. 
            MediChain+ aims to eliminate data silos and create a unified, patient-centric healthcare ecosystem.
          </p>
        </div>
      </div>

      {/* Animated Technology Highlights */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 my-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary/5 rounded-full"></div>
        
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8 relative z-10">
          OUR <span className="text-primary">TECHNOLOGY</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
            <div className="text-primary text-2xl mb-4 animate-pulse">🔒</div>
            <h3 className="font-semibold text-gray-800 mb-2">Blockchain Security</h3>
            <p className="text-gray-600 text-sm">Immutable, encrypted health records stored on a decentralized network for maximum security.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
            <div className="text-primary text-2xl mb-4 animate-pulse" style={{animationDelay: '0.2s'}}>⚡</div>
            <h3 className="font-semibold text-gray-800 mb-2">Smart Contracts</h3>
            <p className="text-gray-600 text-sm">Automated permission management for seamless and secure data sharing between providers.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
            <div className="text-primary text-2xl mb-4 animate-pulse" style={{animationDelay: '0.4s'}}>🌐</div>
            <h3 className="font-semibold text-gray-800 mb-2">Interoperability</h3>
            <p className="text-gray-600 text-sm">Universal standards that allow different healthcare systems to work together seamlessly.</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='text-center my-16'>
        <h2 className='text-2xl font-semibold text-gray-800'>
          WHY CHOOSE <span className='text-primary'>MEDICHAIN+</span>
        </h2>
        <p className='text-gray-600 mt-2 mb-8'>Experience the future of healthcare data management</p>
      </div>

      {/* 3D Card Effect Section */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-20'>
        <div className="perspective">
          <div className='border border-gray-200 rounded-xl p-8 flex flex-col gap-5 bg-white transform transition-all duration-500 hover:-translate-y-2 card-3d'>
            <div className="text-3xl text-primary">🔐</div>
            <b className='text-gray-800'>DATA SOVEREIGNTY</b>
            <p className='text-gray-600'>You own your health data. Control who accesses your medical records with our permission-based blockchain system.</p>
          </div>
        </div>
        
        <div className="perspective">
          <div className='border border-gray-200 rounded-xl p-8 flex flex-col gap-5 bg-white transform transition-all duration-500 hover:-translate-y-2 card-3d'>
            <div className="text-3xl text-primary">🔄</div>
            <b className='text-gray-800'>SEAMLESS INTEROPERABILITY</b>
            <p className='text-gray-600'>Break down data silos. Our system connects healthcare providers across different networks and institutions.</p>
          </div>
        </div>
        
        <div className="perspective">
          <div className='border border-gray-200 rounded-xl p-8 flex flex-col gap-5 bg-white transform transition-all duration-500 hover:-translate-y-2 card-3d'>
            <div className="text-3xl text-primary">⚡</div>
            <b className='text-gray-800'>INSTANT ACCESS</b>
            <p className='text-gray-600'>Critical health information available immediately to authorized providers in emergencies, saving crucial time.</p>
          </div>
        </div>
      </div>

      {/* Animated Blockchain Background Element */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-5 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-4 h-4 border border-primary/30 rounded-sm"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `floatBlock 15s infinite linear`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes floatBlock {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fadeInLeft {
          animation: fadeInLeft 1s forwards;
        }
        
        .animate-fadeInRight {
          animation: fadeInRight 1s forwards;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        .perspective {
          perspective: 1000px;
        }
        
        .card-3d {
          transform-style: preserve-3d;
        }
        
        .card-3d:hover {
          transform: translateY(-10px) rotateX(5deg) rotateY(-5deg);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
        }
        
        .blockchain-animation {
          opacity: 0;
          animation: fadeIn 1s forwards;
          animation-delay: 0.5s;
        }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default About