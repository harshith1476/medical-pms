import React, { useState } from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className='text-center mb-16'>
        <h1 className='text-5xl font-light text-gray-800 mb-4'>
          CONTACT <span className='font-semibold text-blue-600'>MEDI-CHAIN+</span>
        </h1>
        <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
      </div>

      <div className='flex flex-col lg:flex-row gap-16 items-center'>
        {/* Image Section with Elegant Frame */}
        <div className='w-full lg:w-2/5 relative'>
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img 
              className='w-full h-[500px] object-cover transform transition-all duration-700 hover:scale-105' 
              src={assets.contact_image} 
              alt="MediaChain Office" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 border-4 border-blue-400 opacity-30 rounded-lg"></div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 border-4 border-blue-400 opacity-30 rounded-lg"></div>
        </div>

        {/* Contact Information */}
        <div className='w-full lg:w-3/5'>
          <div className="mb-10">
            <h2 className='text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200'>OUR OFFICE</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className='text-gray-700 font-medium'>Address</p>
                  <p className='text-gray-600'>54/09 Hi-Tech City<br />234-120-09, Hyderabad, Telangana</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <p className='text-gray-700 font-medium'>Phone</p>
                  <p className='text-gray-600'>+91 6319497466</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className='text-gray-700 font-medium'>Email</p>
                  <p className='text-gray-600'>Medichain+123@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Careers Section */}
          <div className="pt-8 border-t border-gray-200">
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>CAREERS AT MEDIACHAIN+</h2>
            <p className='text-gray-600 mb-6'>Learn more about our teams and job openings. Join us in revolutionizing healthcare technology.</p>
            <button 
              className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none"
            >
              View Open Positions
            </button>
          </div>
        </div>
      </div>

      {/* Additional Contact Section */}
      <div className="mt-24 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">GET IN TOUCH</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
            Have questions about our services or want to learn more about how MediaChain can transform your healthcare experience? Reach out to us.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Your Message" 
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-300 focus:outline-none">
                  Send Message
                </button>
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Connect with us</h3>
              <div className="space-y-4">
                <p className="text-gray-600">Follow us on social media to stay updated with the latest news and developments.</p>
                
                <div className="flex space-x-4 pt-4">
                  {[
                    { name: 'Facebook', icon: '📘' },
                    { name: 'Twitter', icon: '🐦' },
                    { name: 'LinkedIn', icon: '👔' },
                    { name: 'Instagram', icon: '📸' }
                  ].map((social) => (
                    <div key={social.name} className="bg-gray-100 p-4 rounded-full cursor-pointer hover:bg-blue-100 transition-colors flex items-center justify-center w-12 h-12">
                      <span className="text-lg">{social.icon}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Business Hours</h4>
                  <p className="text-gray-600">Monday - Friday: 9am - 5pm</p>
                  <p className="text-gray-600">Saturday: 10am - 2pm</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact