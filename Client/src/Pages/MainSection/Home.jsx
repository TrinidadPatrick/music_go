import React, { useState, useEffect } from 'react'
import { Play, Volume2, Headphones } from 'lucide-react';
import TopCharts from './TopCharts'
import Navbar from '../Navbar/Navbar'
import HomeContents from './HomeContents'
import useChartsStore from '../../Stores/TopChartsStore';

const Home = () => {
  const [isHovered, setIsHovered] = useState(false);
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
          <div className=" rounded-3xl h-fit w-full flex flex-1 bg-gradient-to-br from-slate-900 to-black shadow-2xl">
          <div 
          style={{backgroundImage: `url(${hero_bg})`}} 
          className="relative w-full bg-cover bg-center bg-no-repeat overflow-hidden rounded-3xl"
        >
          {/* Enhanced gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-purple-900/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
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
                <span className="inline-block px-4 py-2 bg-green-500/20 text-green-300 text-sm font-semibold rounded-full border border-green-500/30 backdrop-blur-sm">
                  DISCOVER THE POWER
                </span>
              </div>
              
              <h1 className={`text-lg sm:text-3xl lg:text-4xl text-center sm:text-left text-white font-black mb-4 leading-6 sm:leading-10 transform transition-all duration-1000 ${animateText ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <span className="block sm:hidden bg-gradient-to-r from-white via-green-100 to-green-200 bg-clip-text text-transparent">
                  MUSIC CHANGES THE WORLD BECAUSE IT CHANGES PEOPLE
                </span>
                <span className="hidden sm:block bg-gradient-to-r from-white via-green-100 to-green-200 bg-clip-text text-transparent">
                  MUSIC CHANGES THE
                </span>
                <span className="hidden sm:block bg-gradient-to-r from-green-300 via-green-200 to-white bg-clip-text text-transparent mt-1">
                  WORLD BECAUSE IT
                </span>
                <span className="hidden sm:block bg-gradient-to-r from-green-400 via-green-300 to-green-200 bg-clip-text text-transparent mt-1">
                  CHANGES PEOPLE
                </span>
              </h1>

              <p className={`text-gray-300 text-sm sm:text-base max-w-2xl text-center sm:text-left mb-6 leading-relaxed transform transition-all duration-1000 delay-300 ${animateText ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                Experience the transformative power of music that moves souls, breaks barriers, and connects hearts across the globe.
              </p>

              {/* Enhanced CTA button */}
              <div className={`flex justify-center sm:justify-start transform transition-all duration-1000 delay-500 ${animateText ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <button 
                  className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold px-8 py-3 rounded-full text-base transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 active:scale-95"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="flex items-center w-full gap-3">
                    <Play className={`w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} fill="currentColor" />
                    <span className="font-black tracking-wide text-xs sm:text-base">LISTEN NOW</span>
                  </div>
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
                  
                  {/* Ripple effect */}
                  <div className="absolute inset-0 rounded-full border-2 border-green-300 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>
                </button>
              </div>
            </div>
          </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent"></div>
          
          </div>
        </div>

        {/* TopCharts Section - no individual scrolling */}
        <section className='flex-shrink-0'>
          <TopCharts />
        </section>

        {/* HomeContents Section - no individual scrolling */}
        <section className='flex-shrink-0 flex gap-3 overflow-x-scroll'>
          {/* <div className='min-w-[200px] h-[50px] bg-red-100'></div>
          <div className='min-w-[200px] h-[50px] bg-red-100'></div>
          <div className='min-w-[200px] h-[50px] bg-red-100'></div>
          <div className='min-w-[200px] h-[50px] bg-red-100'></div>
          <div className='min-w-[200px] h-[50px] bg-red-100'></div>
          <div className='min-w-[200px] h-[50px] bg-red-100'></div>
          <div className='min-w-[200px] h-[50px] bg-red-100'></div>
          <div className='min-w-[200px] h-[50px] bg-red-100'></div>
          <div className='min-w-[200px] h-[50px] bg-red-100'></div>
          <div className='min-w-[200px] h-[50px] bg-red-100'></div> */}
          <HomeContents />
        </section>
      </div>
    </div>
  )
}

export default Home