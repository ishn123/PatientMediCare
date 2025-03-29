import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { sendEmail } from "@/lib/email";

export default async function POST(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { formData, userEmail } = req.body;
        const userId = userEmail.split('@')[0];
        const questionsRef = collection(db, "users", userId, "questions");
        const dataToSave = {
            ...formData,
            status: 'pending',
            submittedAt: serverTimestamp(),
            userId,
            userEmail
        };

        const docRef = await addDoc(questionsRef, dataToSave);
        await setDoc(doc(db, "submissions", docRef.id), { ...dataToSave, userRef: doc(db, "users", userId) });

        await sendEmail({
            to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
            subject: 'New Submission',
            html: `<h2>New Submission from ${userEmail}</h2>
                   <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/${docRef.id}">View Submission</a>`
        });

        res.status(200).json({ success: true, submissionId: docRef.id });
    } catch (error) {
        console.error("Submission Failed:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
