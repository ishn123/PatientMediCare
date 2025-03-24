'use client';

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

export default function AuthModal({ onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isMobile = useMediaQuery({ maxWidth: 768 });
    const { login, register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, name);
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Blur Overlay */}
                <motion.div
                    initial={{backdropFilter: 'blur(0px)'}}
                    animate={{backdropFilter: 'blur(4px)'}}
                    exit={{backdropFilter: 'blur(0px)'}}
                    transition={{duration: 0.3}}
                    onClick={onClose}
                    style={{backgroundColor:"transparent"}}
                    className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm"
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
          `}

                    >
                    <div className={`
            bg-white p-6
            ${isMobile ? 'rounded-t-3xl' : 'rounded-xl shadow-xl'}
          `}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </h2>
                            {!isMobile && (
                                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                    ✕
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="name">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="email">
                                    Email
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
                                    Password
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
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                              strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                                ) : isLogin ? 'Sign In' : 'Register'}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                {isLogin
                                    ? "Need an account? Register here"
                                    : "Already have an account? Sign in"}
                            </button>
                        </div>
                    </div>

                    {isMobile && (
                        <div className="bg-gray-100 p-4 text-center">
                            <button
                                onClick={onClose}
                                className="text-gray-600 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}