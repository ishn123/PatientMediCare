import { collection, getDocs,query,where,getDoc,doc } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
export default async function POST(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const documentId = req.body.documentId;

        // Fetch the specific submission document
        const submissionDocRef = doc(db, "submissions", documentId);
        const submissionSnap = await getDoc(submissionDocRef);

        if (!submissionSnap.exists()) {
            return res.status(404).json({ error: "Submission not found" });
        }

        const submissionData = submissionSnap.data();
        const userRefIdForCurrentEmail = submissionData.userId; // Reference to the user

        if (!userRefIdForCurrentEmail) {
            return res.status(400).json({ error: "User reference not found in submission" });
        }

        // Fetch all questions under "users/{userRef}/questions"
        const questionsRef = collection(db, "users", userRefIdForCurrentEmail, "questions");
        const questionsSnapshot = await getDocs(questionsRef);

        let questions = [];
        questionsSnapshot.forEach((doc) => {
            questions.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        // Filter out the current userRefId
        questions = questions.filter((item) => item.id !== userRefIdForCurrentEmail);

        return res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
