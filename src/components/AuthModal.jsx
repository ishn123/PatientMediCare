'use client';

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import {useTranslations} from "next-intl";
import {signInWithEmailAndPassword,createUserWithEmailAndPassword,updateProfile} from "firebase/auth";
import {auth} from '../lib/firebase.config';

export default function AuthModal({ onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const t = useTranslations("AuthModal");
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const { login, register,setUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {

                const response = await signInWithEmailAndPassword(auth,email, password);
                const displayName = response.user.displayName ? response.user.displayName : response.user.email;
            } else {
                console.log("Registering user")
                const response = await createUserWithEmailAndPassword(auth, email, password);
                console.log("Registering user completed")
                await updateProfile(response.user,{
                    displayName:name
                })
            }
            onClose();
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    // Desktop Popup Animation Variants
    const desktopVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.2 }
        }
    };

    // Mobile Full-screen Variants
    const mobileVariants = {
        hidden: {
            opacity: 0,
            y: '100%'
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30
            }
        },
        exit: {
            opacity: 0,
            y: '100%',
            transition: { duration: 0.3 }
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 dark:text-black">
                {/* Blur Overlay */}
                <motion.div
                    initial={{backdropFilter: 'blur(0px)'}}
                    animate={{backdropFilter: 'blur(4px)'}}
                    exit={{backdropFilter: 'blur(0px)'}}
                    transition={{duration: 0.3}}
                    onClick={onClose}
                    style={{backgroundColor:"transparent"}}
                    className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm dark:text-black"
                />

                {/* Modal Content */}
                <motion.div
                    variants={isMobile ? mobileVariants : desktopVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`
            relative z-10 w-full max-w-md
            ${isMobile ?
                        'fixed bottom-0 left-0 right-0 rounded-t-3xl' :
                        'rounded-xl'}
          dark:text-black`}

                    >
                    <div className={`
            bg-white p-6
            ${isMobile ? 'rounded-t-3xl' : 'rounded-xl shadow-xl'}
          `}>
                        <div className="flex justify-between items-center mb-6 dark:text-black">
                            <h2 className="text-2xl font-bold dark:text-black">
                                {isLogin ? ` ${t("sign_in")}🙏🏼` : `${t("create_account")}`}
                            </h2>
                            {!isMobile && (
                                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-black">
                                    ✕
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:text-black">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2 dark:text-black" htmlFor="name">
                                        {t("full_name")}
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-black"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="email">
                                    {t("email")}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2" htmlFor="password">
                                    {t("password")}
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength="6"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 dark:text-black"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                              strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                                        {t("processing")}
                  </span>
                                ) : isLogin ? t("sign_in") : t("create_account")}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                {isLogin
                                    ? t("register")
                                    : t("already_account")}
                            </button>
                        </div>
                    </div>

                    {isMobile && (
                        <div className="bg-gray-100 p-4 text-center">
                            <button
                                onClick={onClose}
                                className="text-gray-600 font-medium"
                            >
                                {t("close")}
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}