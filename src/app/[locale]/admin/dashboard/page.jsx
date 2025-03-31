"use client";
import {useState, useEffect, useContext} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiUser, FiClock, FiCheck, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import {AuthContext} from "@/context/auth";

const AdminDashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedSubmission, setExpandedSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const {user} = useContext(AuthContext);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });

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
        return true;
    }

    // Fetch submissions from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/admin/getSubmissions');
                const data = await response.json();
                setSubmissions(data);
                setFilteredSubmissions(data);

                // Calculate stats
                const stats = {
                    total: data.length,
                    pending: data.filter(s => s.status === 'pending').length,
                    approved: data.filter(s => s.status === 'approved').length,
                    rejected: data.filter(s => s.status === 'rejected').length
                };
                setStats(stats);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        try{
            if(checkAdmin()) {
                fetchData();
                setIsAdmin(true);
            }
        }catch(error){
            setIsAdmin(false);
        }finally {
            setLoading(false);
        }

    }, []);

    // Filter submissions based on search and status
    useEffect(() => {
        let result = [...submissions];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(submission =>
                submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                submission.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(submission => submission.status === statusFilter);
        }

        setFilteredSubmissions(result);
    }, [searchTerm, statusFilter, submissions]);

    const handleStatusChange = async (submissionId, newStatus) => {
        try {
            // Call API to update status
            const response = await fetch(`/api/admin/submissions/${submissionId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Update local state
                setSubmissions(prev =>
                    prev.map(sub =>
                        sub.id === submissionId ? { ...sub, status: newStatus } : sub
                    )
                );

                // Update stats
                setStats(prev => {
                    const newStats = { ...prev };
                    // Decrement old status count
                    if (submissions.find(s => s.id === submissionId)?.status === 'pending') newStats.pending--;
                    if (submissions.find(s => s.id === submissionId)?.status === 'approved') newStats.approved--;
                    if (submissions.find(s => s.id === submissionId)?.status === 'rejected') newStats.rejected--;
                    // Increment new status count
                    if (newStatus === 'pending') newStats.pending++;
                    if (newStatus === 'approved') newStats.approved++;
                    if (newStatus === 'rejected') newStats.rejected++;
                    return newStats;
                });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const toggleSubmissionExpansion = (submissionId) => {
        setExpandedSubmission(expandedSubmission === submissionId ? null : submissionId);
    };

    // Convert Firestore timestamp to Date
    const firestoreTimestampToDate = (timestamp) => {
        if (!timestamp) return new Date();
        return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    };

    return (
        <>

            {isAdmin && (<div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        whileHover={{y: -5}}
                        className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
                    >
                        <p className="text-gray-500">Total Submissions</p>
                        <p className="text-3xl font-bold mt-2">{stats.total}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{y: -5}}
                        className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500"
                    >
                        <p className="text-gray-500">Pending</p>
                        <p className="text-3xl font-bold mt-2">{stats.pending}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{y: -5}}
                        className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500"
                    >
                        <p className="text-gray-500">Approved</p>
                        <p className="text-3xl font-bold mt-2">{stats.approved}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{y: -5}}
                        className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500"
                    >
                        <p className="text-gray-500">Rejected</p>
                        <p className="text-3xl font-bold mt-2">{stats.rejected}</p>
                    </motion.div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400"/>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <FiFilter className="text-gray-400 mr-2"/>
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submissions List */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredSubmissions.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <p className="text-gray-500 text-lg">No submissions found matching your criteria</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredSubmissions.map((submission) => (
                            <motion.div
                                key={submission.id}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                className="bg-white rounded-xl shadow-md overflow-hidden"
                            >
                                <div
                                    className="p-6 cursor-pointer flex justify-between items-center"
                                    onClick={() => toggleSubmissionExpansion(submission.id)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FiUser className="text-blue-600"/>
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{submission.name}</h3>
                                            <p className="text-gray-500 text-sm">{submission.userEmail}</p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                Medication: {submission.medicationName} • {submission.dosage}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                    }`}>
                      {submission.status}
                    </span>
                                        {expandedSubmission === submission.id ? (
                                            <FiChevronUp className="text-gray-400"/>
                                        ) : (
                                            <FiChevronDown className="text-gray-400"/>
                                        )}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedSubmission === submission.id && (
                                        <motion.div
                                            initial={{height: 0, opacity: 0}}
                                            animate={{height: 'auto', opacity: 1}}
                                            exit={{height: 0, opacity: 0}}
                                            transition={{duration: 0.3}}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-t border-gray-200 px-6 py-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Patient Information */}
                                                    <div>
                                                        <h4 className="font-medium mb-3 text-blue-600">Patient
                                                            Information</h4>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-xs text-gray-500">Full Name</p>
                                                                <p>{submission.name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Date of Birth</p>
                                                                <p>{submission.birthDate}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Gender</p>
                                                                <p>{submission.gender}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Doctor</p>
                                                                <p>{submission.doctor || 'Not specified'}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Medication Details */}
                                                    <div>
                                                        <h4 className="font-medium mb-3 text-blue-600">Medication
                                                            Details</h4>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-xs text-gray-500">Medication Name</p>
                                                                <p>{submission.medicationName}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Purpose</p>
                                                                <p>{submission.purpose}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Dosage</p>
                                                                <p>{submission.dosage}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Frequency</p>
                                                                <p>{submission.frequency}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">With Food</p>
                                                                <p>{submission.withFood}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Health Information */}
                                                <div className="mt-6">
                                                    <h4 className="font-medium mb-3 text-blue-600">Health Information</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <p className="text-xs text-gray-500">Medical Conditions</p>
                                                            <p>{submission.conditions}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Current Medications</p>
                                                            <p>{submission.medications}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Allergies</p>
                                                            <p>{submission.allergies}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Pregnant</p>
                                                            <p>{submission.pregnant}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Recent Surgery</p>
                                                            <p>{submission.surgery}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Additional Information */}
                                                <div className="mt-6">
                                                    <h4 className="font-medium mb-3 text-blue-600">Additional
                                                        Information</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <p className="text-xs text-gray-500">Side Effects</p>
                                                            <p>{submission.sideEffects}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Improvement</p>
                                                            <p>{submission.improvement}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Missed Doses</p>
                                                            <p>{submission.missedDoses}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Swallowing Difficulty</p>
                                                            <p>{submission.swallowing}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Comments and Actions */}
                                                <div className="mt-6">
                                                    {submission.comments && (
                                                        <div className="mb-4">
                                                            <p className="text-xs text-gray-500">Patient Comments</p>
                                                            <p className="whitespace-pre-line bg-gray-50 p-3 rounded">{submission.comments}</p>
                                                        </div>
                                                    )}

                                                    <div
                                                        className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                        <p className="text-xs text-gray-500">
                                                            Submitted: {firestoreTimestampToDate(submission.submittedAt).toLocaleString()}
                                                        </p>

                                                        {submission.status === 'pending' && (
                                                            <div className="flex space-x-3">
                                                                <motion.button
                                                                    whileHover={{scale: 1.05}}
                                                                    whileTap={{scale: 0.95}}
                                                                    onClick={() => handleStatusChange(submission.id, 'approved')}
                                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                                                                >
                                                                    Approve
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{scale: 1.05}}
                                                                    whileTap={{scale: 0.95}}
                                                                    onClick={() => handleStatusChange(submission.id, 'rejected')}
                                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
                                                                >
                                                                    Reject
                                                                </motion.button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>)}
            {!isAdmin && (
                <div className="min-h-screen bg-gray-50 p-6 font-bold flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl mb-4">No Access buddy 🥲</h1>
                        <p className="text-gray-600">You don't have permission to view this page</p>
                    </div>
                </div>
            )}

        </>

    )
        ;
};

export default AdminDashboard;