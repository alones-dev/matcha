import { useState, useEffect } from 'react';

interface User  {
    id: string;
    email: string;
    username: string;
    avatar: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return user;
};
