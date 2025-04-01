import {collection, doc, getDoc, updateDoc} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { sendEmail } from "@/lib/email";
import { verifyAdmin } from "../middleware";

export default async function POST(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    //await new Promise((resolve) => verifyAdmin(req, res, resolve));
    console.log("+++Upddate Syatis++=")
    try {
        const { submissionId, userEmail,newStatus } = req.body;

        const submissionRef = doc(db, "submissions", submissionId);
        await updateDoc(submissionRef, { status: "approved" });

        const submissionData = (await getDoc(submissionRef)).data();
        console.log(submissionData)
        const userRefIdForCurrentEmail = submissionData.userId;


        const questionsRef = doc(db, "users", userRefIdForCurrentEmail, "questions",submissionId);
        await updateDoc(questionsRef, { status: "approved" });


        await sendEmail({
            to: submissionData.userEmail,
            subject: "Your Submission Has Been Approved",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Submission Approved</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .email-container {
                            border: 1px solid #e0e0e0;
                            border-radius: 8px;
                            overflow: hidden;
                        }
                        .header {
                            background-color: #4CAF50;
                            color: white;
                            padding: 30px 20px;
                            text-align: center;
                        }
                        .content {
                            padding: 30px 20px;
                            background-color: #ffffff;
                        }
                        .footer {
                            background-color: #f5f5f5;
                            padding: 20px;
                            text-align: center;
                            font-size: 12px;
                            color: #777;
                        }
                        h1 {
                            margin-top: 0;
                            color: white;
                        }
                        h2 {
                            color: #2c3e50;
                            margin-top: 0;
                        }
                        .button {
                            display: inline-block;
                            padding: 12px 24px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 4px;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .details {
                            background-color: #f9f9f9;
                            padding: 15px;
                            border-radius: 4px;
                            margin: 20px 0;
                        }
                        .detail-item {
                            margin-bottom: 10px;
                        }
                        .detail-label {
                            font-weight: bold;
                            color: #555;
                        }
                        @media only screen and (max-width: 600px) {
                            .content, .header, .footer {
                                padding: 20px 15px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h1>Submission Approved</h1>
                            <p>Your request has been successfully processed</p>
                        </div>
                        
                        <div class="content">
                            <h2>Congratulations, ${submissionData.name || 'Valued User'}!</h2>
                            <p>We're pleased to inform you that your recent submission has been reviewed and approved by our team.</p>
                            
                            <div class="details">
                                <div class="detail-item">
                                    <span class="detail-label">Submission ID:</span> ${submissionId}
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Date Approved:</span> ${new Date().toLocaleDateString()}
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Medication:</span> ${submissionData.medicationName || 'Not specified'}
                                </div>
                            </div>
                            
                            <p>Here are the next steps:</p>
                            <ol>
                                <li>Your prescription will be processed within 24 hours</li>
                                <li>You'll receive a confirmation when ready</li>
                                <li>Contact your physician if you have any questions</li>
                            </ol>
                            
                            <center>
                                <a href="https://yourwebsite.com/dashboard" class="button">View Submission</a>
                            </center>
                            
                            <p>If you have any questions about this approval, please reply to this email or contact our support team.</p>
                            
                            <p>Best regards,<br>The Healthcare Team</p>
                        </div>
                        
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Your Healthcare Provider. All rights reserved.</p>
                            <p>
                                <a href="https://yourwebsite.com/privacy" style="color: #4CAF50;">Privacy Policy</a> | 
                                <a href="https://yourwebsite.com/contact" style="color: #4CAF50;">Contact Us</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                `
        });

        res.status(200).json({ message: "Submission approved!" });
    } catch (error) {
        console.error("Error approving submission:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
