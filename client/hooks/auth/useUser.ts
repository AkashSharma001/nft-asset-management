'use client'

import { useState, useEffect } from 'react';
import { trpc } from '../../lib/trpc';

export const useUser = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = trpc.user.loginOrRegister.useMutation({
    onSuccess: (user) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.id);
      }
      setEmail(user.email);
      setUserId(user.id);
    }
  });

  useEffect(() => {
    // Immediately check localStorage and update state
    const checkAuth = () => {
      const storedEmail = localStorage.getItem('userEmail');
      const storedId = localStorage.getItem('userId');
      
      if (storedEmail && storedId) {
        setEmail(storedEmail);
        setUserId(storedId);
      }
      
      setIsLoading(false);
    };

    // Run immediately if window is defined
    if (typeof window !== 'undefined') {
      checkAuth();
    }
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({ email });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
    }
    setEmail(null);
    setUserId(null);
  };

  return {
    email,
    userId,
    isLoading: isLoading || loginMutation.isLoading,
    login,
    logout,
    error: loginMutation.error?.message,
  };
}; 