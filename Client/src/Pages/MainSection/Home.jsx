import React, { useState, useEffect } from 'react'
import { Play, Volume2, Headphones } from 'lucide-react';
import TopCharts from './TopCharts'
import Navbar from '../Navbar/Navbar'
import HomeContents from './HomeContents'
import useChartsStore from '../../Stores/TopChartsStore';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate()
  const [animateText, setAnimateText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateText(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  const hero_bg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='400' fill='url(%23bg)'/%3E%3Cg opacity='0.1'%3E%3Ccircle cx='200' cy='100' r='60' fill='white'/%3E%3Ccircle cx='800' cy='200' r='80' fill='white'/%3E%3Ccircle cx='1000' cy='80' r='40' fill='white'/%3E%3C/g%3E%3C/svg%3E";

  return (
    <div className='w-full h-full overflow-y-auto min-w-0 min-h-0'>
      <div className='grid grid-cols-1'>
        {/* Hero section */}
        <div className='p-5 relative z-0'>
          <div className=" rounded-3xl h-fit w-full flex flex-1 bg-gradient-to-br from-black/80 via-purple-900/30 to-cyan-900/20  backdrop-blur-xl">
          <div 
          style={{backgroundImage: `url(${hero_bg})`}} 
          className="relative w-full bg-cover bg-center bg-no-repeat overflow-hidden rounded-3xl"
        >
          
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-400/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-blue-400/25 rounded-full blur-lg animate-pulse delay-500"></div>
          </div>

          {/* Main content */}
          <div className="relative z-10 w-full min-h-[200px] flex flex-col justify-center items-center sm:items-start p-4 md:p-6 lg:p-8">
            {/* Floating music icons */}
            <div className="hidden sm:flexabsolute top-8 right-8 gap-4 opacity-60">
              <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                <Headphones className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Enhanced typography */}
            <div className=" max-w-4xl relative z-10">
              <div className="hidden sm:block mb-4">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-600 text-sm font-semibold rounded-full border  backdrop-blur-sm">
                  <span className='text-white'>DISCOVER THE POWER</span>
                </span>
              </div>
              
              <h1 className={`text-lg sm:text-3xl lg:text-4xl text-center sm:text-left text-white font-black mb-4 leading-6 sm:leading-10 transform transition-all duration-300 ${animateText ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <span className="block sm:hidden bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  MUSIC CHANGES THE WORLD BECAUSE IT CHANGES PEOPLE
                </span>
                <span className="hidden sm:block ">
                  MUSIC CHANGES THE
                </span>
                <span className="hidden sm:block bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mt-1">
                  WORLD BECAUSE IT
                </span>
                <span className="hidden sm:block bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent  mt-1">
                  CHANGES PEOPLE
                </span>
              </h1>

              <p className={`text-gray-300 text-xs sm:text-base max-w-2xl text-center sm:text-left mb-6 sm:leading-relaxed transform transition-all duration-300 delay-300 ${animateText ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                Experience the transformative power of music that moves souls, breaks barriers, and connects hearts across the globe.
              </p>

              {/* Enhanced CTA button */}
              <button onClick={()=>navigate('/search')} className="cursor-pointer mx-auto sm:mx-0 bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-white px-5 py-3 rounded-full text-xs sm:text-sm md:text-lg font-bold flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-400/50">
                <Play className="w-4 h-4 md:w-6 md:h-6" />
                LISTEN NOW
              </button>
            </div>
          </div>
          </div>
          
          </div>
        </div>

        {/* TopCharts Section - no individual scrolling */}
        <section className='flex-shrink-0'>
          <TopCharts />
        </section>

        {/* HomeContents Section - no individual scrolling */}
        <section className='flex-shrink-0 flex gap-3 overflow-x-scroll'>
          <HomeContents />
        </section>
      </div>
    </div>
  )
}

export default Home