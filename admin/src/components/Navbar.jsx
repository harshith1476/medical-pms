import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    <div className='sticky top-0 z-20 flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white/70 backdrop-blur-xl shadow-sm'>
      <div className='flex items-center gap-3 text-xs'>
        <div onClick={() => navigate('/')} className='cursor-pointer flex items-center gap-2'>
          <div className='w-10 h-10 rounded-2xl bg-white shadow flex items-center justify-center ring-1 ring-black/5'>
            <img src={assets.admin_logo} alt='logo' className='w-6 h-6 object-contain' />
          </div>
          <div className='leading-4'>
            <p className='text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600'>MediChain</p>
            <p className='text-[10px] text-gray-500 -mt-0.5'>Dashboard Panel</p>
          </div>
        </div>
        <p className='border px-2.5 py-0.5 rounded-full border-gray-300 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick={() => logout()} className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm px-6 sm:px-10 py-2 rounded-full shadow hover:opacity-95 transition'>Logout</button>
    </div>
  )
}

export default Navbar