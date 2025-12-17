import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, changeAvailability , aToken , getAllDoctors} = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
        getAllDoctors()
    }
}, [aToken])

  return (
    <div className='w-full bg-white p-4 sm:p-4 mobile-safe-area pb-6'>
        <h1 className='text-base sm:text-lg font-medium mb-3 sm:mb-4'>All Doctors</h1>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'>
        {doctors.map((item, index) => (
          <div key={index} className='border border-gray-200 rounded-xl overflow-hidden cursor-pointer group bg-white shadow-sm hover:shadow-md transition w-full'>
            <div className='relative flex items-center justify-center pt-6 pb-4'>
              <div className='relative'>
                <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-full border-4 border-white shadow-lg' src={item.image} alt="" />
                <span className={`absolute top-0 right-0 text-xs px-2 py-1 rounded-full font-medium ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.available ? 'Available' : 'Offline'}</span>
              </div>
            </div>
            <div className='p-4'>
              <p className='text-[#262626] text-base font-semibold mb-1'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm mb-3'>{item.speciality}</p>
              <div className='flex items-center justify-between'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} className='cursor-pointer w-4 h-4' />
                  <span className='text-sm text-gray-700'>Toggle</span>
                </label>
                <span className='text-xs text-gray-400'>ID: {index+1}</span>
              </div>
            </div>
          </div>
        ))}
        </div>
    </div>
  )
}

export default DoctorsList