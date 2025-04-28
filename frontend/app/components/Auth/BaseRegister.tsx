"use client"

import React, { useState, FormEvent } from 'react'
import { IoMdMale, IoMdFemale } from 'react-icons/io'
import { useRouter } from 'next/navigation'

const BaseRegister = () => {
    const [selectedGender, setSelectedGender] = useState("")
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const router = useRouter()

    const handleRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!selectedGender) {
            alert('Veuillez sélectionner un genre.')
            return
        }

        const userData = {
            gender: selectedGender,
            firstName: encodeURIComponent(firstName),
            email: encodeURIComponent(email)
        }
        
        const queryString = new URLSearchParams(userData).toString()
        
        router.push(`/register?${queryString}`)
    }

    return (
        <form onSubmit={handleRegister} className="py-8 px-10 rounded-xl flex flex-col justify-center items-start bg-white shadow-lg w-96">
            <h1 className="text-xl font-bold text-gray-800">Créez votre compte</h1>

            <label className="text-md font-bold text-gray-800 mt-6">Je suis</label>
            <div className="flex flex-row gap-4 mt-2 w-full">
                <button 
                    type="button"
                    className={`cursor-pointer text-[#B03AFF] flex items-center justify-center gap-2 px-6 py-3 hover:opacity-70 transition-opacity rounded-lg flex-1 border ${
                        selectedGender === 'male' 
                            ? 'border-transparent bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] text-white' 
                            : 'border-[#B03AFF]'
                    }`}
                    onClick={() => setSelectedGender('male')}
                >
                    <IoMdMale />
                    Homme
                </button>
                <button 
                    type="button"
                    className={`cursor-pointer text-[#B03AFF] flex items-center justify-center gap-2 px-6 py-3 hover:opacity-70 transition-opacity rounded-lg flex-1 border ${
                        selectedGender === 'female' 
                            ? 'border-transparent bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] text-white' 
                            : 'border-[#B03AFF]'
                    }`}
                    onClick={() => setSelectedGender('female')}
                >
                    <IoMdFemale />
                    Femme
                </button>
            </div>

            <label className="text-md font-bold text-gray-800 mt-4">Prénom</label>
            <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border border-[#B03AFF] rounded-lg px-4 py-2 w-full mt-1 focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent" 
                placeholder="Votre prénom" 
                required
            />

            <label className="text-md font-bold text-gray-800 mt-4">Email</label>
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border border-[#B03AFF] rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent" 
                placeholder="Votre email" 
                required
            />

            <label className="text-md font-bold text-gray-800 mt-4">Mot de passe</label>
            <input 
                type="password" 
                className="mt-1 border border-[#B03AFF] rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#B03AFF] focus:border-transparent" 
                placeholder="Votre mot de passe" 
                required
            />

            <button 
                type="submit"
                className="bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] text-white text-center px-4 py-3 rounded-lg mt-6 w-full font-bold hover:opacity-70 transition-opacity cursor-pointer"
            >
                Commencer maintenant
            </button>
            <p className="text-gray-600 mt-4 text-center w-full">Déjà un compte ? <a href="/login" className="text-[#B03AFF] font-medium hover:underline">Se connecter</a></p>
        </form>
    )
}

export default BaseRegister