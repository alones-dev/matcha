"use client"

import React from 'react'

const Login = () => {
  return (
    <div className="py-8 px-10 rounded-xl flex flex-col justify-center items-start bg-white shadow-lg w-96">
        <h1 className="text-xl font-bold text-gray-800">Connectez-vous</h1>

        <a className="text-md font-bold text-gray-800 mt-4">Email</a>
        <input type="email" className="mt-1 border border-[#B03AFF] rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent" placeholder="Votre email" />

        <a className="text-md font-bold text-gray-800 mt-4">Mot de passe</a>
        <input type="password" className="mt-1 border border-[#B03AFF] rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent" placeholder="Votre mot de passe" />

        <button className="bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] text-white px-4 py-3 rounded-lg mt-6 w-full font-bold hover:opacity-70 transition-opacity cursor-pointer">
            Se connecter
        </button>
        <p className="text-gray-600 mt-4 text-center w-full">Pas encore de compte ? <a href="/" className="text-[#B03AFF] font-medium hover:underline">Inscrivez-vous</a></p>
    </div>
  )
}

export default Login