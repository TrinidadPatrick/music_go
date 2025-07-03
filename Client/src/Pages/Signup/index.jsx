import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import http from '../../../http'
import { useAuth } from '../../Auth/AuthProvider'

const Signup = () => {
  const {isAuthenticated} = useAuth()
  const urlParams = new URLSearchParams(window.location.search);
  const message = urlParams.get("message");
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: ''
  })

  useEffect(()=>{
    if(isAuthenticated === true){
      navigate('/')
    }
  }, [isAuthenticated])

  useEffect(()=>{
    if(message){
      setErrorMessage(message)
    }
  }, [urlParams])

  const handleSignup = async (e) => {
    e.preventDefault()
    const hasError = userInfo.email.length === 0 || userInfo.password.length === 0 || userInfo.name.length === 0
    
    if(!hasError){
      try {
        const result = await http.post('/user/auth/register', userInfo)
        console.log(result)
        if(result.status === 200){
          window.location.href = '/'
        }
      } catch (error) {
        console.log(error)
        if(error.status === 401 || error.status === 409){
          console.log(error.response.data.message)
          setErrorMessage(error.response.data.message)
        }else{
          setErrorMessage('Something went wrong')
        }
      }
    }else{
      setErrorMessage('Please fill in all fields')
    }
  }

  return isAuthenticated === null ? "" : (
    <div className="absolute w-screen h-screen top-0 left-0 flex items-center justify-center bg-gradient-to-br from-[#2c3e50] via-[#34495e] to-[#2980b9] sm:p-5 font-sans">
      
      {/* Floating shapes */}
      <div className="pointer-events-none absolute  inset-0 z-10">
        <div className="absolute rounded-full bg-purple-600/10 animate-float w-20 h-20 top-1/5 left-[10%]"></div>
        <div className="absolute rounded-full bg-purple-600/10 animate-float w-15 h-15 top-[60%] right-[15%] animation-delay-2000"></div>
        <div className="absolute rounded-full bg-purple-600/10 animate-float w-10 h-10 bottom-[20%] left-[20%] animation-delay-4000"></div>
      </div>

      {/* Container */}
      <div className="relative flex flex-col justify-center gap-3 h-screen sm:h-fit bg-[#2c3e50ef] backdrop-blur-[20px] sm:rounded-3xl p-3 md:p-6 sm:max-w-md w-full border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
        
        {/* Top border gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

        {/* Logo */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-semibold mb-1 bg-gradient-to-br from-purple-600 to-purple-400 bg-clip-text text-transparent">
            MusicGo
          </h1>
          <p className="text-white/60 text-sm">Your music, your world</p>
        </div>

        {/* Form Toggle (static, no interactivity) */}
        <div className="flex bg-white/5 rounded-md p-1 relative select-none">
        <div onClick={()=>navigate('/signin')} className=" flex-1 py-2 px-6 text-center text-white/60 font-medium rounded-md cursor-pointer z-10">
            Sign In
          </div>
          <div className="flex-1 py-2 px-6 text-center text-white/60 font-medium rounded-md cursor-pointer z-10 bg-purple-600/80 shadow-md">
            Sign Up
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && <div className="text-red-400 rounded-md text-sm w-full text-center font-medium p-3 bg-[#f4727227]">{errorMessage}</div>}

        {/* Sign In Form (always visible) */}
        <form className="flex flex-col gap-3 md:gap-5">

          {/* Name */}
          <div className="">
            <label htmlFor="signin-name" className="block mb-2 text-white/80 font-semibold text-[0.8rem]">
              Name
            </label>
            <input
              type="text"
              id="signin-name"
              placeholder="Enter your name"
              required
              value={userInfo.name}
              onChange={(e)=>{setUserInfo({...userInfo, name: e.target.value})}}
              className="w-full px-2 py-3 bg-white/5 border border-white/10 rounded-md text-white text-sm placeholder-white/40 
              focus:border-[#8b45ff]
              focus:shadow-[0 0 0 3px rgba(139, 69, 255, 0.1)]
              border-color: #8b45ff;
              box-shadow: 0 0 0 3px rgba(139, 69, 255, 0.1);
              background: rgba(255, 255, 255, 0.08);
              outline-none transition"
            />
          </div>

          <div className="">
            <label htmlFor="signin-email" className="block mb-2 text-white/80 font-semibold text-[0.8rem]">
              Email
            </label>
            <input
              type="email"
              id="signin-email"
              placeholder="Enter your email"
              required
              value={userInfo.email}
              onChange={(e)=>{setUserInfo({...userInfo, email: e.target.value})}}
              className="w-full px-2 py-3 bg-white/5 border border-white/10 rounded-md text-white text-sm placeholder-white/40 
              focus:border-[#8b45ff]
              focus:shadow-[0 0 0 3px rgba(139, 69, 255, 0.1)]
              border-color: #8b45ff;
              box-shadow: 0 0 0 3px rgba(139, 69, 255, 0.1);
              background: rgba(255, 255, 255, 0.08);
              outline-none transition"
            />
          </div>

          <div className="">
            <label htmlFor="signin-password" className="block mb-2 text-white/80 font-semibold text-[0.8rem]">
              Password
            </label>
            <input
              type="password"
              id="signin-password"
              placeholder="Enter your password"
              required
              value={userInfo.password}
              onChange={(e)=>{setUserInfo({...userInfo, password: e.target.value})}}
              className="w-full px-2 py-3 bg-white/5 border border-white/10 rounded-md text-white text-sm placeholder-white/40 
              focus:border-[#8b45ff]
              focus:shadow-[0 0 0 3px rgba(139, 69, 255, 0.1)]
              border-color: #8b45ff;
              box-shadow: 0 0 0 3px rgba(139, 69, 255, 0.1);
              background: rgba(255, 255, 255, 0.08);
              outline-none transition"
            />
          </div>

          {/* <div className="text-right">
            <a href="#" className="text-purple-600 text-sm no-underline hover:text-purple-400 transition">
              Forgot password?
            </a>
          </div> */}

          <button
            onClick={(e)=>handleSignup(e)}
            type="submit"
            className="w-full py-3 bg-gradient-to-br from-purple-600 to-purple-400 rounded-md text-white text-sm font-semibold cursor-pointer hover:shadow-[0_8px_30px_rgba(139,69,255,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center text-white/40 text-sm">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="px-4">or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex gap-3 mb-0">
          <a
            href={`${import.meta.env.VITE_BASE_URL}/user/auth/login/google?provider=google&state=signup`}
            className="flex-1 py-3 bg-white/5 border border-white/10 rounded-md text-white text-center font-medium text-sm hover:bg-white/10 hover:-translate-y-0.5 transition"
          >
            Google
          </a>
        </div>
      </div>
    </div>
  )
}

export default Signup