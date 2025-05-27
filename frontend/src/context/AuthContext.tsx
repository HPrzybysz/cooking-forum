import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = localStorage.getItem('token');
                if (storedToken) {
                    const response = await api.get('/api/users/me');
                    setUser(response.data);
                    setToken(storedToken);
                }
            } catch (error) {
                localStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await api.post('/api/auth/login', { email, password });
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            setUser(user);
            setToken(token);
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => {
        setIsLoading(true);
        try {
            const response = await api.post('/api/auth/register', {
                firstName,
                lastName,
                email,
                password,
            });
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            setUser(user);
            setToken(token);
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
        }
    };

    const value = { user, token, isLoading, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}