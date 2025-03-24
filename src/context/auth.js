"use client";
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const login = (email, password) => {
        // In a real app, you would call your API here
        return new Promise((resolve) => {
            setTimeout(() => {
                setUser({ email, name: email.split('@')[0] });
                setIsAuthenticated(true);
                resolve(true);
            }, 1000);
        });
    };

    const register = (email, password, name) => {
        // In a real app, you would call your API here
        return new Promise((resolve) => {
            setTimeout(() => {
                setUser({ email, name });
                setIsAuthenticated(true);
                resolve(true);
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout ,authModalOpen ,setAuthModalOpen}}>
            {children}
        </AuthContext.Provider>
    );
};