"use client";
import {useContext, useEffect,useState} from "react";
import {AuthContext} from "@/context/auth";
import {getDoc,collection,getDocs} from "firebase/firestore"
import {db} from "../../../lib/firebase.config";
import { motion, AnimatePresence } from 'framer-motion';

export default () => {
    const {user} = useContext(AuthContext);
    const [patientData, setPatientData] = useState(null);
    const [activeSection, setActiveSection] = useState('personal');
    const fetchUserData = async()=>{
        const userId = user.email.split("@")[0];
        const docRef = collection(db,"users",userId,"questions");

        const data = await getDocs(docRef);
        let questions = [];

        data.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() }); // Store doc ID + data
        });
        if (questions.length > 0)
        setPatientData(questions[0]);
        else {
            setPatientData({
                allergies: "",
                birthDate: "",
                comments: "rfrf",
                conditions: "",
                doctor: "",
                dosage: "",
                frequency: "",
                gender: "",
                id: "UiKmUpPVZOIqjysBp2jt",
                improvement: "",
                medicationName: "",
                medications: "",
                missedDoses: "",
                name: "ddd",
                pregnant: "",
                purpose: "",
                sideEffects: "",
                surgery: "",
                surveyDate: "",
                swallowing: "",
                withFood: ""
            });
        }

        console.log("Retrieved questions:", questions);
    }
    useEffect(() => {
        // API fetch
        fetchUserData();
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        },
        exit: { opacity: 0, x: 20 }
    };

    if (!patientData) {
        return (
            <motion.div
                className="flex items-center justify-center min-h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear"
                    }}
                    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                />
            </motion.div>
        );
    }

    // Filter out empty fields for each section
    const personalInfo = Object.entries(patientData).filter(([key]) =>
        ['name', 'birthDate', 'gender', 'pregnant'].includes(key)
    );

    const medicalInfo = Object.entries(patientData).filter(([key]) =>
        ['allergies', 'conditions', 'surgery', 'medications'].includes(key)
    );

    const medicationDetails = Object.entries(patientData).filter(([key]) =>
        ['medicationName', 'dosage', 'frequency', 'purpose', 'sideEffects', 'improvement', 'withFood', 'swallowing', 'missedDoses'].includes(key)
    );

    const otherInfo = Object.entries(patientData).filter(([key, value]) =>
        ![...personalInfo, ...medicalInfo, ...medicationDetails].some(([k]) => k === key) &&
        value !== "" &&
        !['id', 'surveyDate'].includes(key)
    );

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gray-50 py-8 px-4"
        >
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-blue-800">Patient Health Summary</h1>
                    <p className="text-gray-600 mt-2">{patientData.name}'s Medical Information</p>
                </motion.div>

                {/* Navigation */}
                <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-6">
                    {[
                        { id: 'personal', label: 'Personal Info' },
                        { id: 'medical', label: 'Medical History' },
                        { id: 'medication', label: 'Medication Details' },
                        { id: 'other', label: 'Additional Info' }
                    ].map((tab) => (
                        <motion.button
                            key={tab.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveSection(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium ${
                                activeSection === tab.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-blue-600 border border-blue-300'
                            }`}
                        >
                            {tab.label}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Content Sections */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="min-h-[300px]"
                        >
                            {activeSection === 'personal' && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-blue-800">Personal Information</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {personalInfo.map(([key, value], index) => (
                                            <motion.div
                                                key={key}
                                                variants={itemVariants}
                                                className="bg-blue-50 p-3 rounded-lg"
                                            >
                                                <h3 className="font-medium text-blue-700 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </h3>
                                                <p className="text-gray-800 mt-1">
                                                    {value || <span className="text-gray-400">Not specified</span>}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'medical' && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-blue-800">Medical History</h2>
                                    <div className="space-y-4">
                                        {medicalInfo.map(([key, value], index) => (
                                            <motion.div
                                                key={key}
                                                variants={itemVariants}
                                                className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500"
                                            >
                                                <h3 className="font-medium text-blue-700 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </h3>
                                                <p className="text-gray-800 mt-1">
                                                    {value || <span className="text-gray-400">No {key.toLowerCase()} reported</span>}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'medication' && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-blue-800">Medication Details</h2>
                                    {medicationDetails.some(([, value]) => value) ? (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {medicationDetails.map(([key, value], index) => (
                                                <motion.div
                                                    key={key}
                                                    variants={itemVariants}
                                                    whileHover={{ y: -3 }}
                                                    className="bg-blue-50 p-3 rounded-lg shadow-sm"
                                                >
                                                    <h3 className="font-medium text-blue-700 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </h3>
                                                    <p className="text-gray-800 mt-1">
                                                        {value || <span className="text-gray-400">Not specified</span>}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No medication details provided
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {activeSection === 'other' && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-blue-800">Additional Information</h2>
                                    {otherInfo.length > 0 ? (
                                        <div className="space-y-4">
                                            {otherInfo.map(([key, value], index) => (
                                                <motion.div
                                                    key={key}
                                                    variants={itemVariants}
                                                    className="bg-blue-50 p-4 rounded-lg"
                                                >
                                                    <h3 className="font-medium text-blue-700 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </h3>
                                                    <p className="text-gray-800 mt-1">{value}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No additional information provided
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer with survey date */}
                {patientData.surveyDate && (
                    <motion.div
                        variants={itemVariants}
                        className="text-center text-gray-500 mt-6"
                    >
                        Survey completed on: {patientData.surveyDate}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
