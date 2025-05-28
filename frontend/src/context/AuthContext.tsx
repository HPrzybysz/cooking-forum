import React, {createContext, useContext, useEffect, useState} from 'react';
import api from '../api';

export interface User {
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
    setUser: (user: (prev: (User | null)) => (null | {
        firstName: string;
        lastName: string;
        avatarUrl: any;
        id: number;
        email: string
    })) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const transformUser = (backendUser: any): User => ({
        id: backendUser.id,
        firstName: backendUser.first_name,
        lastName: backendUser.last_name,
        email: backendUser.email,
        avatarUrl: backendUser.avatar_url
    });


    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = localStorage.getItem('token');
                if (storedToken) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    const response = await api.get('/api/users/me');
                    setUser(transformUser(response.data));

                    setUser({
                        id: response.data.id,
                        firstName: response.data.first_name,
                        lastName: response.data.last_name,
                        email: response.data.email,
                        avatarUrl: response.data.avatar_url
                    });
                    setToken(storedToken);
                }
            } catch (error) {
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await api.post('/api/auth/login', {email, password});
            const {user: backendUser, token} = response.data;
            setUser(transformUser(backendUser));

            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(user);
            setToken(token);
            window.location.reload();
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
            const {user, token} = response.data;

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
            await api.post('/api/auth/logout', {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
            setToken(null);
        }
    };

    const value = {user, token, isLoading, login, register, logout, setUser};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
