import React from 'react'
import Register from '../components/Register'

const page = () => {
  return (
    <div className="h-screen w-screen flex">
        <img 
            src="base.png" 
            className="block w-full h-full object-cover"
            alt="Background"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-80"></div>

        <div className="h-full w-full absolute flex flex-col justify-center items-center">
            <Register />
        </div>
    </div>
  )
}

export default page