import React, { useEffect, useState, useRef } from 'react';
import { FaBell, FaEnvelope, FaHeart, FaUser, FaComment } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

const notifications = [
    { id: 1, icon: <FaHeart className="text-pink-500" />, message: "Tu as un nouveau match !" },
    { id: 2, icon: <FaComment className="text-blue-500" />, message: "Quelqu'un t'a envoyé un message." },
    { id: 3, icon: <FaUser className="text-green-500" />, message: "Ton profil a été visité." },
];  

const Header = () => {
    const user = useUser();
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
          if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
            setShowNotifications(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    

    if (!user) {
        return (
            <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-16 flex items-center justify-between px-6">
                <a href="/home" className="flex items-center">
                    <img src="/logo2.png" alt="Logo" className="h-13 w-auto" />
                </a>
            </header>
        )
    }

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-16 flex items-center justify-between px-6">
            <a href="/home" className="flex items-center">
                <img src="/logo2.png" alt="Logo" className="h-13 w-auto" />
            </a>

            <div className="flex items-center space-x-6">
                <button onClick={() => {router.push("/matches")}} className="cursor-pointer bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                    Mes matchs
                </button>

                <button onClick={() => {router.push("/messages")}} className="relative cursor-pointer text-gray-700 hover:text-black">
                    <FaEnvelope size={20} />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        2
                    </span>
                </button>

                <div className="relative" ref={notificationRef}>
                    <div onClick={() => setShowNotifications(!showNotifications)} className="cursor-pointer text-gray-700 hover:text-black">
                        <FaBell size={20} />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">5</span>
                    </div>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-50 p-4 space-y-2">
                            {notifications.map(notif => (
                            <div key={notif.id} className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md transition">
                                <div className="w-8 h-8 flex items-center justify-center text-xl">
                                {notif.icon}
                                </div>
                                <span className="text-sm text-gray-700">{notif.message}</span>
                            </div>
                            ))}
                        </div>
                    )}
                </div>

                <button onClick={() => {router.push("/profile")}} className="flex items-center space-x-2 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                        <img src={user.avatar || "/default_avatar.png"} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <a className="text-gray-700 font-medium">{user.username || "invité"}</a>
                </button>
            </div>
        </header>
    );
};

export default Header;