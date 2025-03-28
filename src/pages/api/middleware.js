import { adminAuth } from "@/lib/firebase-admin";

import { auth, db } from "@/lib/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import {getAuth} from "firebase/auth";

export async function verifyAdmin(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Get token from header
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        console.log("Token is",token);
        // Verify the Firebase ID token
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userEmail = decodedToken.email;

        // Check if user is in Firestore "admins" collection
        const adminRef = doc(db, "admins", userEmail);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists() || adminSnap.data().role !== "admin") {
            return res.status(403).json({ error: "Access Denied" });
        }

        // Attach user data to request and proceed
        req.user = decodedToken;
        next(res.status(200).json({success:true}));

    } catch (error) {
        console.error("Admin verification error:", error);
        res.status(403).json({ error: "Invalid token" });
    }
}
