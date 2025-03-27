"use client";
import {createContext, useEffect, useState} from 'react';
import {auth} from "../lib/firebase.config";
import { onAuthStateChanged,signOut } from "firebase/auth";

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

    const logout = async () => {
        try{
            await signOut();
            setUser(null);
            setIsAuthenticated(false);
        }catch (exception){
            console.log(exception);
        }

    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            setUser({email:user?.email,name:user.displayName});
            setIsAuthenticated(true);
        })
        return ()=>unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout ,authModalOpen ,setAuthModalOpen}}>
            {children}
        </AuthContext.Provider>
    );
};