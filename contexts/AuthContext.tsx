
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { useData } from './DataContext';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    register: (nickname: string, email: string, pass: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { users, addUser } = useData();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('cultur_user');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('cultur_user');
        }
        setLoading(false);
    }, []);

    const login = async (email: string, pass: string): Promise<boolean> => {
        // In a real app, 'pass' would be hashed and compared on a server
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user && user.passwordHash === pass) { // Simple text comparison for this demo
            setCurrentUser(user);
            localStorage.setItem('cultur_user', JSON.stringify(user));
            return true;
        }
        return false;
    };

    const register = async (nickname: string, email: string, pass: string): Promise<boolean> => {
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return false; // User already exists
        }
        const newUser = addUser(nickname, email, pass);
        setCurrentUser(newUser);
        localStorage.setItem('cultur_user', JSON.stringify(newUser));
        return true;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('cultur_user');
    };
    
    return (
        <AuthContext.Provider value={{ currentUser, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
