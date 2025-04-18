"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername: email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion')
      }

      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))

      router.push('/home')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      else {
        setError('Une erreur est survenue. Veuillez réessayer.')
      }
      console.error('Erreur de connexion:', error)
    }
  }

  return (
    <div className="py-8 px-10 rounded-xl flex flex-col justify-center items-start bg-white shadow-lg w-96">
      <h1 className="text-xl font-bold text-gray-800">Connectez-vous</h1>

      {error && <div className="text-red-500 mt-2 w-full text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="w-full">
        <div className="mt-6"> 
          <label className="text-md font-bold text-gray-800 block">Email ou pseudo</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 border border-[#B03AFF] rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent"
            placeholder="Votre email"
            required
          />
        </div>

        <div className="mt-6"> 
          <label className="text-md font-bold text-gray-800 block">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 border border-[#B03AFF] rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent"
            placeholder="Votre mot de passe"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] text-white px-4 py-3 rounded-lg mt-6 w-full font-bold hover:opacity-70 transition-opacity cursor-pointer"
        >
          Se connecter
        </button>
      </form>
      <p className="text-gray-600 mt-4 text-center w-full">
        Pas encore de compte ?{' '}
        <a href="/" className="text-[#B03AFF] font-medium hover:underline">
          Inscrivez-vous
        </a>
      </p>
    </div>
  )
}

export default Login