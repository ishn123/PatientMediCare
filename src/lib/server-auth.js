import admin from "firebase-admin";
import { readFile } from "fs/promises";

// Load the service account JSON file dynamically
const serviceAccount = JSON.parse(
    await readFile(new URL("./path/to/service-account-file.json", import.meta.url))
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://your-project-id.firebaseio.com", // Required if using Realtime Database
});

export default admin;
