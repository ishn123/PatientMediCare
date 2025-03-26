'use client';

import { useContext } from 'react';
import { AuthContext } from '../context/auth';
import { useRouter } from 'next/navigation';
import {useTranslations} from "next-intl";

export default function MainCTA() {
    const { isAuthenticated,setAuthModalOpen } = useContext(AuthContext);
    const t = useTranslations("MainCTA");
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {isAuthenticated ? (
                <button
                    onClick={() => router.push('/questionaire')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition font-medium"
                >
                    {t("button.start_question")}
                </button>
            ) : (
                <button
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition font-medium"
                >
                    {t("button.get_started")}
                </button>
            )}
            <button
                onClick={() => {
                    const element = document.getElementById('how-it-works');
                    element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition font-medium"
            >
                {t("button.learn_more")}
            </button>
        </div>
    );
}