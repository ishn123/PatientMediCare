"use client";
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import MainCTA from '../../components/MainCTA';
import TestimonialCarousel from '../../components/TestimonialCarousel';
import { testimonials } from '../../data/testimonials';
import {useEffect, useState} from "react";
import PricingCards from "@/components/PricingCard";
import {useTranslations} from "next-intl";

export default function Home() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const t = useTranslations("HomePage");
    const [particles, setParticles] = useState([]);

    useEffect(() => {
            const newParticles = [...Array(15)].map(() => ({
                width: Math.random() * 20 + 10,
                height: Math.random() * 20 + 10,
                left: Math.random() * 100,
                top: Math.random() * 100,
                y: (Math.random() - 0.5) * 100,
                x: (Math.random() - 0.5) * 50,
                rotate: 360,
                duration: Math.random() * 20 + 10,
            }));
            setParticles(newParticles);
            }, []);

    return (
        <>
            <Header />
            <main className="dark:bg-gray-800">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 dark:bg-gray-800">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-12 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                                {t("HeroBanner.h1")} <span className="text-blue-600">{t("HeroBanner.span")}</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                {t('bannerText')}
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
                <section id="how-it-works" className="py-20 bg-white dark:bg-gray-800 dark:text-white"  >
                    <div className="container mx-auto px-6">
                        <motion.h2
                            className="text-3xl font-bold text-center text-gray-800 mb-16 dark:text-white"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            {t("WorksSection.motion_h2")}
                        </motion.h2>

                        <div className="grid md:grid-cols-3 gap-10 dark:text-gray-800">
                            {[
                                {
                                    number: "1",
                                    title: t("WorksSection.motion_div.o1.title"),
                                    description: t("WorksSection.motion_div.o1.description"),
                                    icon: "👤"
                                },
                                {
                                    number: "2",
                                    title: t("WorksSection.motion_div.o2.title"),
                                    description: t("WorksSection.motion_div.o2.description"),
                                    icon: "📝"
                                },
                                {
                                    number: "3",
                                    title: t("WorksSection.motion_div.o3.title"),
                                    description: t("WorksSection.motion_div.o3.description"),
                                    icon: "💊"
                                }
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center p-6 bg-gray-50 rounded-xl dark:text-black"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="text-4xl mb-4 dark:text-black">{step.icon}</div>
                                    <h3 className="text-xl font-semibold mb-3 dark:text-black">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center dark:text-gray-600">
                        <motion.div
                            className="md:w-1/2 mb-12 md:mb-0 dark:text-gray-800"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="bg-blue-100 rounded-xl h-80 w-full flex items-center justify-center dark:text-gray-800">
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
                            className="md:w-1/2 md:pl-12 dark:text-gray-800"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">{t("AboutSection.h2")}</h2>
                            <p className="text-gray-600 mb-6 dark:text-white">
                                {t("AboutSection.p1")}
                            </p>
                            <p className="text-gray-600 mb-6 dark:text-white">
                                {t("AboutSection.p2")}
                            </p>
                            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                                <div className="bg-blue-100 rounded-full p-3">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600">
                                    <span className="font-semibold">{t("AboutSection.p4")}</span> - {t("AboutSection.p3")}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Pricing section */}
                <PricingCards/>

                {/* Testimonials Section */}
                <TestimonialCarousel testimonials={testimonials} />

                {/* CTA Section */}
                <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        {particles.map((particle, i) => (
                            <motion.div
                                key={i}
                                className="absolute bg-white rounded-full"
                                style={{
                                    width: `${particle.width}px`,
                                    height: `${particle.height}px`,
                                    left: `${particle.left}%`,
                                    top: `${particle.top}%`,
                                }}
                                animate={{
                                    y: [0, particle.y],
                                    x: [0, particle.x],
                                    rotate: [0, particle.rotate],
                                }}
                                transition={{
                                    duration: particle.duration,
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
                        <h2 className="text-3xl font-bold mb-6">{t("CTASection.h2")}</h2>
                        <p className="text-xl mb-10 max-w-2xl mx-auto">
                            {t("CTASection.p")}
                        </p>
                    </motion.div>


                </section>

            </main>
        </>
    );
}