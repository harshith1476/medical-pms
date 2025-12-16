import React from 'react'
import { specialityData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const SpecialityMenu = () => {
    const navigate = useNavigate()

    const handleSpecialityClick = (speciality) => {
        navigate(`/doctors/${speciality}`)
        window.scrollTo(0, 0)
    }

    return (
        <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-[#262626]'>
            <h1 className='text-2xl font-medium'>Find by Speciality</h1>
            <p className='sm:w-1/3 text-center text-xs'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
            <div className='flex flex-wrap justify-center gap-6 sm:gap-8 pt-5 w-full max-w-6xl px-4'>
                {specialityData.map((item, index) => (
                    <div 
                        onClick={() => handleSpecialityClick(item.speciality)}
                        className='flex flex-col items-center text-xs cursor-pointer hover:translate-y-[-10px] transition-all duration-500' 
                        key={index}
                    >
                        <img className='w-16 sm:w-24 mb-2 ' src={item.image} alt="" />
                        <p>{item.speciality}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu
