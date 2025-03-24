'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '../context/auth';
import AuthModal from './AuthModal';
import Link from 'next/link';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const {authModalOpen, setAuthModalOpen} = useContext(AuthContext);
    const { user, isAuthenticated, logout } = useContext(AuthContext);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">MediMatch</Link>

                <nav className="hidden md:flex space-x-8 items-center">
                    <Link href="#how-it-works" className="text-gray-700 hover:text-blue-600">How It Works</Link>
                    <Link href="#about" className="text-gray-700 hover:text-blue-600">About Us</Link>
                    <Link href="#testimonials" className="text-gray-700 hover:text-blue-600">Testimonials</Link>

                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Hi, {user.name}</span>
                            <button onClick={logout} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 transition">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setAuthModalOpen(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                        >
                            Login / Register
                        </button>
                    )}
                </nav>

                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    ☰
                </button>
            </div>

            {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
        </header>
    );
}