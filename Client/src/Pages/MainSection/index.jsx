import React, { useEffect, useState } from 'react'
import http from '../../../http'
import Home from './Home'

const MainSection = () => {
  return (
    // Fix: Use h-full instead of calc height
    <div className='w-full h-full flex flex-col'>
      <Home />
    </div>
  )
}

export default MainSection