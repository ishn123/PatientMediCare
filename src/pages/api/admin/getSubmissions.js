import { collection, getDocs,query,where,getDoc,doc } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
export default async function handler(req, res) {
    if(req.method === "GET") {
        try {
            const submissionsRef = await collection(db, "submissions");

            const submissionsSnapShot = await getDocs(submissionsRef);

            let submissions = [];
            submissionsSnapShot.forEach((doc) => {
                submissions.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            res.status(200).json(submissions);

        }catch (error){
            console.log("Error facing submissions", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }else{
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

            console.log(userRefIdForCurrentEmail)

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
            console.log(questions);
            return res.status(200).json(questions);
        } catch (error) {
            console.error("Error fetching submissions:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

}
