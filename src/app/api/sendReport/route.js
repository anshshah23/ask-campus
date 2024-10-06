import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { pdfBlob } = await request.json();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GPASSWORD,
            },
        });

        const emailHtml = `
            <p>Dear Admin,</p>
            <p>Attached is the student queries report generated from the system.</p>
            <p>Thank you.</p>
        `;
        let adminMail = process.env.SUPERADMIN;
        const mailOptions = {
            from: process.env.GMAIL,
            to: adminMail,
            subject: "Student Queries Report",
            html: emailHtml,
            attachments: [
                {
                    filename: "student_queries_report.pdf",
                    content: pdfBlob,
                    encoding: "base64",
                    contentType: "application/pdf",
                },
            ],
        };

        const ans = await transporter.sendMail(mailOptions);
        console.log(ans);

        return NextResponse.json({ success: true, message: "Report sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ success: false, message: "Failed to send report." });
    }
}
