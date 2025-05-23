"use client"

import React, { useState, useEffect } from 'react'
import { FiSettings, FiEdit, FiLogOut, FiCamera, FiPlus } from 'react-icons/fi'
import { BsCake2 } from "react-icons/bs";
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/hooks/useUser'
import { formatDate, getAge } from '@/utils/date'
import ChangeProfilePicture from './ChangeProfilePicture'
import ManagePhotos from './ManagePhotos'

interface UserData {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string;
  username: string;
  birthDate: string;
  bio: string;
  photos: { id: number, url: string }[];
  interests: { id: number, name: string }[];
}

const ProfileMe = () => {
  const { logout } = useAuth()
  const userStorage = useUser()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showChangeProfilePicture, setShowChangeProfilePicture] = useState(false)
  const [showManagePhotos, setShowManagePhotos] = useState(false)

  useEffect(() => {
    if (userStorage === null) {
      return
    }

    if (!userStorage) {
      setError('Utilisateur non connecté');
      setLoading(false);
      return;
    }
  
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/users/getProfile/${userStorage.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des données utilisateur')
        }

        const data = await res.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setUserData(data)
      }
      catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        }
        else {
          setError('Une erreur inconnue est survenue')
        }
      }
      finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userStorage])

  const handleUpdateProfilePicture = async (file: File) => {
    if (userStorage === null) {
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`http://localhost:4000/api/users/updateAvatar/${userStorage.id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'image de profil')
      }

      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      }
      
      const updatedUser = {
        ...userStorage,
        avatar: data.avatar,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))

      setShowChangeProfilePicture(false)
      window.location.reload()
    }
    catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      else {
        setError('Une erreur inconnue est survenue')
      }
    }
  }

  const handleUpdatePhotos = async (files: (File | null)[], deletions: number[]) => {
    if (userStorage === null || !userData) {
      return;
    }
  
    try {
      const formData = new FormData();
      
      files.forEach((file) => {
        if (file) {
          formData.append('photos', file); 
        }
      });
  
      const photoIdsToDelete = deletions.filter(id => id !== null);
      if (photoIdsToDelete.length === 0) {
        formData.append('deletions', JSON.stringify([]));
      } else {
        formData.append('deletions', JSON.stringify(photoIdsToDelete));
      }
  
      const res = await fetch(`http://localhost:4000/api/users/updatePhotos/${userStorage.id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
  
      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour des photos');
      }
  
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
      setUserData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          photos: data.photos
        };
      });
  
      setShowManagePhotos(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    }
  };

  if (userStorage === null || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Chargement...</p>
      </div>
    )
  }

  if (error || !userStorage || !userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error || 'Vous devez être connecté pour accéder à cette page'}</p>
      </div>
    )
  }

  return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 relative">
          
          <div className="absolute top-4 right-4 flex gap-2">
            <a 
              href="/profile/settings"
              className="cursor-pointer p-2 rounded-full hover:bg-gray-100"
            >
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
              onClick={() => setShowChangeProfilePicture(true)}
            >
              <Image 
                src={userData.avatar || '/default_avatar.png'}
                alt={`${userData.username}'s profile`}
                fill
                className="object-cover group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <FiCamera className="text-white text-2xl" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{userData.firstName} {userData.lastName}</h1>
              <p className="text-gray-500">@{userData.username}</p>
              
              <div className="my-4">
                <div className="flex items-center text-gray-700 gap-2">
                  <BsCake2 className="text-pink-500" />
                  <span>{formatDate(userData.birthDate)} <a>({getAge(userData.birthDate)} ans)</a></span>
                </div>
                <p className="mt-2 text-gray-800 italic">{userData.bio || "Aucune bio."}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Centres d'intérêt</h2>
            {userData.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userData.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  >
                    {interest.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Aucun centres d'intérêts.</p>
            )}
          </div>
          
          <div className="mt-8 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Mes photos</h2>
              <button 
                className="cursor-pointer flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                onClick={() => setShowManagePhotos(true)}
              >
                <FiEdit className="text-base" />
                <span>Modifier</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const photo = userData.photos[index];
                return (
                  <div 
                    key={photo ? photo.id : `empty-${index}`} 
                    className="group aspect-square rounded-lg overflow-hidden shadow relative bg-gray-100 cursor-pointer"
                  >
                    {photo ? (
                      <>
                        <Image
                          src={photo.url}
                          alt={`Photo ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/default-photo.png';
                          }}
                        />
                        <button 
                          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setShowManagePhotos(true)}
                        >
                          <FiEdit className="text-white text-sm" />
                        </button>
                      </>
                    ) : (
                      <button 
                        className="cursor-pointer w-full h-full flex items-center justify-center text-gray-400"
                        onClick={() => setShowManagePhotos(true)}
                      >
                        <FiPlus className="text-2xl" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {showChangeProfilePicture && userData && (
          <ChangeProfilePicture
            currentAvatar={userData.avatar}
            onClose={() => setShowChangeProfilePicture(false)}
            onSave={handleUpdateProfilePicture}
          />
        )}

        {showManagePhotos && userData && (
          <ManagePhotos
            initialPhotos={userData.photos}
            onClose={() => setShowManagePhotos(false)}
            onSave={handleUpdatePhotos}
          />
        )}
      </div>
  )
}

export default ProfileMe