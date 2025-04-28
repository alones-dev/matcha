"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/app/components/Header'

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

    if (!user) {
        return <div>Chargement...</div>
    }

    return (
        <div className="min-h-screen fixed inset-0 bg-gradient-to-b from-[#FEF1F3] via-[#F9F2F9] to-[#F5F3FF] pt-16 overflow-y-auto">
            <Header />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold text-gray-800">Bienvenue, {user.username}!</h1>
                <p className="mt-4 text-lg text-gray-600">Ceci est votre page d'accueil.</p>
                <div className="mt-8">
                    <img src="/logo2.png" alt="Logo" className="h-32 w-auto" />
                </div>
                <div className="mt-4">
                    <p className="text-gray-600">Vous êtes connecté en tant que {user.email}.</p>
                </div>
                <div className="mt-4">
                    <button className="bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                        Déconnexion
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-gray-600">Vous pouvez maintenant explorer notre application.</p>
                </div>
                <div className="mt-4">
                    <p className="text-gray-600">Merci de nous avoir rejoint!</p>
                </div>
                <div className="mt-4">
                    <p className="text-gray-600">N'hésitez pas à nous contacter si vous avez des questions.</p>
                </div>
                <div className="mt-4">
                    <p className="text-gray-600">Nous espérons que vous apprécierez votre expérience!</p>
                </div>
                <div className="mt-4">
                    <p className="text-gray-600">Bonne navigation!</p>
                </div>
                <div className="mt-4">
                    <p className="text-gray-600">L'équipe de l'application</p>
                </div>
                <div className="mt-4">
                    <p className="text-gray-600">© 2023 Votre entreprise. Tous droits réservés.</p>
                </div>
                <div className="mt-4">
                    <p className="text-gray-600">Politique de confidentialité | Conditions d'utilisation</p>
                </div>
            </div>
        </div>
    )
}

export default page