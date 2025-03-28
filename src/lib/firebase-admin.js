import admin from "firebase-admin"
import * as serviceAccount from "@/../pillsrecommendation-firebase-adminsdk-fbsvc-e7fb459e63.json";

if (!admin.apps.length) {
    // Initialize the Firebase Admin SDK (use service account credentials for production)
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount), // Or use admin.credential.cert(serviceAccount)
    });
} else {
    admin.app(); // Use the existing app if already initialized
}

export const adminAuth = admin.auth(); // For server-side Firebase Authentication
export const adminDb = admin.firestore(); // For server-side Firestore