"use client";
import {useEffect, useState} from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiCalendar, FiPieChart, FiSettings, FiUser, FiBell } from 'react-icons/fi';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'Your submission was approved', time: '2 hours ago', read: false },
        { id: 2, text: 'New message from your doctor', time: '1 day ago', read: true }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);

    // Sample data
    const stats = [
        { name: 'Active Medications', value: 3, change: '+1', icon: <FiActivity /> },
        { name: 'Upcoming Appointments', value: 2, change: '0', icon: <FiCalendar /> },
        { name: 'Completed Treatments', value: 5, change: '+2', icon: <FiPieChart /> }
    ];

    const medications = [
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', status: 'active' },
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', status: 'active' },
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'At bedtime', status: 'active' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Animated Sidebar */}
            <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed h-full w-64 bg-gradient-to-b from-indigo-600 to-purple-700 text-white shadow-xl"
            >
                <div className="p-6">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-3 mb-10 cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                            <FiUser className="text-indigo-600 text-xl" />
                        </div>
                        <div>
                            <p className="font-medium">Welcome back</p>
                            <p className="text-sm text-indigo-100">John Doe</p>
                        </div>
                    </motion.div>

                    <nav className="space-y-2">
                        {[
                            { id: 'overview', icon: <FiPieChart />, label: 'Overview' },
                            { id: 'medications', icon: <FiActivity />, label: 'Medications' },
                            { id: 'appointments', icon: <FiCalendar />, label: 'Appointments' },
                            { id: 'settings', icon: <FiSettings />, label: 'Settings' }
                        ].map((item) => (
                            <motion.button
                                key={item.id}
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-white text-indigo-600' : 'text-indigo-100 hover:bg-indigo-500'}`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </motion.button>
                        ))}
                    </nav>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="ml-64 p-8">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-between items-center mb-8"
                >
                    <h1 className="text-3xl font-bold">
                        {activeTab === 'overview' && 'Dashboard Overview'}
                        {activeTab === 'medications' && 'My Medications'}
                        {activeTab === 'appointments' && 'Appointments'}
                        {activeTab === 'settings' && 'Settings'}
                    </h1>

                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-full bg-white shadow-md relative"
                        >
                            <FiBell className="text-indigo-600 text-xl" />
                            {notifications.some(n => !n.read) && (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-10 overflow-hidden"
                                >
                                    <div className="p-3 border-b border-gray-200 font-medium">Notifications</div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {notifications.map(notification => (
                                            <motion.div
                                                key={notification.id}
                                                whileHover={{ backgroundColor: '#f8f9fa' }}
                                                className="p-3 border-b border-gray-100 cursor-pointer"
                                            >
                                                <p className="font-medium">{notification.text}</p>
                                                <p className="text-sm text-gray-500">{notification.time}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Dashboard Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {stats.map((stat, index) => (
                                        <motion.div
                                            key={stat.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ y: -5 }}
                                            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500"
                                        >
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="text-gray-500">{stat.name}</p>
                                                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                                                </div>
                                                <div className="text-indigo-500 text-3xl">{stat.icon}</div>
                                            </div>
                                            <p className={`mt-4 text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-gray-500'}`}>
                                                {stat.change} from last week
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Recent Activity */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white rounded-xl shadow-md p-6"
                                >
                                    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                                    <div className="space-y-4">
                                        {[
                                            { action: 'Medication approved', time: '2 hours ago', type: 'success' },
                                            { action: 'Appointment scheduled', time: '1 day ago', type: 'info' },
                                            { action: 'Prescription refill requested', time: '3 days ago', type: 'warning' }
                                        ].map((item, index) => (
                                            <motion.div
                                                key={index}
                                                whileHover={{ x: 5 }}
                                                className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg"
                                            >
                                                <div className={`w-3 h-3 rounded-full ${
                                                    item.type === 'success' ? 'bg-green-500' :
                                                        item.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                                                }`}></div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.action}</p>
                                                    <p className="text-sm text-gray-500">{item.time}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {activeTab === 'medications' && (
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold">Current Medications</h2>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                                        >
                                            Add Medication
                                        </motion.button>
                                    </div>

                                    <div className="space-y-4">
                                        {medications.map((med, index) => (
                                            <motion.div
                                                key={med.name}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.02 }}
                                                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-lg">{med.name}</h3>
                                                        <p className="text-gray-600">{med.dosage} • {med.frequency}</p>
                                                    </div>
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {med.status}
                          </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserDashboard;