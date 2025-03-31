"use client";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "@/context/auth";
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from "next/navigation";

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const { id: documentId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const checkAdmin = async () => {
        console.log("CHECKING============");
        setLoading(true);
        if (!user) return false;
        const token = await user.idToken;
        const res = await fetch("/api/verify", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
    }

    useEffect(() => {
        if (!user) {
            console.log("No user");
            return;
        }

        const fetchSubmissions = async () => {
            setLoading(true);
            const data = await fetch(`/api/admin/getSubmissions/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    documentId: documentId
                })
            }).then(res => res.json());
            console.log(data)
            if (data) {
                setSubmissions(data);
                setLoading(false);
            }
        };

        if (!user) return;
        checkAdmin().then(() => {
            fetchSubmissions();
            setIsAdmin(true);
        }).catch(e => {
            console.log(e);
        });
    }, [user]);

    const filteredSubmissions = filter === 'all'
        ? submissions
        : submissions.filter(sub => sub.status === filter);

    const handleViewDetail = (submission) => {
        setSelectedSubmission(submission);
        setShowDetails(true);
    };

    const closeDetails = () => {
        setShowDetails(false);
        setTimeout(() => setSelectedSubmission(null), 300);
    };

    const handleStatusUpdate = async (submissionId, newStatus) => {
        try {

            setLoading(true);
            const response = await fetch('/api/admin/approveSubmission/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    submissionId,
                    userEmail: user.email,
                    status: newStatus
                }),
            });

            if (response.ok) {
                setSubmissions(submissions.map(sub =>
                    sub.id === submissionId ? { ...sub, status: newStatus } : sub
                ));
                if (selectedSubmission?.id === submissionId) {
                    setSelectedSubmission({...selectedSubmission, status: newStatus});
                }

            }
        } catch (error) {
            console.error('Error updating status:', error);
        }finally {
            setLoading(false);
        }
    };

    return (
        <>
            {isAdmin ? (
                <div className="min-h-screen bg-gray-50 p-6 relative">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

                        {/* Filter Tabs */}
                        <div className="flex gap-4 mb-6 flex-wrap">
                            {['pending', 'approved', 'rejected', 'all'].map((f) => (
                                <motion.button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg capitalize ${
                                        filter === f
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white border border-gray-300'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {f}
                                </motion.button>
                            ))}
                        </div>

                        {/* Submission Cards */}
                        {loading ? (
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"/>
                            </div>
                        ) : filteredSubmissions.length === 0 ? (
                            <p className="text-gray-500">No {filter} submissions found</p>
                        ) : (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1 }
                                    }
                                }}
                                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {filteredSubmissions.map((submission) => (
                                    <motion.div
                                        key={submission.id}
                                        variants={{
                                            hidden: { y: 20, opacity: 0 },
                                            visible: { y: 0, opacity: 1 }
                                        }}
                                        className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="p-6">
                                            <h2 className="text-xl font-semibold mb-2">
                                                {submission.name || 'Anonymous'}
                                            </h2>
                                            <p className="text-gray-600 text-sm mb-4">
                                                Submitted: {new Date(submission.submittedAt?.seconds * 1000).toLocaleString()}
                                            </p>

                                            <div className="space-y-2 mb-4">
                                                <p className="font-medium">
                                                    Status:
                                                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                                        submission.status === 'approved'
                                                            ? 'bg-green-100 text-green-800'
                                                            : submission.status === 'rejected'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {submission.status}
                                                    </span>
                                                </p>
                                                {submission.comments && (
                                                    <p className="text-gray-700 line-clamp-2">
                                                        <span className="font-medium">Comments:</span> {submission.comments}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex justify-between pt-4 border-t">
                                                <button
                                                    onClick={() => handleViewDetail(submission)}
                                                    className="text-blue-600 hover:underline font-medium"
                                                >
                                                    View Details
                                                </button>
                                                {submission.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <motion.button
                                                            onClick={() => handleStatusUpdate(submission.id, 'rejected')}
                                                            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Reject
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => handleStatusUpdate(submission.id, 'approved')}
                                                            className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Approve
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Centered Details Modal */}
                    <AnimatePresence>
                        {showDetails && selectedSubmission && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                                    onClick={closeDetails}
                                />

                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    className="fixed inset-0 flex items-center justify-center z-50 p-4"
                                >
                                    <div className="bg-gray-900 text-white-100 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-6">
                                                <h2 className="text-2xl font-bold">
                                                    Submission Details
                                                </h2>
                                                <button
                                                    onClick={closeDetails}
                                                    className="text-white-400 hover:text-white"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="space-y-6">
                                                {/* Patient Information */}
                                                <div className="bg-gray-800 p-4 rounded-lg">
                                                    <h3 className="font-semibold text-lg mb-4 text-blue-400 border-b border-gray-700 pb-2">Patient Information</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <DetailItem label="Name" value={selectedSubmission.name} />
                                                        <DetailItem label="Date of Birth" value={selectedSubmission.birthDate} />
                                                        <DetailItem label="Gender" value={selectedSubmission.gender} />
                                                        <DetailItem label="Survey Date" value={selectedSubmission.surveyDate} />
                                                        <DetailItem label="Doctor" value={selectedSubmission.doctor} />
                                                    </div>
                                                </div>

                                                {/* Health Information */}
                                                <div className="bg-gray-800 p-4 rounded-lg">
                                                    <h3 className="font-semibold text-lg mb-4 text-blue-400 border-b border-gray-700 pb-2">Health Information</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <DetailItem label="Medical Conditions" value={selectedSubmission.conditions} />
                                                        <DetailItem label="Current Medications" value={selectedSubmission.medications} />
                                                        <DetailItem label="Allergies" value={selectedSubmission.allergies} />
                                                        <DetailItem label="Pregnant" value={selectedSubmission.pregnant} />
                                                        <DetailItem label="Recent Surgery" value={selectedSubmission.surgery} />
                                                    </div>
                                                </div>

                                                {/* Medication Details */}
                                                <div className="bg-gray-800 p-4 rounded-lg">
                                                    <h3 className="font-semibold text-lg mb-4 text-blue-400 border-b border-gray-700 pb-2">Medication Details</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <DetailItem label="Medication Name" value={selectedSubmission.medicationName} />
                                                        <DetailItem label="Purpose" value={selectedSubmission.purpose} />
                                                        <DetailItem label="Frequency" value={selectedSubmission.frequency} />
                                                        <DetailItem label="Dosage" value={selectedSubmission.dosage} />
                                                        <DetailItem label="With Food" value={selectedSubmission.withFood} />
                                                        <DetailItem label="Swallowing Difficulty" value={selectedSubmission.swallowing} />
                                                    </div>
                                                </div>

                                                {/* Side Effects */}
                                                <div className="bg-gray-800 p-4 rounded-lg">
                                                    <h3 className="font-semibold text-lg mb-4 text-blue-400 border-b border-gray-700 pb-2">Side Effects</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <DetailItem label="Experiencing Side Effects" value={selectedSubmission.sideEffects} />
                                                        <DetailItem label="Improvement" value={selectedSubmission.improvement} />
                                                        <DetailItem label="Missed Doses" value={selectedSubmission.missedDoses} />
                                                    </div>
                                                </div>

                                                {/* Comments */}
                                                <div className="bg-gray-800 p-4 rounded-lg">
                                                    <h3 className="font-semibold text-lg mb-2 text-blue-400 border-b border-gray-700 pb-2">Additional Comments</h3>
                                                    <p className="whitespace-pre-line mt-2">
                                                        {selectedSubmission.comments || 'No comments provided'}
                                                    </p>
                                                </div>

                                                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                                                    {selectedSubmission.status === 'pending' && (
                                                        <>
                                                            <motion.button
                                                                onClick={() => {
                                                                    handleStatusUpdate(selectedSubmission.id, 'rejected');
                                                                    closeDetails();
                                                                }}
                                                                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Reject
                                                            </motion.button>
                                                            <motion.button
                                                                onClick={() => {
                                                                    handleStatusUpdate(selectedSubmission.id, 'approved');
                                                                    closeDetails();
                                                                }}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Approve
                                                            </motion.button>
                                                        </>
                                                    )}
                                                    <motion.button
                                                        onClick={closeDetails}
                                                        className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Close
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="min-h-screen bg-gray-50 p-6 font-bold flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl mb-4">No Access buddy 🥲</h1>
                        <p className="text-gray-600">You don't have permission to view this page</p>
                    </div>
                </div>
            )}
        </>
    );
}

// Helper component for consistent detail items
function DetailItem({ label, value }) {
    return (
        <div>
            <p className="text-sm text-white-800">{label}</p>
            <p className="font-medium">{value || 'Not provided'}</p>
        </div>
    );
}