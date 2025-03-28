import admin from "firebase-admin"

if (!admin.apps.length) {
    // Initialize the Firebase Admin SDK (use service account credentials for production)
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CONFIG)), // Or use admin.credential.cert(serviceAccount)
    });
} else {
    admin.app(); // Use the existing app if already initialized
}

export const adminAuth = admin.auth(); // For server-side Firebase Authentication
export const adminDb = admin.firestore(); // For server-side Firestore