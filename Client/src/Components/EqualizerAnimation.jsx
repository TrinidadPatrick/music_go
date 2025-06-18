import React from 'react'

const EqualizerAnimation = () => {
  return (
    <div className="flex items-end gap-1 h-5 justify-center">
        <div className="bg-green-500 w-1 h-full animate-equalizer delay-0 origin-bottom " style={{ animationDelay: "0s" }}></div>
        <div className="bg-green-500 w-1 h-full animate-equalizer origin-bottom " style={{ animationDelay: "0.2s" }}></div>
        <div className="bg-green-500 w-1 h-full animate-equalizer origin-bottom " style={{ animationDelay: "0.4s" }}></div>
    </div>
  )
}

export default EqualizerAnimation