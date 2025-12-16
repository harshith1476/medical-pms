import React from 'react'
import { assets } from '../assets/assets'
import BackButton from '../components/BackButton'

const About = () => {
  return (
    <div className="page-container fade-in">
      {/* Back Button */}
      <div className='mb-6'>
        <BackButton to="/" label="Back to Home" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='section-title'>
            About <span className='text-cyan-500'>MediChain+</span>
          </h1>
          <p className='section-subtitle max-w-2xl mx-auto'>
            Revolutionizing healthcare through modern technology and patient-centric solutions
          </p>
        </div>

        {/* Main Content */}
        <div className='card mb-8'>
          <div className='flex flex-col lg:flex-row gap-8 p-6 lg:p-8'>
            {/* Image Section */}
            <div className='lg:w-2/5 flex-shrink-0'>
              <div className='relative overflow-hidden rounded-xl'>
                <img 
                  className='w-full h-auto object-cover' 
                  src={assets.about_image} 
                  alt="MediChain+ Healthcare" 
                />
              </div>
            </div>
            
            {/* Content Section */}
            <div className='flex-1 space-y-4 text-gray-600'>
              <p className='leading-relaxed'>
                Welcome to MediChain+, where we're transforming healthcare through innovation and technology. 
                We understand the critical importance of secure, accessible, and seamless healthcare services in today's digital world.
              </p>
              
              <p className='leading-relaxed'>
                MediChain+ is committed to revolutionizing healthcare by putting patients first. 
                Our platform ensures your health data remains secure, your appointments are hassle-free, 
                and you have easy access to trusted healthcare providers when you need them most.
              </p>
              
              <div className='pt-4'>
                <h3 className='text-lg font-bold text-gray-800 mb-2'>Our Vision</h3>
                <p className='leading-relaxed'>
                  We envision a future where healthcare is accessible to everyone, data flows seamlessly 
                  between patients and providers, and technology enhances the healing process rather than 
                  complicating it.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Highlights */}
        <div className='card p-6 lg:p-8 mb-8'>
          <h2 className='text-xl font-bold text-gray-800 text-center mb-8'>
            Our <span className='text-cyan-500'>Technology</span>
          </h2>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 hover:shadow-lg transition-shadow'>
              <div className='text-4xl mb-4'>🔒</div>
              <h3 className='font-semibold text-gray-800 mb-2'>Secure Platform</h3>
              <p className='text-gray-600 text-sm'>
                Enterprise-grade security protecting your health data with encryption and secure protocols.
              </p>
            </div>
            
            <div className='text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-lg transition-shadow'>
              <div className='text-4xl mb-4'>⚡</div>
              <h3 className='font-semibold text-gray-800 mb-2'>Smart Scheduling</h3>
              <p className='text-gray-600 text-sm'>
                Intelligent appointment management for seamless booking and rescheduling.
              </p>
            </div>
            
            <div className='text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 hover:shadow-lg transition-shadow'>
              <div className='text-4xl mb-4'>🌐</div>
              <h3 className='font-semibold text-gray-800 mb-2'>Connected Care</h3>
              <p className='text-gray-600 text-sm'>
                Unified system connecting patients with healthcare providers across the network.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className='text-center mb-8'>
          <h2 className='text-xl font-bold text-gray-800 mb-2'>
            Why Choose <span className='text-cyan-500'>MediChain+</span>
          </h2>
          <p className='text-gray-600'>Experience the future of healthcare management</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          <div className='card p-6 text-center hover:shadow-xl transition-shadow'>
            <div className='text-3xl mb-3'>🔐</div>
            <h3 className='font-semibold text-gray-800 mb-2'>Data Privacy</h3>
            <p className='text-gray-600 text-sm'>
              You control your health data. Secure access management ensures only authorized providers see your records.
            </p>
          </div>
          
          <div className='card p-6 text-center hover:shadow-xl transition-shadow'>
            <div className='text-3xl mb-3'>🔄</div>
            <h3 className='font-semibold text-gray-800 mb-2'>Seamless Experience</h3>
            <p className='text-gray-600 text-sm'>
              From booking to consultation, enjoy a smooth healthcare journey with our intuitive platform.
            </p>
          </div>
          
          <div className='card p-6 text-center hover:shadow-xl transition-shadow'>
            <div className='text-3xl mb-3'>⚡</div>
            <h3 className='font-semibold text-gray-800 mb-2'>Instant Access</h3>
            <p className='text-gray-600 text-sm'>
              Quick access to healthcare providers, appointment scheduling, and medical records anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
