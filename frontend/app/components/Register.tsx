"use client"

import React, { useState, FormEvent } from 'react'
import { IoMdMale, IoMdFemale } from 'react-icons/io'
import { useSearchParams } from 'next/navigation'

const Register = () => {
  const searchParams = useSearchParams()

  const gender = searchParams.get('gender') || ''
  const firstName = decodeURIComponent(searchParams.get('firstName') || '')
  const email = decodeURIComponent(searchParams.get('email') || '')

  const [selectedGender, setSelectedGender] = useState(gender)
  const [firstNameInput, setFirstNameInput] = useState(firstName)
  const [emailInput, setEmailInput] = useState(email)
  const [birthdate, setBirthdate] = useState('')
  
  const minBirthdate = new Date()
  minBirthdate.setFullYear(minBirthdate.getFullYear() - 18)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedGender) {
      alert('Veuillez sélectionner un genre.')
      return
    }

    
  }
  
  return (
    <form onSubmit={handleSubmit} className="py-8 px-10 rounded-xl flex flex-col justify-center items-start bg-white shadow-lg w-full max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Créez votre compte</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full"> 
        <div className="space-y-6"> 
          <div>
            <label className="block text-md font-bold text-gray-800 mb-2">Je suis</label> 
            <div className="flex flex-row gap-4 w-full">
              <button 
                className={`cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
                  selectedGender === 'male' 
                    ? 'border-transparent bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] text-white' 
                    : 'border-[#B03AFF] text-[#B03AFF] hover:bg-purple-50'
                } transition-all`}
                onClick={() => setSelectedGender('male')}
              >
                <IoMdMale className="text-xl" /> 
                <span className="text-md">Homme</span>
              </button>
              <button 
                className={`cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
                  selectedGender === 'female' 
                    ? 'border-transparent bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] text-white' 
                    : 'border-[#B03AFF] text-[#B03AFF] hover:bg-purple-50'
                } transition-all`}
                onClick={() => setSelectedGender('female')}
              >
                <IoMdFemale className="text-xl" />
                <span className="text-md">Femme</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-md font-bold text-gray-800 mb-2">Prénom</label>
            <input 
              type="text" 
              className="border-2 border-[#B03AFF] rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent text-md" 
              placeholder="Votre prénom" 
              value={firstNameInput}
              onChange={(e) => setFirstNameInput(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="block text-md font-bold text-gray-800 mb-2">Nom de famille</label>
            <input 
              type="text" 
              className="border-2 border-[#B03AFF] rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent text-md" 
              placeholder="Votre nom" 
              required 
            />
          </div>

          <div>
            <label className="block text-md font-bold text-gray-800 mb-2">Date de naissance</label>
            <input 
              type="date" 
              max={minBirthdate.toISOString().split('T')[0]}
              className="border-2 border-[#B03AFF] rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent text-md" 
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required 
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-md font-bold text-gray-800 mb-2">Email</label>
            <input 
              type="email" 
              className="border-2 border-[#B03AFF] rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent text-md" 
              placeholder="Votre email" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="block text-md font-bold text-gray-800 mb-2">Nom d'utilisateur</label>
            <input 
              type="text" 
              className="border-2 border-[#B03AFF] rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent text-md" 
              placeholder="Choisissez un pseudo" 
              required 
            />
          </div>

          <div>
            <label className="block text-md font-bold text-gray-800 mb-2">Mot de passe</label>
            <input 
              type="password" 
              className="border-2 border-[#B03AFF] rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent text-md" 
              placeholder="••••••••••••••" 
              required 
            />
          </div>

          <div>
            <label className="block text-md font-bold text-gray-800 mb-2">Confirmer le mot de passe</label>
            <input 
              type="password" 
              className="border-2 border-[#B03AFF] rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent text-md" 
              placeholder="••••••••••••••" 
              required 
            />
          </div>
        </div>
      </div>

      <div className="mt-8 w-full"> 
        <div className="flex items-start">
          <input 
            type="checkbox" 
            id="terms" 
            className="h-5 w-5 border-2 border-[#B03AFF] rounded focus:ring-[#B03AFF]" 
            required 
          />
          <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
            J'accepte les <a href="/terms" className="text-[#B03AFF] font-medium hover:underline">Conditions d'utilisation</a> et la <a href="/privacy" className="text-[#B03AFF] font-medium hover:underline">Politique de confidentialité</a>
          </label>
        </div>
      </div>

      <button 
        type="submit"
        className="cursor-pointer bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] text-white px-6 py-4 rounded-lg mt-8 w-full font-bold hover:opacity-90 transition-opacity text-lg"
      >
        Commencer maintenant
      </button>

      <p className="text-gray-600 mt-6 text-center w-full text-md">
        Déjà un compte ? <a href="/login" className="text-[#B03AFF] font-medium hover:underline">Se connecter</a>
      </p>
    </form>
  )
}

export default Register