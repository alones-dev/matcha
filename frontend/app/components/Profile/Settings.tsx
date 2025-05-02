"use client"

import React, { useState, useEffect, FormEvent, KeyboardEvent } from 'react'
import { FiUser, FiMail, FiCalendar, FiLock, FiEdit2, FiPlus, FiX } from 'react-icons/fi'
import { useUser } from '@/hooks/useUser'

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  birthDate: string;
  email: string;
  bio: string;
  interests: { id: number, name: string }[];
}

const Settings = () => {
  const userStorage = useUser()
  const [originalData, setOriginalData] = useState<UserData | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [newInterest, setNewInterest] = useState('')
  const [activeTab, setActiveTab] = useState('informations')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isDisabled =
    (activeTab === 'informations' && (!password || JSON.stringify(user) === JSON.stringify(originalData))) ||
    (activeTab === 'profile' && JSON.stringify(user) === JSON.stringify(originalData))

  useEffect(() => {
    if (!userStorage?.id) return
    
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/users/getProfile/${userStorage.id}`)
        const data = await res.json()
        data.interests = data.interests || []
        setOriginalData(data)
        setUser(data)
      } catch (err) {
        setError("Erreur lors du chargement des données")
      }
      finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [userStorage])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      let res
      let body

      if (activeTab === "informations") {
        body = {
          email: user?.email,
          username: user?.username,
          firstName: user?.firstName,
          lastName: user?.lastName,
          birthDate: user?.birthDate,
          password: password
        }

        res = await fetch(`http://localhost:4000/api/users/updateProfile/${userStorage?.id}`, {
          method: 'PUT',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
      }
      else if (activeTab === "profile") {
        const interests = (user?.interests || []).map(interest => interest.name)

        body = {
          bio: user?.bio || '',
          interests: interests
        }

        res = await fetch(`http://localhost:4000/api/users/updateInfos/${userStorage?.id}`, {
          method: 'PUT',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
      }

      if (!res || !res.ok) {
        const errorData = await res?.json()
        throw new Error(errorData.message || "Erreur lors de la mise à jour des informations")
      }

      const updatedUser = await res.json()
      setOriginalData(updatedUser)
      setUser(updatedUser);
      setPassword('');
      setSuccess('Modifications enregistrées avec succès !');
      setTimeout(() => setSuccess(null), 3000);
    }
    catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      else {
        setError('Une erreur est survenue')
      }
      setTimeout(() => setError(null), 3000)
    }
  }

  const addInterest = () => {
    if (!newInterest.trim() || !user) return
  
    const trimmedInterest = newInterest.trim()
  
    if (user.interests.some(interest => interest.name.toLowerCase() === trimmedInterest.toLowerCase())) return
    if (user.interests.length >= 8) return
  
    const newId = Date.now() 
    setUser({
      ...user,
      interests: [...user.interests, { id: newId, name: trimmedInterest }]
    })
    setNewInterest('')
  }

  const removeInterest = (interestToRemove: string) => {
    if (!user) return
  
    setUser({
      ...user,
      interests: user.interests.filter(interest => interest.name !== interestToRemove)
    })
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addInterest()
    }
  }

  if (userStorage === null || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Chargement...</p>
      </div>
    )
  }

  if (!userStorage || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error || 'Vous devez être connecté pour accéder à cette page'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF1F3] via-[#F9F2F9] to-[#F5F3FF] pt-16">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Paramètres du compte</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        
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
                  <FiMail className="absolute left-3 top-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                <div className="relative">
                  <input
                    type="date"
                    value={user.birthDate ? user.birthDate.split('T')[0] : ''}  
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
                    required
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
                  value={user.bio || ''}
                  onChange={(e) => setUser({...user, bio: e.target.value})}
                  className="w-full p-3 border rounded-lg h-24"
                  placeholder="Décrivez-vous en quelques mots..."
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {user.bio?.length || 0}/300 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Centres d'intérêt ({(user.interests || []).length}/8)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(user.interests || []).map((interest) => (
                    <div key={interest.id} className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      <span className="text-sm">{interest.name}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(interest.name)}
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
                    onKeyPress={handleKeyPress}
                    className="flex-1 p-3 border rounded-lg"
                    placeholder="Ajouter un centre d'intérêt"
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    disabled={(user.interests || []).length >= 8 || !newInterest.trim()}
                    className={`${
                      (user.interests || []).length >= 8 || !newInterest.trim()
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
            disabled={isDisabled}
            className={`${
              isDisabled
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] hover:opacity-90 cursor-pointer'
            } text-white py-3 px-6 rounded-lg font-medium transition-opacity`}
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings