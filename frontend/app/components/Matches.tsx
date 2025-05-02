"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { FaRegCommentAlt, FaTimes } from 'react-icons/fa'
import { useUser } from '@/hooks/useUser'

type MatchProfile = {
  id: number
  firstName: string
  lastName: string
  username: string
  avatar: string
  age: number
}


const Matches = () => {
  const user = useUser()
  const [matches, setMatches] = useState<MatchProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const fetchMatches = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/users/matches/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
        const data = await res.json()
        setMatches(data)
      }
      catch(error) {
        if (error instanceof Error) {
          setError(error.message)
        }
        else {
          setError('Une erreur est survenue lors de la récupération des matchs')
        }
      }
      finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [user])

  const handleMessage = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Message à', userId)
  }

  const handleUnmatch = async (userId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      const body = {
        userLiked: userId,
        userId: user?.id
      }

      const res = await fetch("http://localhost:4000/api/users/unlike", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression du like');

      setMatches((prevMatches) => prevMatches.filter((match) => match.id !== userId))
    }
    catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      else {
        setError('Une erreur est survenue lors de la suppression du match')
      }
    }
  }

  if (user === null || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Chargement...</p>
      </div>
    )
  }
  if (error) {
      return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-red-500">{error || 'Vous devez être connecté pour accéder à cette page'}</p>
        </div>
      )
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
                className="rounded-lg p-4 shadow-sm flex justify-between"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={match.avatar}
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
                    className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Envoyer un message"
                  >
                    <FaRegCommentAlt size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleUnmatch(match.id, e)}
                    className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
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