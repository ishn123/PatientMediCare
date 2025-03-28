import { verifyAdmin } from "./middleware";

export default async function GET(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // Use the verifyAdmin middleware to check if the user is an admin
        await new Promise((resolve) => verifyAdmin(req, res, resolve));
        console.log("scues")
        // If the middleware does not throw, the user is an admin
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Admin verification failed", error);
        res.status(403).json({ error: "Forbidden" });
    }
}
