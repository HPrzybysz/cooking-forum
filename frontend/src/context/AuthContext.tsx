import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

interface AuthContextType {
    user: any;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        confirmPassword: string
    ) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
    children: ReactNode;
}

const getFriendlyErrorMessage = (error: any, defaultMessage: string): string => {
    if (!error.response) {
        return "Network error. Please check your connection.";
    }

    const {status, data} = error.response;

    switch (status) {
        case 400:
            return data.error || "Invalid request. Please check your input.";
        case 401:
            return "Incorrect email or password. Please try again.";
        case 409:
            return "Email already exists. Please use a different email.";
        case 422:
            if (data.errors) {
                return Object.values(data.errors).join(' ');
            }
            return "Validation failed. Please check your input.";
        case 500:
            return "Server error. Please try again later.";
        default:
            return defaultMessage;
    }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        const checkAuthOnLoad = async () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                try {
                    const response = await axios.get('/auth/me', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setUser(JSON.parse(userData));
                } catch (err) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        checkAuthOnLoad();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/auth/login', {email, password});
            const {user, token} = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(user);
            navigate('/');
        } catch (err: any) {
            const friendlyError = getFriendlyErrorMessage(err, 'Login failed. Please try again.');
            setError(friendlyError);
            throw new Error(friendlyError);
        } finally {
            setLoading(false);
        }
    };

    const register = async (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        confirmPassword: string
    ) => {
        setLoading(true);
        setError(null);
        try {
            // Client-side validation
            if (password !== confirmPassword) {
                throw {response: {data: {error: "Passwords do not match"}}};
            }

            const response = await axios.post('/auth/register', {
                firstName,
                lastName,
                email,
                password,
                confirmPassword
            });
            const {user, token} = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(user);
            navigate('/');
        } catch (err: any) {
            const friendlyError = getFriendlyErrorMessage(err, 'Registration failed. Please try again.');
            setError(friendlyError);
            throw new Error(friendlyError);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post('/auth/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            navigate('/login');
        }
    };

    const checkAuth = async (): Promise<boolean> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            const response = await axios.get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data.user);
            return true;
        } catch (err) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                register,
                logout,
                checkAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);