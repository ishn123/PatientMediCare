"use client";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/auth";

export default () => {
    const { user } = useContext(AuthContext);
    const [patientData, setPatientData] = useState(null);
    const [activeSection, setActiveSection] = useState('personal');

    const fetchUserData = async () => {
        let questions = JSON.parse(localStorage.getItem("DATA"));

        if (questions && questions.length > 0) {
            setPatientData(questions);
        } else {
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
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (!patientData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Filter sections based on patient data
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
        ![...personalInfo, ...medicalInfo, ...medicationDetails].some(([k]) => k === key) && value !== "" && !['id', 'surveyDate'].includes(key)
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-blue-800">Patient Health Summary</h1>
                    <p className="text-gray-600 mt-2">{patientData.name}'s Medical Information</p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {[
                        { id: 'personal', label: 'Personal Info' },
                        { id: 'medical', label: 'Medical History' },
                        { id: 'medication', label: 'Medication Details' },
                        { id: 'other', label: 'Additional Info' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium ${
                                activeSection === tab.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-blue-600 border border-blue-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Sections */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    {activeSection === 'personal' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-blue-800">Personal Information</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {personalInfo.map(([key, value], index) => (
                                    <div key={key} className="bg-blue-50 p-3 rounded-lg">
                                        <h3 className="font-medium text-blue-700 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </h3>
                                        <p className="text-gray-800 mt-1">{value || <span className="text-gray-400">Not specified</span>}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === 'medical' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-blue-800">Medical History</h2>
                            <div className="space-y-4">
                                {medicalInfo.map(([key, value], index) => (
                                    <div key={key} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                        <h3 className="font-medium text-blue-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                                        <p className="text-gray-800 mt-1">{value || <span className="text-gray-400">No {key.toLowerCase()} reported</span>}</p>
                                    </div>
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
                                        <div key={key} className="bg-blue-50 p-3 rounded-lg shadow-sm">
                                            <h3 className="font-medium text-blue-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                                            <p className="text-gray-800 mt-1">{value || <span className="text-gray-400">Not specified</span>}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No medication details provided
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === 'other' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-blue-800">Additional Information</h2>
                            {otherInfo.length > 0 ? (
                                <div className="space-y-4">
                                    {otherInfo.map(([key, value], index) => (
                                        <div key={key} className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-blue-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                                            <p className="text-gray-800 mt-1">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No additional information provided
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer with survey date */}
                {patientData.surveyDate && (
                    <div className="text-center text-gray-500 mt-6">
                        Survey completed on: {patientData.surveyDate}
                    </div>
                )}
            </div>
        </div>
    );
};
