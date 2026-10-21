'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, LoginRequest, RegisterRequest } from '../domain/types';
import { authService } from '../services/authService';
import { getToken, getStoredUser } from '../../common/http';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inicializar y sincronizar sesión desde localStorage al montar
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUser(storedUser);

      // Opcional: Revalidar con el servidor en segundo plano
      authService
        .getProfile()
        .then((res) => {
          if (res?.user) {
            setUser(res.user);
          }
        })
        .catch(() => {
          // Si falló por 401, http.ts ya limpia el token y dispara nido-auth-expired
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    // Escuchar expiración de token provocada por 401 en http.ts
    const handleAuthExpired = () => {
      setUser(null);
      setTokenState(null);
    };

    window.addEventListener('nido-auth-expired', handleAuthExpired);
    return () => window.removeEventListener('nido-auth-expired', handleAuthExpired);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    setUser(response.user);
    setTokenState(response.token);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setUser(response.user);
    setTokenState(response.token);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setTokenState(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
