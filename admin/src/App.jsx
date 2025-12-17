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
import QueueManagement from './pages/Doctor/QueueManagement';
import JobApplications from './pages/Admin/JobApplications';
import SpecialtyHelpline from './pages/Admin/SpecialtyHelpline';

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)
  const location = useLocation()

  return dToken || aToken ? (
    <div className='relative w-full min-h-screen medical-bg'>
      <ToastContainer />
      <Navbar />
      <div key={location.pathname} className='flex items-start relative z-10 animate-route-in min-h-screen'>
        <Sidebar />
        <div className='flex-1 min-w-0 w-full pt-16 lg:pt-0 overflow-y-auto overflow-x-hidden main-content-area bg-white'>
          <Routes>
            <Route path='/' element={<></>} />
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/all-appointments' element={<AllAppointments />} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctor-list' element={<DoctorsList />} />
            <Route path='/job-applications' element={<JobApplications />} />
            <Route path='/specialty-helpline' element={<SpecialtyHelpline />} />
            <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
            <Route path='/doctor-appointments' element={<DoctorAppointments />} />
            <Route path='/doctor-profile' element={<DoctorProfile />} />
            <Route path='/queue-management' element={<QueueManagement />} />
          </Routes>
        </div>
      </div>
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