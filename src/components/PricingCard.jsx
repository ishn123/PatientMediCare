'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiCheck, FiStar, FiZap } from 'react-icons/fi';

const pricingPlans = {
    monthly: [
        {
            id: 1,
            name: 'Starter',
            price: 9,
            period: 'month',
            features: [
                'Basic pill recommendations',
                'Health questionnaire',
                'Email support',
                '1-month history'
            ],
            highlight: false,
            color: 'from-blue-100 to-blue-50',
            border: 'border-blue-200'
        },
        {
            id: 2,
            name: 'Premium',
            price: 19,
            period: 'month',
            features: [
                'Advanced recommendations',
                'Priority support',
                '3-month history',
                '2 doctor consults/month',
                'Family sharing (2 people)'
            ],
            highlight: true,
            color: 'from-purple-100 to-purple-50',
            border: 'border-purple-300'
        },
        {
            id: 3,
            name: 'Professional',
            price: 29,
            period: 'month',
            features: [
                'AI-powered recommendations',
                '24/7 support',
                'Unlimited history',
                'Unlimited consults',
                'Family sharing (5 people)',
                'Health analytics'
            ],
            highlight: false,
            color: 'from-teal-100 to-teal-50',
            border: 'border-teal-200'
        }
    ],
    yearly: [
        {
            id: 1,
            name: 'Starter',
            price: 90,
            period: 'year',
            features: [
                'Basic pill recommendations',
                'Health questionnaire',
                'Email support',
                '1-year history',
                '2 months free'
            ],
            highlight: false,
            color: 'from-blue-100 to-blue-50',
            border: 'border-blue-200'
        },
        {
            id: 2,
            name: 'Premium',
            price: 190,
            period: 'year',
            features: [
                'Advanced recommendations',
                'Priority support',
                '3-year history',
                '3 doctor consults/month',
                'Family sharing (3 people)',
                '3 months free'
            ],
            highlight: true,
            color: 'from-purple-100 to-purple-50',
            border: 'border-purple-300'
        },
        {
            id: 3,
            name: 'Professional',
            price: 290,
            period: 'year',
            features: [
                'AI-powered recommendations',
                '24/7 support',
                'Lifetime history',
                'Unlimited consults',
                'Family sharing (6 people)',
                'Health analytics',
                '6 months free'
            ],
            highlight: false,
            color: 'from-teal-100 to-teal-50',
            border: 'border-teal-200'
        }
    ]
};

export default function PricingCards() {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [hoveredPlan, setHoveredPlan] = useState(null);



    const toggleBilling = () => {
        setBillingCycle(prev => (prev === 'monthly' ? 'yearly' : 'monthly'));
    };

    return (
        <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:text-black">
            <div className="container mx-auto px-6">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 dark:text-black">Flexible Plans</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-6 dark:text-black">
                        Choose the perfect plan for your health journey
                    </p>

                    <motion.div
                        className="flex items-center justify-center mb-8 dark:text-black"
                        whileHover={{ scale: 1.05 }}
                    >
            <span className={`mr-3 font-medium ${billingCycle === 'monthly' ? 'text-gray-800' : 'text-gray-400'}`}>
              Monthly
            </span>
                        <button
                            onClick={toggleBilling}
                            className="relative w-14 h-8 bg-gray-200 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-black"
                        >
                            <motion.div
                                className={`absolute top-1 w-6 h-6 rounded-full shadow-md transition-colors ${billingCycle === 'yearly' ? 'bg-purple-600 right-1' : 'bg-white left-1'} dark:text-black`}
                                layout
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={`ml-3 font-medium ${billingCycle === 'yearly' ? 'text-purple-600' : 'text-gray-400'} dark:text-black`}>
              Yearly <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full ml-1 dark:text-black">Save 20%</span>
            </span>
                    </motion.div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pricingPlans[billingCycle].map((plan, index) => (
                        <motion.div
                            key={`${billingCycle}-${plan.id}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="relative h-full"
                            onHoverStart={() => setHoveredPlan(plan.id)}
                            onHoverEnd={() => setHoveredPlan(null)}
                        >
                            {plan.highlight && (
                                <motion.div
                                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center shadow-lg z-10 dark:text-black"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <FiStar className="mr-1 dark:text-black" /> RECOMMENDED
                                </motion.div>
                            )}

                            <motion.div
                                className={`h-full flex flex-col border rounded-xl overflow-hidden ${plan.border} ${plan.highlight ? 'shadow-xl' : 'shadow-md'}`}
                                whileHover={{ y: -10 }}
                                animate={{
                                    borderWidth: hoveredPlan === plan.id ? 2 : 1,
                                    borderColor: hoveredPlan === plan.id ? (plan.highlight ? '#a78bfa' : '#93c5fd') : plan.border.split('-')[2]
                                }}
                            >
                                <div className={`bg-gradient-to-br ${plan.color} p-6 dark:text-black`}>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-black">{plan.name}</h3>
                                    <div className="mt-4 flex items-end dark:text-black">
                                        <span className="text-4xl font-bold text-gray-800 dark:text-black">€{plan.price}</span>
                                        <span className="text-gray-600 ml-2 mb-1 dark:text-black">/{plan.period}</span>
                                    </div>
                                </div>

                                <div className="flex-grow bg-white p-6 flex flex-col">
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <motion.li
                                                key={i}
                                                className="flex items-start dark:text-black"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + (i * 0.1) }}
                                            >
                                                <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </motion.li>
                                        ))}
                                    </ul>

                                    <div className="mt-auto">
                                        <motion.button
                                            whileHover={{
                                                scale: 1.05,
                                                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className={`w-full py-3 px-6 rounded-lg font-medium transition flex items-center justify-center ${
                                                plan.highlight
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                    : selectedPlan === plan.id
                                                        ? 'bg-gray-800 text-white'
                                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                        >
                                            {selectedPlan === plan.id ? (
                                                <>
                                                    <FiCheck className="mr-2" /> Selected
                                                </>
                                            ) : (
                                                <>
                                                    <FiZap className="mr-2" /> Get Started
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {selectedPlan && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{backgroundColor: 'transparent'}}
                        >
                            <motion.div
                                className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl"
                                initial={{ scale: 0.9, y: 50 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 50 }}

                            >
                                <h3 className="text-xl font-bold mb-4">Plan Selected!</h3>
                                <p className="mb-6">You've chosen the {pricingPlans[billingCycle].find(p => p.id === selectedPlan).name} plan.</p>
                                <button
                                    onClick={() => setSelectedPlan(null)}
                                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                                >
                                    Continue
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}