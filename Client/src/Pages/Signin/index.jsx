import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import http from '../../../http'
import Loader from '../../Components/Loader'
import { useAuth } from '../../Auth/AuthProvider'

const Signin = () => {
  const {isAuthenticated} = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const urlParams = new URLSearchParams(window.location.search);
  const [errorMessage, setErrorMessage] = useState('')
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: ''
  })

  useEffect(()=>{
    if(isAuthenticated === true){
      navigate('/')
    }
  }, [isAuthenticated])

  useEffect(()=>{
    const message = urlParams.get("message");
    if(message){
      setErrorMessage(message)
      urlParams.delete("message")
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const hasError = userInfo.email.length === 0 || userInfo.password.length === 0
    
    if(!hasError){
      try {
        const result = await http.post('/user/auth/login', userInfo, {
          withCredentials: true
        })
        // console.log(result)
        if(result.status === 200){
          window.location.href = '/'
        }
      } catch (error) {
        console.log(error)
        if(error.status === 401){
          setErrorMessage('Invalid email or password')
        }else{
          setErrorMessage('Something went wrong')
        }
      }
    }else{
      setErrorMessage('Please fill in all fields')
    }

    setLoading(false)
  }
  
  return isAuthenticated === null ? "" : (
    <div className="top-0 left-0 w-screen h-screen absolute overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#2c3e50] via-[#34495e] to-[#2980b9] sm:p-5 font-sans">
      
      {/* Floating shapes */}
      <div className="pointer-events-none absolute  inset-0 z-10">
        <div className="absolute rounded-full bg-purple-600/10 animate-float w-20 h-20 top-1/5 left-[10%]"></div>
        <div className="absolute rounded-full bg-purple-600/10 animate-float w-15 h-15 top-[60%] right-[15%] animation-delay-2000"></div>
        <div className="absolute rounded-full bg-purple-600/10 animate-float w-10 h-10 bottom-[20%] left-[20%] animation-delay-4000"></div>
      </div>

      {/* Container */}
      <div className="relative flex flex-col gap-5 h-full sm:h-fit bg-[#2c3e50ef] backdrop-blur-[20px] sm:rounded-3xl p-6 sm:max-w-md w-full border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
        
        {/* Top border gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

        {/* Logo */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-semibold mb-2 bg-gradient-to-br from-purple-600 to-purple-400 bg-clip-text text-transparent">
            MusicGo
          </h1>
          <p className="text-white/60 text-sm">Your music, your world</p>
        </div>

        {/* Form Toggle (static, no interactivity) */}
        <div className="flex bg-white/5 rounded-md p-1 relative select-none">
          <div className="flex-1 py-2.5 px-6 text-center text-white/60 font-medium rounded-md cursor-pointer z-10 bg-purple-600/80 shadow-md">
            Sign In
          </div>
          <div onClick={()=>navigate('/signup')} className="flex-1 py-2.5 px-6 text-center text-white/60 font-medium rounded-md cursor-pointer z-10">
            Sign Up
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && <div className="text-red-400 rounded-md text-sm w-full text-center font-medium p-3 bg-[#f4727227]">{errorMessage}</div>}

        {/* Sign In Form (always visible) */}
        <form className="flex flex-col gap-5">
          <div className="">
            <label htmlFor="signin-email" className="block mb-2 text-white/80 font-semibold text-sm">
              Email
            </label>
            <input
              type="text"
              id="signin-email"
              placeholder="Enter your email"
              required
              value={userInfo.email}
              onChange={(e)=>{setUserInfo({...userInfo, email: e.target.value})}}
              className="w-full px-2 py-3 bg-white/5 border border-white/10 rounded-md text-white text-base placeholder-white/40 
              focus:border-[#8b45ff]
              focus:shadow-[0 0 0 3px rgba(139, 69, 255, 0.1)]
              outline-none transition"
            />
          </div>

          <div className="">
            <label htmlFor="signin-password" className="block mb-2 text-white/80 font-semibold text-sm">
              Password
            </label>
            <input
              type="password"
              id="signin-password"
              placeholder="Enter your password"
              required
              value={userInfo.password}
              onChange={(e)=>{setUserInfo({...userInfo, password: e.target.value})}}
              className="w-full px-2 py-3 bg-white/5 border border-white/10 rounded-md text-white text-base placeholder-white/40 
              focus:border-[#8b45ff]
              focus:shadow-[0 0 0 3px rgba(139, 69, 255, 0.1)]
              outline-none transition"
            />
          </div>

          {/* <div className="text-right">
            <a href="#" className="text-purple-600 text-sm no-underline hover:text-purple-400 transition">
              Forgot password?
            </a>
          </div> */}

          <button
            onClick={(e)=>handleLogin(e)}
            type="submit"
            className="  w-full h-[3rem] bg-gradient-to-br from-purple-600 to-purple-400 rounded-md text-white text-lg font-semibold cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition"
          >
            {loading ? <Loader background={'white'} size={10} /> : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center text-white/40 text-sm">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="px-4">or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex gap-3 mb-4">
          <a
            href={`${import.meta.env.VITE_BASE_URL}/user/auth/login/google?provider=google&state=signin`}
            className="flex-1 py-3 bg-white/5 border border-white/10 rounded-md text-white text-center font-medium text-sm hover:bg-white/10 hover:-translate-y-0.5 transition"
          >
            Google
          </a>
        </div>
      </div>
    </div>
  )
}

export default Signin