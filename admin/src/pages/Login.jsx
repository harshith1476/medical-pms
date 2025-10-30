import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Admin') {

      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
      } else {
        toast.error(data.message)
      }

    }

  }

  return (
    <div className='min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950'>
      {/* Aurora gradient mesh */}
      <div className='absolute inset-0 -z-20 opacity-90' style={{
        backgroundImage: 'radial-gradient(60% 60% at 20% 10%, rgba(56,189,248,0.35) 0%, rgba(56,189,248,0) 100%), radial-gradient(50% 50% at 80% 20%, rgba(168,85,247,0.35) 0%, rgba(168,85,247,0) 100%), radial-gradient(40% 40% at 50% 80%, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0) 100%)'
      }} />

      {/* animated gradient layer */}
      <div className='absolute inset-0 -z-10 opacity-60 bg-[length:200%_200%] animate-pan'
           style={{ backgroundImage: 'linear-gradient(120deg, rgba(56,189,248,.15), rgba(168,85,247,.15), rgba(99,102,241,.15))' }} />

      {/* fine grid with vignette */}
      <div className='absolute inset-0 -z-10 opacity-[0.18] mix-blend-overlay' style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      <div className='absolute inset-0 pointer-events-none -z-10' style={{
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
        maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
        background: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,.08), transparent 40%)'
      }} />

      {/* morphing blobs */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='blob blob-a' />
        <div className='blob blob-b' />
        <div className='blob blob-c' />
      </div>

      {/* orbiting particles */}
      <div className='absolute inset-0 pointer-events-none'>
        {[...Array(24)].map((_, i) => (
          <span key={i}
                className='absolute w-1.5 h-1.5 rounded-full bg-white/50 shadow-[0_0_8px_rgba(255,255,255,.6)]'
                style={{
                  left: `${(i * 41) % 100}%`,
                  top: `${(i * 73) % 100}%`,
                  animation: `float ${8 + (i % 6)}s ease-in-out ${(i * 0.35)}s infinite`
                }} />
        ))}
      </div>

      <form onSubmit={onSubmitHandler} className='relative w-full max-w-md p-4 sm:p-1'>
        {/* glow border */}
        <div className='absolute -inset-1 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-indigo-500 rounded-2xl blur-lg opacity-40'></div>

        <div className='relative flex flex-col gap-4 items-start p-6 sm:p-8 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl text-[#4b5563] text-sm animate-card-in'>
          <div className='w-full text-center mb-2'>
            <div className='mx-auto mb-3 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg'>
              <svg className='w-6 h-6 sm:w-7 sm:h-7' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M3 7h18M3 12h18M6 17h12' />
              </svg>
            </div>
            <p className='text-xl sm:text-2xl font-semibold'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600'>{state}</span> Login
            </p>
          </div>

          <div className='w-full'>
            <p className='mb-1 text-xs uppercase tracking-wider text-gray-500'>Email</p>
            <input onChange={(e) => setEmail(e.target.value)} value={email} className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition text-base sm:text-sm' type="email" required />
        </div>
          <div className='w-full'>
            <p className='mb-1 text-xs uppercase tracking-wider text-gray-500'>Password</p>
            <input onChange={(e) => setPassword(e.target.value)} value={password} className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition text-base sm:text-sm' type="password" required />
        </div>

          <button className='w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all'>
            Login
          </button>

        {
          state === 'Admin'
              ? <p className='w-full text-center text-sm sm:text-base'>Doctor Login? <span onClick={() => setState('Doctor')} className='text-indigo-600 hover:text-purple-600 underline cursor-pointer transition-colors'>Click here</span></p>
              : <p className='w-full text-center text-sm sm:text-base'>Admin Login? <span onClick={() => setState('Admin')} className='text-indigo-600 hover:text-purple-600 underline cursor-pointer transition-colors'>Click here</span></p>
        }
      </div>
    </form>

      <style jsx>{`
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-16px) } }
        .animate-float { animation: float 10s ease-in-out infinite; }
        @keyframes cardIn { from { opacity: 0; transform: translateY(12px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        .animate-card-in { animation: cardIn .6s ease both; }
        @keyframes pan { 0% { background-position: 0% 0% } 50% { background-position: 100% 100% } 100% { background-position: 0% 0% } }
        .animate-pan { animation: pan 18s ease-in-out infinite; }

        /* Morphing aurora blobs */
        .blob { position:absolute; filter: blur(50px); opacity:.4; }
        .blob-a { width: 42rem; height: 42rem; left:-10%; top:-10%; background: radial-gradient(circle at 30% 30%, rgba(56,189,248,.6), transparent 50%), radial-gradient(circle at 70% 70%, rgba(168,85,247,.6), transparent 50%); border-radius: 43% 57% 60% 40% / 41% 45% 55% 59%; animation: blobMorph 28s ease-in-out infinite; }
        .blob-b { width: 36rem; height: 36rem; right:-8%; top:10%; background: radial-gradient(circle at 40% 40%, rgba(99,102,241,.6), transparent 55%), radial-gradient(circle at 70% 30%, rgba(56,189,248,.5), transparent 55%); border-radius: 55% 45% 35% 65% / 60% 40% 60% 40%; animation: blobMorph 32s ease-in-out -5s infinite; }
        .blob-c { width: 48rem; height: 48rem; left:-15%; bottom:-20%; background: radial-gradient(circle at 60% 60%, rgba(168,85,247,.5), transparent 55%), radial-gradient(circle at 30% 70%, rgba(99,102,241,.5), transparent 55%); border-radius: 65% 35% 55% 45% / 40% 60% 40% 60%; animation: blobMorph 36s ease-in-out -10s infinite; }
        @keyframes blobMorph {
          0%, 100% { transform: translate(0,0) rotate(0deg) scale(1); }
          25% { transform: translate(20px,-10px) rotate(10deg) scale(1.05); }
          50% { transform: translate(-10px,10px) rotate(-8deg) scale(1.03); }
          75% { transform: translate(10px,0px) rotate(6deg) scale(1.06); }
        }

        /* Mobile responsiveness for blobs */
        @media (max-width: 640px) {
          .blob { filter: blur(40px); }
          .blob-a { width: 26rem; height: 26rem; left:-35%; top:-30%; }
          .blob-b { width: 24rem; height: 24rem; right:-35%; top:20%; }
          .blob-c { width: 30rem; height: 30rem; left:-40%; bottom:-40%; }
        }
      `}</style>
    </div>
  )
}

export default Login