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
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-5'>
        {doctors.map((item, index) => (
          <div className='border border-white rounded-2xl overflow-hidden cursor-pointer group bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition'>
            <div className='relative'>
              <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 w-full h-48 object-cover' src={item.image} alt="" />
              <span className={`absolute top-3 left-3 text-[11px] px-2 py-1 rounded-full ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.available ? 'Available' : 'Offline'}</span>
            </div>
            <div className='p-4'>
              <p className='text-[#262626] text-base font-semibold'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <div className='mt-3 flex items-center justify-between text-sm'>
                <label className='flex items-center gap-2'>
                  <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                  <span>Toggle</span>
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