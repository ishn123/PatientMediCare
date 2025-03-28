"use client";
import {useState, useEffect, useContext} from 'react';
// //import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db,auth } from "@/lib/firebase.config";
// console.log("Hola bro")
import {AuthContext} from "@/context/auth";
import { motion } from 'framer-motion';


export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // 'pending' | 'approved' | 'rejected'

    const checkAdmin = async ()=>{
        console.log("CHECKING============")
        try{
            setLoading(true);
            console.log(user);

            if(!user)return false;
            const token = await user.idToken;
            const res = await fetch("/api/verify", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("responded",res);
        }catch(error){
            console.log("unable to verify user",error);
        }finally {
            setLoading(false);
        }
    }
    useEffect(() => {

        if(!user){ console.log("No user");return;}

        const fetchSubmissions = async () => {

            setLoading(true);

            const data = await fetch("/api/admin/getSubmissions", {
                method: "GET",
                headers:{
                   "Content-Type": "application/json"
                }
            }).then(res=>res.json())

            console.log(data)
          if(data) {
              setSubmissions([data[0]]);
              setLoading(false);
          }
        };

        checkAdmin().then(
            fetchSubmissions()
        ).catch(error => console.log(error));

    }, [user]);
    //
    // const handleApprove = async (submissionId) => {
    //     await updateStatus(submissionId, 'approved');
    // };
    //
    // const handleReject = async (submissionId) => {
    //     await updateStatus(submissionId, 'rejected');
    // };
    //
    // const updateStatus = async (submissionId, status) => {
    //     try {
    //         // Update in submissions collection
    //         await updateDoc(doc(db, 'submissions', submissionId), { status });
    //
    //         // Update in user's subcollection
    //         const submission = submissions.find(s => s.id === submissionId);
    //         if (submission) {
    //             const userRef = doc(db, 'users', submission.userId, 'questions', submissionId);
    //             await updateDoc(userRef, { status });
    //         }
    //
    //         // Refresh data
    //         setSubmissions(submissions.map(s =>
    //             s.id === submissionId ? { ...s, status } : s
    //         ));
    //     } catch (error) {
    //         console.error('Update error:', error);
    //     }
    // };

    // if (!currentUser?.email?.endsWith('@your-admin-domain.com')) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center">
    //             <p className="text-red-500 text-xl">Unauthorized access</p>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

                {/* Filter Controls */}
                <div className="flex gap-4 mb-6">
                    {['pending', 'approved', 'rejected', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg capitalize ${
                                filter === f
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-gray-300'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Submission List */}
                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
                    </div>
                ) : submissions.length === 0 ? (
                    <p className="text-gray-500">No {filter} submissions found</p>
                ) : (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {submissions.map((submission) => (
                            <motion.div
                                key={submission.id}
                                variants={{
                                    hidden: { y: 20, opacity: 0 },
                                    visible: { y: 0, opacity: 1 }
                                }}
                                className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-2">
                                        {submission.name || 'Anonymous'}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Submitted: {submission.submittedAt}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <p className="font-medium">Status:
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
                                            <p className="text-gray-700">
                                                <span className="font-medium">Comments:</span> {submission.comments}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-between pt-4 border-t">
                                        <a
                                            href={`/admin/submissions/${submission.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View Details
                                        </a>
                                        {submission.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleReject(submission.id)}
                                                    className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleApprove(submission.id)}
                                                    className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm"
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );

}