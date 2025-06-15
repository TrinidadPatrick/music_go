import React, { useEffect, useState } from 'react'
import http from '../../../http'
import Home from './Home'

const MainSection = () => {

  return (
    <div className='h-full flex flex-col overflow-auto'>
      <div className='w-full h-full overflow-x-auto'>
        <Home />
      </div>
    </div>

  )
}

export default MainSection