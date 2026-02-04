import React, { useState, useEffect } from 'react'
import { Play, Volume2, Headphones } from 'lucide-react';
import TopCharts from './TopCharts'
import Navbar from '../../Components/Navbar'
import HomeContents from './HomeContents'
import useChartsStore from '../../Stores/TopChartsStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/Components/ui/button.jsx';
import Moods from './Moods';

const Home = () => {
  const navigate = useNavigate()
  const [animateText, setAnimateText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateText(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  const hero_bg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='400' fill='url(%23bg)'/%3E%3Cg opacity='0.1'%3E%3Ccircle cx='200' cy='100' r='60' fill='white'/%3E%3Ccircle cx='800' cy='200' r='80' fill='white'/%3E%3Ccircle cx='1000' cy='80' r='40' fill='white'/%3E%3C/g%3E%3C/svg%3E";

  return (
    <div className='w-full h-full overflow-y-auto min-w-0 min-h-0 pb-20'>
      <div className='grid grid-cols-1'>
        {/* Hero Section */}
        <div className='flex flex-col md:flex-row p-2 lg:p-10 gap-4 md:gap-5'>
          <section className=" relative overflow-hidden rounded-2xl md:mb-8 w-full h-full">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-secondary to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />
            
            {/* Glow effect */}
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center h-full py-5 px-10">
              {/* Badge */}
              <span className="w-fit px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary text-primary-foreground mb-6">
                Discover the Power
              </span>
              {/* Headline */}
              <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight max-w-xl mb-4">
                <span className="text-foreground">Music Changes the </span>
                <span className="text-gradient">World Because It Changes People</span>
              </h1>
              {/* Subtitle */}
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-8">
                Experience the transformative power of music that moves souls, breaks barriers, and connects hearts across the globe.
              </p>
              {/* CTA Button */}
              <Button
                onClick={()=>navigate('/search')}
                size="lg"
                className="w-fit bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity shadow-glow"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Listen Now
              </Button>
            </div>
          </section>

          <section className='w-full md:max-w-[15rem]'>
            <Moods />
          </section>
        </div>


        {/* TopCharts Section */}
        <section className='flex-shrink-0'>
          <TopCharts />
        </section>

        {/* HomeContents Section - no individual scrolling */}
        <section className='flex-shrink-0 flex gap-3 '>
          <HomeContents />
        </section>
      </div>
    </div>
  )
}

export default Home