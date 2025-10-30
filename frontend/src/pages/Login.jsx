import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [focusedField, setFocusedField] = useState(null)
  

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true)

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully!')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Logged in successfully!')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleState = () => {
    setState(state === 'Sign Up' ? 'Login' : 'Sign Up')
    setFocusedField(null)
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  useEffect(() => {
    // Trigger animation when switching between login/signup
    setAnimationKey(prev => prev + 1)
  }, [state])

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Main Content Area */}
      <div className="relative w-full max-w-md">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-3 h-3 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${8 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
        {/* Decorative Card */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
        
        <form 
          key={animationKey}
          onSubmit={onSubmitHandler} 
          className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 transform transition-all duration-700 animate-form-in"
        >
          {/* Header with Animation */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600">
              {state === 'Sign Up' ? 'Join our healthcare community' : 'Sign in to continue your health journey'}
            </p>
          </div>

          {/* Form Fields with Floating Labels */}
          <div className="space-y-6">
            {state === 'Sign Up' && (
              <div className="relative">
                <input 
                  onChange={(e) => setName(e.target.value)} 
                  value={name} 
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 pt-6 pb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 outline-none" 
                  type="text" 
                  required 
                  id="name-input"
                />
                <label 
                  htmlFor="name-input"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    name || focusedField === 'name'
                      ? 'top-2 text-xs text-blue-600 bg-white px-1' 
                      : 'top-1/2 -translate-y-1/2 text-gray-400'
                  }`}
                >
                  Full Name
                </label>
              </div>
            )}

            <div className="relative">
              <input 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 pt-6 pb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 outline-none" 
                type="email" 
                required 
                id="email-input"
              />
              <label 
                htmlFor="email-input"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  email || focusedField === 'email'
                    ? 'top-2 text-xs text-blue-600 bg-white px-1' 
                    : 'top-1/2 -translate-y-1/2 text-gray-400'
                }`}
              >
                Email Address
              </label>
            </div>

            <div className="relative">
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 pt-6 pb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 outline-none" 
                type="password" 
                required 
                id="password-input"
              />
              <label 
                htmlFor="password-input"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  password || focusedField === 'password'
                    ? 'top-2 text-xs text-blue-600 bg-white px-1' 
                    : 'top-1/2 -translate-y-1/2 text-gray-400'
                }`}
              >
                Password
              </label>
              
            </div>
            

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {state === 'Sign Up' ? 'Creating Account...' : 'Logging in...'}
                </>
              ) : (
                <>
                  {state === 'Sign Up' ? 'Create Account' : 'Login'}
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Switch between Login/Signup */}
          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-gray-600">
              {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button 
                type="button"
                onClick={handleToggleState}
                className="text-blue-600 font-semibold hover:text-purple-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
              >
                {state === 'Sign Up' ? 'Login here' : 'Sign up here'}
              </button>
            </p>

            {/* No external redirects */}
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes form-in {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-form-in {
          animation: form-in 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default Login