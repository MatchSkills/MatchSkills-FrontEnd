'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { setAccessToken } from '@/lib/axios';
import { AUTH_KEYS } from '@/lib/constants';
import {
  AuthResponse,
  LoginCandidateCredentials,
  LoginCompanyCredentials,
  RegisterCandidateDTO,
  RegisterCompanyDTO,
  User,
  UserRole,
} from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginCandidate: (credentials: LoginCandidateCredentials) => Promise<void>;
  loginCompany: (credentials: LoginCompanyCredentials) => Promise<void>;
  registerCandidate: (data: RegisterCandidateDTO) => Promise<void>;
  registerCompany: (data: RegisterCompanyDTO) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [accessToken, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load session from localStorage on initial render
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
      const storedUser = localStorage.getItem(AUTH_KEYS.USER_DATA);

      if (storedToken && storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
        setTokenState(storedToken);
        setAccessToken(storedToken);
      }
    } catch {
      // Clear invalid storage
      localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AUTH_KEYS.USER_DATA);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAuthSuccess = (response: AuthResponse) => {
    setUser(response.user);
    setRole(response.user.role);
    setTokenState(response.accessToken);
    setAccessToken(response.accessToken);

    localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, response.accessToken);
    localStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(response.user));

    toast.success(`Bem-vindo, ${response.user.name}!`);

    if (response.user.role === 'company') {
      router.push('/dashboard');
    } else {
      router.push('/jobs');
    }
  };

  const loginCandidate = async (credentials: LoginCandidateCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.loginCandidate(credentials);
      handleAuthSuccess(response);
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      const errorMsg = serverMessage || 'Credenciais inválidas. Verifique seu e-mail e senha.';
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginCompany = async (credentials: LoginCompanyCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.loginCompany(credentials);
      handleAuthSuccess(response);
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      const errorMsg = serverMessage || 'Credenciais inválidas. Verifique seu CNPJ e senha.';
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerCandidate = async (data: RegisterCandidateDTO) => {
    setIsLoading(true);
    try {
      const response = await authService.registerCandidate(data);
      handleAuthSuccess(response);
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      const errorMsg = serverMessage || 'Erro ao realizar cadastro. Tente novamente.';
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerCompany = async (data: RegisterCompanyDTO) => {
    setIsLoading(true);
    try {
      const response = await authService.registerCompany(data);
      handleAuthSuccess(response);
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      const errorMsg = serverMessage || 'Erro ao cadastrar empresa. Tente novamente.';
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setRole(null);
      setTokenState(null);
      setAccessToken(null);

      localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AUTH_KEYS.USER_DATA);

      toast.info('Você saiu da sua conta.');
      router.push('/landing');
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;
    const newUserData = { ...user, ...updatedUser };
    setUser(newUserData);
    localStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        loginCandidate,
        loginCompany,
        registerCandidate,
        registerCompany,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
