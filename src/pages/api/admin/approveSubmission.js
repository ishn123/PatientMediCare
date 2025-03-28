import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { sendEmail } from "@/lib/email";
import { verifyAdmin } from "../middleware";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    await new Promise((resolve) => verifyAdmin(req, res, resolve));

    try {
        const { submissionId, userEmail } = req.body;

        const submissionRef = doc(db, "submissions", submissionId);
        await updateDoc(submissionRef, { status: "approved" });

        await sendEmail({
            to: userEmail,
            subject: "Your Submission Has Been Approved",
            html: `<h2>Congratulations!</h2>
                   <p>Your submission has been approved.</p>`
        });

        res.status(200).json({ message: "Submission approved!" });
    } catch (error) {
        console.error("Error approving submission:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
