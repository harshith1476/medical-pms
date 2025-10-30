import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import LiveTips from './components/LiveTips'
import AnimatedQuotes from './components/AnimatedQuotes'
import BackgroundFX from './components/BackgroundFX'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)
  const location = useLocation()
  const showQuotes = location.pathname === '/admin-dashboard' || location.pathname === '/'

  return dToken || aToken ? (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50'>
      <BackgroundFX />
      <ToastContainer />
      <Navbar />
      <div key={location.pathname} className='flex items-start relative z-10 animate-route-in'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
        </Routes>
      </div>
      {showQuotes && <AnimatedQuotes />}
      <LiveTips />
      <style>{`@keyframes pan {0%{background-position:0% 0%}50%{background-position:100% 100%}100%{background-position:0% 0%}}
      @keyframes routeIn {0%{opacity:0; transform: translateY(12px) scale(.98)} 100%{opacity:1; transform: translateY(0) scale(1)}}
      .animate-route-in{animation: routeIn .5s ease forwards}
      `}</style>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App