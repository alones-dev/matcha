"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User  {
    id: string;
    email: string;
    username: string;
    avatar: string;
}

const page = () => {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        };

        setUser(JSON.parse(userData));
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    }

    if (!user) {
        return <div>Chargement...</div>
    }

    return (
        <div >
            <a>Welcome, {user ? user.username : "invité"}</a>
            <button
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
                onClick={handleLogout}
            >
                Déconnexion
            </button>
        </div>
    )
}

export default page