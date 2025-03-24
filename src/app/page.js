"use client";
import { motion } from 'framer-motion';
import Header from '../components/Header';
import MainCTA from '../components/MainCTA';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { testimonials } from '../data/testimonials';
import {useState} from "react";

export default function Home() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    return (
        <>
            <Header />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-12 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                                Personalized Pill Recommendations <span className="text-blue-600">Tailored For You</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Our advanced questionnaire matches you with the optimal medication based on your unique health profile.
                            </p>
                            <MainCTA/>
                        </div>
                        <div className="md:w-1/2">
                            <motion.img
                                src="https://soracom.io/wp-content/uploads/2022/09/AdobeStock_281427970.jpeg"
                                alt="Medical professional"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="w-full max-w-md mx-auto"
                            />
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <motion.h2
                            className="text-3xl font-bold text-center text-gray-800 mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Simple, Science-Backed Process
                        </motion.h2>

                        <div className="grid md:grid-cols-3 gap-10">
                            {[
                                {
                                    number: "1",
                                    title: "Create Your Profile",
                                    description: "Register securely and provide basic health information to get started.",
                                    icon: "👤"
                                },
                                {
                                    number: "2",
                                    title: "Complete Our Questionnaire",
                                    description: "Answer our detailed health assessment developed by medical experts.",
                                    icon: "📝"
                                },
                                {
                                    number: "3",
                                    title: "Get Your Recommendation",
                                    description: "Receive your personalized pill recommendation within minutes.",
                                    icon: "💊"
                                }
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center p-6 bg-gray-50 rounded-xl"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="text-4xl mb-4">{step.icon}</div>
                                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section id="about" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
                        <motion.div
                            className="md:w-1/2 mb-12 md:mb-0"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="bg-blue-100 rounded-xl h-80 w-full flex items-center justify-center">
                                <motion.img
                                    src="/images/team-illustration.svg"
                                    alt="Our team"
                                    className="h-full object-contain"
                                    animate={{
                                        y: [0, -10, 0],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 5,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            className="md:w-1/2 md:pl-12"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">About Our Company</h2>
                            <p className="text-gray-600 mb-6">
                                We're a team of medical professionals and data scientists committed to improving medication adherence and outcomes through personalized recommendations.
                            </p>
                            <p className="text-gray-600 mb-6">
                                Our proprietary algorithm analyzes hundreds of data points to match patients with the medication most likely to be effective for their specific condition and physiology.
                            </p>
                            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                                <div className="bg-blue-100 rounded-full p-3">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Clinically Validated</span> - Our recommendations are based on peer-reviewed research.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <TestimonialCarousel testimonials={testimonials} />

                {/* CTA Section */}
                <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        {[...Array(15)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute bg-white rounded-full"
                                style={{
                                    width: `${Math.random() * 20 + 10}px`,
                                    height: `${Math.random() * 20 + 10}px`,
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, (Math.random() - 0.5) * 100],
                                    x: [0, (Math.random() - 0.5) * 50],
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: Math.random() * 20 + 10,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "linear"
                                }}
                            />
                        ))}
                    </div>

                    <motion.div
                        className="container mx-auto px-6 text-center relative z-10"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Match?</h2>
                        <p className="text-xl mb-10 max-w-2xl mx-auto">
                            Take our 5-minute questionnaire and receive your personalized recommendation today.
                        </p>
                    </motion.div>


                </section>

            </main>
        </>
    );
}