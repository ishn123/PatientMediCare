import { collection, getDocs,query,where,getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { verifyAdmin } from "../middleware";

export default async function GET(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }


    try {
        const submissionsRef = collection(db, "submissions");
        const q = query(submissionsRef,where("status","==","pending"));
        const snapshot = await getDocs(q);
        //const submissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const submissions = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const submissionData = doc.data();
                const userRef = submissionData.userRef; // This is the Firestore document reference for the user

                // Fetch the user document using the userRef (reference to the users collection)
                const userDoc = await getDoc(userRef);
                console.log("user ref is ",userDoc.data());
                const userData = userDoc.exists() ? userDoc.data() : null;


                // Return the submission with user details (optional)
                return {
                    id: doc.id,
                    ...submissionData,
                    user: userData ? { id: userDoc.id, ...userData } : null, // Attach user data if needed
                };
            })
        );

        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
