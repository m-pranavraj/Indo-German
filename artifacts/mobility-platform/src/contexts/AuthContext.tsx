import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@workspace/api-client-react/src/generated/api.schemas';
import { setAuthTokenGetter } from '@workspace/api-client-react';
import { useLocation } from 'wouter';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredToken(): string | null {
  try {
    const stored = localStorage.getItem('mobility_user');
    if (!stored) return null;
    return JSON.parse(stored)?.token ?? null;
  } catch { return null; }
}

// Wire the generated API client to always read the latest token from localStorage
setAuthTokenGetter(getStoredToken);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('mobility_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        // Also keep axios in sync for any direct axios calls
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + parsed.token;
      } catch (e) {
        console.error('Failed to parse auth data');
      }
    }
  }, []);

  const login = (newUser: User, token: string) => {
    setUser(newUser);
    localStorage.setItem('mobility_user', JSON.stringify({ user: newUser, token }));
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    setLocation(`/${newUser.role}/dashboard`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mobility_user');
    delete axios.defaults.headers.common['Authorization'];
    setLocation('/');
  };

  const getToken = () => getStoredToken();

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
