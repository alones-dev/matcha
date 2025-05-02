import React, { useState, useEffect } from 'react'
import { getAge } from '@/utils/date';
import { Swiper, SwiperSlide} from 'swiper/react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { IoMdMale, IoMdFemale } from 'react-icons/io'
import { useUser } from '@/hooks/useUser'
import Image from 'next/image';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { calculateDistance } from '@/utils/distance';
import UserFilters from './UserFilters';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

interface User {
    id: number;
    avatar: string;
    firstName: string;
    lastName: string;
    username: string;
    gender: 'male' | 'female';
    birthDate: string;
    bio: string;
    photos: { id: number, url: string }[];
    interests: { id: number, name: string }[];
    latitude: number;
    longitude: number;
    sentLikes: number[];
}

const Home = () => {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [likedUsers, setLikedUsers] = useState<number[]>([])
    const [currentUserCoords, setCurrentUserCoords] = useState<{ latitude: number; longitude: number }>({
        latitude: 0,
        longitude: 0
    })
    const [showFilters, setShowFilters] = useState(false);
    const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
    const [ageRange, setAgeRange] = useState<[number, number]>([18, 100]);
    const [maxDistance, setMaxDistance] = useState<number>(1000000);
    const [matchInterestsOnly, setMatchInterestsOnly] = useState(false);

    const userStorage = useUser()

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

                const currentUser = data.find((user: User) => user.id.toString() === userStorage?.id?.toString());
                if (currentUser) {
                    setCurrentUserCoords({
                        latitude: currentUser.latitude,
                        longitude: currentUser.longitude
                    });

                    const likedIds = currentUser.sentLikes.map((like: any) => like.receiverId);
                    setLikedUsers(likedIds);
                    console.log('Liked users:', likedIds);
                }
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
    }, [userStorage])

    useEffect(() => {
        if (!users || users.length === 0 || !userStorage) return;
    
        const filtered = users.filter((user) => {
            if (user.id.toString() === userStorage.id.toString()) return false;
    
            const age = getAge(user.birthDate);
            if (age < ageRange[0] || age > ageRange[1]) return false;
    
            if (genderFilter !== 'all' && user.gender !== genderFilter) return false;
    
            const distance = calculateDistance(
                user.latitude,
                user.longitude,
                currentUserCoords.latitude,
                currentUserCoords.longitude
            );
            if (distance > maxDistance) return false;
    
            if (matchInterestsOnly) {
                const currentUser = users.find(u => u.id.toString() === userStorage.id.toString());
                const currentUserInterests = currentUser?.interests.map(i => i.name) || [];
                const sharedInterests = user.interests.filter(i => currentUserInterests.includes(i.name));
                if (sharedInterests.length === 0) return false;
            }
    
            return true;
        });
    
        setFilteredUsers(filtered);
    }, [users, genderFilter, ageRange, maxDistance, matchInterestsOnly, currentUserCoords, userStorage]);
    

    const handleLike = async (userId: number): Promise<void> => {
        try {
            const body = {
                userLiked: userId,
                userId: userStorage?.id
            };
    
            if (likedUsers.includes(userId)) {
                const res = await fetch("http://localhost:4000/api/users/unlike", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(body)
                });
                
                if (!res.ok) throw new Error('Erreur lors de la suppression du like');
                
                setLikedUsers(prev => prev.filter(id => id !== userId));
            } else {
                const res = await fetch("http://localhost:4000/api/users/like", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(body)
                });
                
                if (!res.ok) throw new Error('Erreur lors de l\'ajout du like');
                
                setLikedUsers(prev => [...prev, userId]);
            }
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
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">{error || 'Vous devez être connecté pour accéder à cette page'}</p>
            </div>
        )
    }
    
    if (filteredUsers.length === 0) {
        const filtersActive = 
            genderFilter !== 'all' ||
            ageRange[0] !== 18 || ageRange[1] !== 100 ||
            maxDistance !== 100 ||
            matchInterestsOnly;
    
        return (
            <div className="flex flex-col items-center min-h-screen p-4 bg-transparent">
                <UserFilters
                    show={showFilters}
                    onToggle={() => setShowFilters(prev => !prev)}
                    gender={genderFilter}
                    setGender={setGenderFilter}
                    ageRange={ageRange}
                    setAgeRange={setAgeRange}
                    maxDistance={maxDistance}
                    setMaxDistance={setMaxDistance}
                    matchInterestsOnly={matchInterestsOnly}
                    setMatchInterestsOnly={setMatchInterestsOnly}
                />
    
                <div className="flex flex-col items-center justify-center h-full text-center mt-16">
                    <p className="text-gray-500 text-lg mb-2">
                        Aucun utilisateur ne correspond aux filtres sélectionnés.
                    </p>
                    {filtersActive && (
                        <p className="text-sm text-gray-400">
                            Essayez d’élargir vos critères de recherche pour voir plus de profils.
                        </p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-transparent">
            <UserFilters
                show={showFilters}
                onToggle={() => setShowFilters(prev => !prev)}
                gender={genderFilter}
                setGender={setGenderFilter}
                ageRange={ageRange}
                setAgeRange={setAgeRange}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
                matchInterestsOnly={matchInterestsOnly}
                setMatchInterestsOnly={setMatchInterestsOnly}
            />

            {filteredUsers.map((user) => {
                const isLiked = likedUsers.includes(user.id);

                return (
                    <div key={user.id} className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 mb-6 relative">
                        
                            <div className="absolute top-4 right-4 bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs font-medium">
                            {currentUserCoords.latitude && currentUserCoords.longitude 
                                ? `${calculateDistance(
                                    user.latitude,
                                    user.longitude,
                                    currentUserCoords.latitude,
                                    currentUserCoords.longitude
                                )} km`
                                : 'Distance inconnue'}
                            </div>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow">
                                <Image 
                                    src={user.avatar || '/default_avatar.png'}
                                    alt={`${user.username}'s profile`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            
                            <div className="flex-1">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    {user.firstName} {user.lastName}
                                    {user.gender === 'male' && <IoMdMale className="text-blue-500" />}
                                    {user.gender === 'female' && <IoMdFemale className="text-pink-500" />}
                                </h2>
                                <p className="text-gray-500 text-sm">@{user.username}</p>
                                <p className="text-gray-600 text-sm">{getAge(user.birthDate)} ans</p>
                            </div>
                        </div>

                        {user.bio && (
                            <div className="mb-4">
                                <p className="text-gray-700 italic">{user.bio}</p>
                            </div>
                        )}
                        
                        <div className="mb-6">
                            <h3 className="text-md font-semibold mb-2">Photos</h3>
                            {user.photos.length > 0 ? (
                                <Swiper
                                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    navigation
                                    pagination={{ clickable: true }}
                                    scrollbar={{ draggable: true }}
                                    className="rounded-lg overflow-hidden"
                                >
                                    {user.photos.map((photo, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                <Image 
                                                    src={photo.url}
                                                    alt={`Photo ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-500">Pas de photos</p>
                                </div>
                            )}
                        </div>
                        
                        {user.interests.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-md font-semibold mb-2">Centres d'intérêt</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.interests.map((interest, index) => (
                                        <span 
                                            key={index}
                                            className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                                        >
                                            {interest.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="flex justify-center">
                                <button 
                                    onClick={() => handleLike(user.id)}
                                    className={`cursor-pointer flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                                        isLiked 
                                            ? 'bg-pink-600 text-white hover:bg-pink-700'
                                            : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                                    }`}
                                >
                                    {isLiked ? (
                                        <FaHeart className="text-lg" />
                                    ) : (
                                        <FiHeart className="text-lg" />
                                    )}
                                    <span>{isLiked ? 'Liké' : 'Like'}</span>
                                </button>
                            </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Home