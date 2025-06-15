import React from 'react'

const Loader = ({background, size}) => {
  return (
    <div class="flex flex-row gap-2 justify-center">
        <div style={{backgroundColor: background, width: size, height: size}} class={` rounded-full animate-bounce`}></div>
        <div style={{backgroundColor: background, width: size, height: size}} class={` rounded-full animate-bounce [animation-delay:-.3s]`}></div>
        <div style={{backgroundColor: background, width: size, height: size}} class={` rounded-full animate-bounce [animation-delay:-.5s]`}></div>
    </div>

  )
}

export default Loader