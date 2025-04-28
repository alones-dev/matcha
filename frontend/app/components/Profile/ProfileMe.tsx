"use client"

import React, { useEffect, useState } from 'react'
import { FiSettings, FiEdit, FiLogOut, FiCamera } from 'react-icons/fi'
import { BsCake2 } from "react-icons/bs";
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/hooks/useUser'

interface UserData {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string;
  username: string;
  birthDate: string;
  bio: string;
  photos: string[];
  interests: string[];
}

const ProfileMe = () => {
  const user = {
    avatar: '/default_avatar.png',
    firstName: 'Jean',
    lastName: 'Dupont',
    username: 'jeandupont',
    birthDate: '15/03/1990',
    bio: 'Photographe amateur | Voyageur | Coffee addict',
    photos: [
    ].filter(Boolean),
    interests: ['Photographie', 'Voyage', 'Café', 'Randonnée', 'Technologie']
  }

  const { logout } = useAuth()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const userStorage = useUser()


  if (!userStorage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Chargement...</p>
      </div>
    )
  }

  return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 relative">
          
          <div className="absolute top-4 right-4 flex gap-2">
            <a href="/profile/settings" className="cursor-pointer p-2 rounded-full hover:bg-gray-100">
              <FiSettings className="text-gray-600 text-xl" />
            </a>
            
            <button 
              onClick={logout}
              className="cursor-pointer p-2 rounded-full hover:bg-gray-100"
              aria-label="Déconnexion"
            >
              <FiLogOut className="text-pink-500 text-xl" />
            </button>
          </div>
          
          <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
            <div 
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white shadow cursor-pointer group"
              onClick={() => alert('Modifier la photo de profil')}
            >
              <Image 
                src={user.avatar}
                alt={`${user.username}'s profile`}
                fill
                className="object-cover group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <FiCamera className="text-white text-2xl" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
              <p className="text-gray-500">@{userStorage.username}</p>
              
              <div className="my-4">
                <div className="flex items-center text-gray-700 gap-2">
                  <BsCake2 className="text-pink-500" />
                  <span>{user.birthDate}</span>
                </div>
                {user.bio && (
                  <p className="mt-2 text-gray-800 italic">"{user.bio}"</p>
                )}
              </div>
            </div>
          </div>

          {user.interests.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Centres d'intérêt</h2>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {user.photos.length > 0 && (
            <div className="mt-8 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Mes photos</h2>
                <button 
                  className="cursor-pointer flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <FiEdit className="text-base" />
                  <span>Modifier</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {user.photos.map((photo, index) => (
                  <div key={index} className="group aspect-square rounded-lg overflow-hidden shadow relative">
                    <Image
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                    <button className="cursor-pointer absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiEdit className="text-white text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
  )
}

export default ProfileMe