"use client"

import React from 'react'
import Image from 'next/image'
import { FaRegCommentAlt, FaTimes } from 'react-icons/fa'

const Matches = () => {
  // Données de démo pour les matchs
  const matches = [
    {
      id: 1,
      profilePic: '/default_avatar.png',
      firstName: 'Jean',
      lastName: 'Dupont',
      username: 'jeandupont42',
      age: 28,
    },
    {
      id: 2,
      profilePic: '/default_avatar.png',
      firstName: 'Marie',
      lastName: 'Martin',
      username: 'mariem',
      age: 25,
    },
  ]

  const handleMessage = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Message à', userId)
  }

  const handleUnmatch = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Unmatch avec', userId)
  }

  const handleProfileClick = (userId: number) => {
    console.log('Voir le profil de', userId)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 relative flex flex-col h-[85vh]">
        <h1 className="text-2xl font-bold mb-6">Mes matchs</h1>
        
        {matches.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Vous n'avez pas encore de matchs</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <div 
                key={match.id} 
                className="rounded-lg p-4 inset-shadow-sm shadow-sm drop-shadow-sm cursor-pointer flex justify-between"
                onClick={() => handleProfileClick(match.id)}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={match.profilePic}
                      alt={`${match.firstName} ${match.lastName}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold truncate">{match.firstName} {match.lastName}, {match.age} ans</h2>
                    <p className="text-gray-500 text-sm truncate">@{match.username}</p>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center items-center space-y-2 ml-4">
                  <button 
                    onClick={(e) => handleMessage(match.id, e)}
                    className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                    title="Envoyer un message"
                  >
                    <FaRegCommentAlt size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleUnmatch(match.id, e)}
                    className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                    title="Supprimer le match"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Matches