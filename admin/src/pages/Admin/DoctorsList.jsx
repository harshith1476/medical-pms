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
    <div className='w-full min-h-full bg-white p-3 sm:p-4'>
        <h1 className='text-base sm:text-lg font-medium mb-2 sm:mb-3'>All Doctors</h1>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3'>
        {doctors.map((item, index) => (
          <div key={index} className='border border-gray-200 rounded-lg overflow-hidden cursor-pointer group bg-white shadow-sm hover:shadow-md transition'>
            <div className='relative'>
              <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 w-full h-32 sm:h-36 object-cover' src={item.image} alt="" />
              <span className={`absolute top-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded-full ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.available ? 'Available' : 'Offline'}</span>
            </div>
            <div className='p-2.5 sm:p-3'>
              <p className='text-[#262626] text-sm font-semibold truncate'>{item.name}</p>
              <p className='text-[#5C5C5C] text-xs truncate'>{item.speciality}</p>
              <div className='mt-2 flex items-center justify-between text-xs'>
                <label className='flex items-center gap-1.5 cursor-pointer'>
                  <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} className='cursor-pointer' />
                  <span>Toggle</span>
                </label>
                <span className='text-[10px] text-gray-400'>ID: {index+1}</span>
              </div>
            </div>
          </div>
        ))}
        </div>
    </div>
  )
}

export default DoctorsList