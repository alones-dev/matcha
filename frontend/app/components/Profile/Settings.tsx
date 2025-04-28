"use client"

import React, { useState } from 'react'
import { FiUser, FiMail, FiCalendar, FiLock, FiEdit2, FiPlus, FiX } from 'react-icons/fi'

const Settings = () => {
  const [user, setUser] = useState({
    username: 'jeandupont',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    birthDate: '1990-03-15',
    bio: 'Photographe amateur | Voyageur | Coffee addict',
    interests: ['Photographie', 'Voyage', 'Café']
  })

  const [password, setPassword] = useState('')
  const [newInterest, setNewInterest] = useState('')
  const [activeTab, setActiveTab] = useState('informations')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Données sauvegardées:', user)
  }

  const addInterest = () => {
    if (
      newInterest.trim() &&
      !user.interests.includes(newInterest) &&
      user.interests.length < 8
    ) {
      setUser({
        ...user,
        interests: [...user.interests, newInterest.trim()],
      })
      setNewInterest('')
    }
  }

  const removeInterest = (interestToRemove: string) => {
    setUser({
      ...user,
      interests: user.interests.filter(interest => interest !== interestToRemove)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF1F3] via-[#F9F2F9] to-[#F5F3FF] pt-16">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Paramètres du compte</h1>
        
        <div className="flex border-b mb-8">
          <button
            className={`cursor-pointer px-4 py-2 font-medium ${activeTab === 'informations' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('informations')}
          >
            Informations personnelles
          </button>
          <button
            className={`cursor-pointer px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profil public
          </button>
        </div>

        {activeTab === 'informations' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiUser className="text-purple-500" /> Informations personnelles
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pseudo</label>
                <div className="relative">
                  <input
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({...user, username: e.target.value})}
                    className="w-full p-3 border rounded-lg pl-10"
                  />
                  <FiUser className="absolute left-3 top-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={user.firstName}
                    onChange={(e) => setUser({...user, firstName: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={user.lastName}
                    onChange={(e) => setUser({...user, lastName: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    className="w-full p-3 border rounded-lg pl-10"
                  />
                  <FiMail className="absolute left-3 top-4.5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                <div className="relative">
                  <input
                    type="date"
                    value={user.birthDate}
                    onChange={(e) => setUser({...user, birthDate: e.target.value})}
                    className="w-full p-3 border rounded-lg pl-10"
                  />
                  <FiCalendar className="absolute left-3 top-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmez avec votre mot de passe
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg pl-10"
                    placeholder="••••••••"
                  />
                  <FiLock className="absolute left-3 top-4 text-gray-400" />
                </div>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiEdit2 className="text-purple-500" /> Profil public
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={user.bio}
                  onChange={(e) => setUser({...user, bio: e.target.value})}
                  className="w-full p-3 border rounded-lg h-24"
                  placeholder="Décrivez-vous en quelques mots..."
                  maxLength={300}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Centres d'intérêt
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {user.interests.map((interest) => (
                    <div key={interest} className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      <span className="text-sm">{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-1 text-purple-600 hover:text-purple-800 cursor-pointer"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="flex-1 p-3 border rounded-lg"
                    placeholder="Ajouter un centre d'intérêt"
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    disabled={user.interests.length >= 8}
                    className={`${
                        user.interests.length >= 8
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
                    } text-white px-4 rounded-lg flex items-center gap-1`}
                    >
                    <FiPlus /> Ajouter
                    </button>
                </div>
              </div>
            </div>
          </form>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            className={`cursor-pointer bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity`}
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings