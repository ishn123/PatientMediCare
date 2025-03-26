'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Questionnaire() {
    const router = useRouter();
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
            title: "Patient Information",
            questions: [
                { id: 'name', label: "Name", type: 'text' },
                { id: 'birthDate', label: "Date of Birth", type: 'date' },
                {
                    id: 'gender',
                    label: "Gender",
                    type: 'radio',
                    options: ['Male', 'Female', 'Diverse']
                },
                { id: 'surveyDate', label: "Survey Date", type: 'date' },
                { id: 'doctor', label: "Treating Physician", type: 'text' }
            ]
        },
        {
            title: "Health Information",
            questions: [
                {
                    id: 'conditions',
                    label: "Do you currently have any known pre-existing conditions?",
                    type: 'conditional',
                    options: ['Yes', 'No']
                },
                {
                    id: 'medications',
                    label: "Are you currently taking other medications?",
                    type: 'conditional',
                    options: ['Yes', 'No']
                },
                {
                    id: 'allergies',
                    label: "Do you have any allergies or intolerances?",
                    type: 'conditional',
                    options: ['Yes', 'No']
                },
                {
                    id: 'pregnant',
                    label: "Are you currently pregnant?",
                    type: 'radio',
                    options: ['Yes', 'No']
                },
                {
                    id: 'surgery',
                    label: "Do you have upcoming surgery or recently had surgery?",
                    type: 'radio',
                    options: ['Yes', 'No']
                }
            ]
        },
        {
            title: "Medication Details",
            questions: [
                { id: 'medicationName', label: "What is the name of your prescribed medication?", type: 'text' },
                { id: 'purpose', label: "Why was this medication prescribed to you?", type: 'textarea' },
                {
                    id: 'frequency',
                    label: "How often do you take this medication?",
                    type: 'radio',
                    options: ['1x daily', '2x daily', '3x daily', 'As needed']
                },
                { id: 'dosage', label: "Dosage", type: 'text' },
                {
                    id: 'withFood',
                    label: "Do you take medication before, during or after meals?",
                    type: 'radio',
                    options: ['Before eating', 'During eating', 'After eating']
                },
                {
                    id: 'swallowing',
                    label: "Do you have difficulty swallowing the tablets?",
                    type: 'radio',
                    options: ['Yes', 'No']
                }
            ]
        },
        {
            title: "Side Effects",
            questions: [
                {
                    id: 'sideEffects',
                    label: "Have you noticed any side effects since taking this medication?",
                    type: 'conditional',
                    options: ['Yes', 'No']
                },
                {
                    id: 'improvement',
                    label: "Has your general condition improved since taking this medication?",
                    type: 'radio',
                    options: ['Yes', 'No', 'Unchanged']
                },
                {
                    id: 'missedDoses',
                    label: "Have you ever forgotten to take your medication?",
                    type: 'conditional',
                    options: ['Yes', 'No']
                }
            ]
        },
        {
            title: "Additional Comments",
            questions: [
                {
                    id: 'comments',
                    label: "Do you have any other questions or concerns about taking this medication?",
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