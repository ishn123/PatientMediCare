'use client';

import { useContext } from 'react';
import { AuthContext } from '../../context/auth';
import Link from 'next/link';
import Header from "@/components/Header";

export default function Dashboard() {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome, {user?.name}</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    <Link
                        href="/questionnaire"
                        className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-semibold mb-4">Start New Questionnaire</h2>
                        <p className="text-gray-600">Complete our assessment to get your personalized recommendation</p>
                    </Link>

                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Your Recommendations</h2>
                        <p className="text-gray-600">View your current and past medication recommendations</p>
                    </div>
                </div>
            </main>
        </div>
    );
}