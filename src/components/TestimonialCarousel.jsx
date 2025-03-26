'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {useTranslations} from "next-intl";

export default function TestimonialCarousel({ testimonials }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const t = useTranslations("TestimonialCarousel");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <section id="testimonials" className="py-20 bg-white dark:text-black">
            <div className="container mx-auto px-6 dark:text-black">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-16 dark:text-black">
                    {t("title")}
                </h2>

                <div className="relative h-96 overflow-hidden dark:text-black">
                    <AnimatePresence>
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-gray-50 p-8 rounded-lg shadow-lg flex flex-col justify-center dark:text-black"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden dark:text-black">
                                    <img
                                        src={testimonials[currentIndex].avatar}
                                        alt={testimonials[currentIndex].name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold dark:text-black">
                                        {testimonials[currentIndex].name}
                                    </h3>
                                    <p className="text-gray-500 dark:text-black">
                                        {testimonials[currentIndex].title}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic text-lg dark:text-black">
                                "{testimonials[currentIndex].quote}"
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}