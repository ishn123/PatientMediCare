'use client';

import {useState, useContext, useEffect} from 'react';
import { AuthContext } from '../context/auth';
import AuthModal from './AuthModal';
import Link from 'next/link';
import ThemeToggle from "@/components/ThemeToggle";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import {useTranslations} from "next-intl";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const {authModalOpen, setAuthModalOpen} = useContext(AuthContext);
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const t = useTranslations("HeaderBar");
    console.log(user)
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 dark:bg-gray-800">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">{t("title")}</Link>

                <nav className="hidden md:flex space-x-8 items-center">
                    <Link href="#how-it-works" className="text-gray-700 hover:text-blue-600">{t("o1")}</Link>
                    <Link href="#about" className="text-gray-700 hover:text-blue-600">{t("o2")}</Link>
                    <Link href="#testimonials" className="text-gray-700 hover:text-blue-600">{t("o3")}</Link>

                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">{t("hello")}, {user?.name}</span>
                            <button onClick={logout}
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 transition">
                                {t("logout")}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setAuthModalOpen(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition dark:bg-white dark:text-black"
                        >
                            {t("o4")}
                        </button>
                    )}
                    <ThemeToggle/>
                    <LocaleSwitcher/>
                </nav>

                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    ☰
                </button>
            </div>

            {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)}/>}
        </header>
    );
}