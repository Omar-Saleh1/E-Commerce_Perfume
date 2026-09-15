'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '@/types';
import { ApiClient } from '@/patterns/api/AbstractApiClientFactory';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem('nexus_token');
    const savedUser = localStorage.getItem('nexus_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await ApiClient.login(email, password);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('nexus_token', res.token);
      localStorage.setItem('nexus_user', JSON.stringify(res.user));
      showToast(`Welcome back, ${res.user.name}! ✨`);
      return true;
    } catch (e: any) {
      showToast(e.message || 'Login failed', 'error');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const res = await ApiClient.register(name, email, password, phone);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('nexus_token', res.token);
      localStorage.setItem('nexus_user', JSON.stringify(res.user));
      showToast(`Account created! Welcome, ${res.user.name} 🎉`);
      return true;
    } catch (e: any) {
      showToast(e.message || 'Registration failed', 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    showToast('Signed out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
