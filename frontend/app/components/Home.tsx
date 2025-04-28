import React, { useState, useEffect } from 'react'

interface User {
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

const Home = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/users/getAllUsers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                })
                if (!res.ok) {
                    throw new Error('Erreur lors de la récupération des utilisateurs')
                }

                const data = await res.json()
                if (data.error) {
                    throw new Error(data.error)
                }
                setUsers(data)
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError('Une erreur inconnue est survenue')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    if (loading) {
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
    if (users.length === 0 || users.length === 1) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Aucun utilisateurs trouvés</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            
        </div>  
    )
}

export default Home