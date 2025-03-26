'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {useTranslations} from "next-intl";

export default function Questionnaire() {
    const router = useRouter();
    const t = useTranslations("questionaire")
    const [currentSection, setCurrentSection] = useState(0);
    const [formData, setFormData] = useState({
        // Patient Information
        name: '',
        birthDate: '',
        gender: '',
        surveyDate: '',
        doctor: '',

        // Health Information
        conditions: '',
        medications: '',
        allergies: '',
        pregnant: '',
        surgery: '',

        // Medication Details
        medicationName: '',
        purpose: '',
        frequency: '',
        dosage: '',
        withFood: '',
        swallowing: '',

        // Side Effects
        sideEffects: '',
        improvement: '',
        missedDoses: '',

        // Comments
        comments: ''
    });

    const sections = [
        {
            title: t("title1"),
            questions: [
                { id: 'name', label: t("questions.q1_label"), type: 'text' },
                { id: 'birthDate', label: t("questions.q2_label"), type: 'date' },
                {
                    id: 'gender',
                    label: t("questions.q3_label"),
                    type: 'radio',
                    options: [t("man"), t("female"),  t("diverse")]
                },
                { id: 'surveyDate', label: t("questions.q4_label"), type: 'date' },
                { id: 'doctor', label: t("questions.q5_label"), type: 'text' }
            ]
        },
        {
            title: t("title2"),
            questions: [
                {
                    id: 'conditions',
                    label: t("questions.q6_label"),
                    type: 'conditional',
                    options: [t("yes"), t("no")]
                },
                {
                    id: 'medications',
                    label: t("questions.q7_label"),
                    type: 'conditional',
                    options: [t("yes"), t("no")]
                },
                {
                    id: 'allergies',
                    label: t("questions.q8_label"),
                    type: 'conditional',
                    options: [t("yes"), t("no")]
                },
                {
                    id: 'pregnant',
                    label: t("questions.q9_label"),
                    type: 'radio',
                    options: [t("yes"), t("no")]
                },
                {
                    id: 'surgery',
                    label: t("questions.q10_label"),
                    type: 'radio',
                    options: [t("yes"), t("no")]
                }
            ]
        },
        {
            title: t("title3"),
            questions: [
                { id: 'medicationName', label: t("questions.q11_label"), type: 'text' },
                { id: 'purpose', label: t("questions.q12_label"), type: 'textarea' },
                {
                    id: 'frequency',
                    label: t("questions.q13_label"),
                    type: 'radio',
                    options: [t("1_time"), t("2_time"), t("3_time"), t("as_needed")]
                },
                { id: 'dosage', label: "Dosage", type: 'text' },
                {
                    id: 'withFood',
                    label: t("questions.q15_label"),
                    type: 'radio',
                    options: [t("eating.before"), t("eating.during"), t("eating.after")]
                },
                {
                    id: 'swallowing',
                    label: t("questions.q16_label"),
                    type: 'radio',
                    options: [t("yes"), t("no")]
                }
            ]
        },
        {
            title: t("title4"),
            questions: [
                {
                    id: 'sideEffects',
                    label: t("questions.q17_label"),
                    type: 'conditional',
                    options: [t("yes"), t("no")]
                },
                {
                    id: 'improvement',
                    label: t("questions.q18_label"),
                    type: 'radio',
                    options: [t("yes"), t("no"), t("unchanged")]
                },
                {
                    id: 'missedDoses',
                    label: t("questions.q19_label"),
                    type: 'conditional',
                    options: [t("yes"), t("no")]
                }
            ]
        },
        {
            title: t("title5"),
            questions: [
                {
                    id: 'comments',
                    label: t("questions.q20_label"),
                    type: 'textarea'
                }
            ]
        }
    ];

    const handleChange = (e, id) => {
        setFormData({
            ...formData,
            [id]: e.target.value
        });
    };

    const handleRadioChange = (value, id) => {
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit logic here
        router.push('/results');
    };

    const nextSection = () => {
        setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
    };

    const prevSection = () => {
        setCurrentSection(prev => Math.max(prev - 1, 0));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
            >
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Patient Questionnaire
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Please answer all questions to help us provide the best recommendation
                </p>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-200">
                        <motion.div
                            className="h-full bg-blue-600"
                            initial={{ width: '0%' }}
                            animate={{
                                width: `${((currentSection + 1) / sections.length) * 100}%`,
                                transition: { duration: 0.5 }
                            }}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSection}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="p-6 sm:p-8"
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                                    {sections[currentSection].title}
                                </h2>

                                <div className="space-y-6">
                                    {sections[currentSection].questions.map((question, index) => (
                                        <motion.div
                                            key={question.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="space-y-2"
                                        >
                                            <label className="block text-gray-700 font-medium">
                                                {question.label}
                                            </label>

                                            {question.type === 'text' && (
                                                <input
                                                    type="text"
                                                    value={formData[question.id]}
                                                    onChange={(e) => handleChange(e, question.id)}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            )}

                                            {question.type === 'date' && (
                                                <input
                                                    type="date"
                                                    value={formData[question.id]}
                                                    onChange={(e) => handleChange(e, question.id)}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            )}

                                            {question.type === 'textarea' && (
                                                <textarea
                                                    value={formData[question.id]}
                                                    onChange={(e) => handleChange(e, question.id)}
                                                    rows={3}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            )}

                                            {(question.type === 'radio' || question.type === 'conditional') && (
                                                <div className="flex flex-wrap gap-3 mt-2">
                                                    {question.options.map((option) => (
                                                        <motion.div
                                                            key={option}
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="flex items-center"
                                                        >
                                                            <input
                                                                type="radio"
                                                                id={`${question.id}-${option}`}
                                                                name={question.id}
                                                                checked={formData[question.id] === option}
                                                                onChange={() => handleRadioChange(option, question.id)}
                                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <label
                                                                htmlFor={`${question.id}-${option}`}
                                                                className="ml-2 text-gray-700"
                                                            >
                                                                {option}
                                                            </label>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}

                                            {question.type === 'conditional' && formData[question.id] === 'Yes' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    transition={{ duration: 0.3 }}
                                                    className="mt-2"
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="Please specify..."
                                                        value={formData[`${question.id}Details`]}
                                                        onChange={(e) => handleChange(e, `${question.id}Details`)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between px-6 pb-6 sm:px-8 sm:pb-8">
                            <motion.button
                                type="button"
                                onClick={prevSection}
                                disabled={currentSection === 0}
                                className={`px-6 py-2 rounded-lg ${currentSection === 0 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
                                whileHover={currentSection === 0 ? {} : { scale: 1.05 }}
                                whileTap={currentSection === 0 ? {} : { scale: 0.95 }}
                            >
                                Back
                            </motion.button>

                            {currentSection < sections.length - 1 ? (
                                <motion.button
                                    type="button"
                                    onClick={nextSection}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Continue
                                </motion.button>
                            ) : (
                                <motion.button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Submit Questionnaire
                                </motion.button>
                            )}
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}