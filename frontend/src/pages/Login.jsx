import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { SignupForm } from '../components/SignupForm'

const Login = () => {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode')
  const navigate = useNavigate()
  const { token } = useContext(AppContext)

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  const isSignup = mode === 'signup'

  return (
    <div className="bg-gray-50 flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        {isSignup ? <SignupForm /> : <LoginForm />}
      </div>
    </div>
  )
}

export default Login
