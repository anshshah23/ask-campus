import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { name, email, phoneNo, query, department, urgencyType } = await request.json();

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
            <p>A new high urgency query has been submitted:</p>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Phone:</strong> ${phoneNo}</li>
                <li><strong>Department:</strong> ${department}</li>
                <li><strong>Query:</strong> ${query}</li>
                <li><strong>Urgency:</strong> ${urgencyType}</li>
            </ul>
            <p>Please address the query at your earliest convenience.</p>
        `;

        const mailOptions = {
            from: process.env.GMAIL,
            to: process.env.SUPERADMIN,
            subject: `High Urgency Query from ${name}`,
            html: emailHtml,
        };

        // Send email
        const emailResponse = await transporter.sendMail(mailOptions);

        console.log('Email sent:', emailResponse.messageId);
        return NextResponse.json({ success: true, message: 'High urgency email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, message: 'Failed to send high urgency email.' });
    }
}
