import React from 'react'
import BaseRegister from './BaseRegister'
import Login from './Login'

interface HeroProps {
  isLogin: boolean
}

const Hero = ({isLogin}: HeroProps) => {
  return (
    <div className="h-screen w-screen flex">
        <img 
            src="base.png" 
            className="block w-full h-full object-cover"
            alt="Background"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-80"></div>

        <div className="w-1/2 h-full absolute top-0 left-0 flex flex-col justify-center items-center font-lexend">
            <img src="logo.png" alt="Logo" className="w-48 h-48 mb-8 -mt-6" />
            <div className="max-w-lg -mt-10">
                <h1 className="text-5xl font-bold text-gray-800">Trouver l'amour qui vous correspond</h1>
                <p className="text-xl font-semibold text-gray-700 mt-4">Rejoignez des milliers de célibataires à la recherche de leur âme soeur</p>
                
                <div className="flex items-center justify-center mt-6">
                    <div className="flex -space-x-4">
                        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                            <img src="member1.jpg" alt="Membre 1" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                            <img src="member2.jpg" alt="Membre 2" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                            <img src="member3.avif" alt="Membre 3" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <p className="text-lg text-gray-600 ml-6">+200k membres actifs</p>
                </div>
            </div>
        </div>

        <div className="w-1/2 h-full absolute top-0 right-0 flex flex-col justify-center items-center">
            {isLogin ? (
              <Login />
            ) : (
              <BaseRegister />
            )}
        </div>
    </div>
  )
}

export default Hero