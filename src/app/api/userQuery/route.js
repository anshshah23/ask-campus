import { StudentQuery } from "@/app/models/Query";
import { mongoConnect } from "@/app/utils/feature";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import NodeCache from 'node-cache';
import { GoogleGenerativeAI } from "@google/generative-ai";
const cache = new NodeCache();

export async function POST(req) {
    try {
        await mongoConnect();
        const { query, phoneNo, name, email } = await req.json();
        let student = await StudentQuery.findOne({ $or: [{ phoneNo }, { email }] });

        if (student) {
            const existingQuery = student.queries.find(q => q.content === query.content);

            if (existingQuery) {
                if (existingQuery.status !== 'completed') {
                    return NextResponse.json(
                        { message: 'A query with the same content is still in progress or pending', success: false },
                        { status: 400 }
                    );
                }
            }
            student.queries.push({
                content: query.content,
                date: new Date(),
                urgencyType: query.urgencyType,
                department: query.department
            });
            await student.save();

            cache.del('allStudentQueries');

            return NextResponse.json({ message: 'New Query added successfully', success: true }, { status: 201 });
        } else {
            const newStudentQuery = new StudentQuery({
                phoneNo,
                name,
                email,
                queries: [
                    {
                        content: query.content,
                        date: new Date(),
                        urgencyType: query.urgencyType,
                        department: query.department
                    }
                ]
            });

            await newStudentQuery.save();

            cache.del('allStudentQueries');

            return NextResponse.json({ message: 'Query added successfully', success: true }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ message: `Internal Server Error: ${error.message}`, success: false }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await mongoConnect();
        const { queryId, status, solution } = await req.json();

        const student = await StudentQuery.findOne({ 'queries._id': queryId });

        if (!student) {
            return NextResponse.json({ message: 'Query not found', success: false }, { status: 404 });
        }
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(solution);
        const embedding = result.embedding.values;
        const queryToUpdate = student.queries.id(queryId);
        queryToUpdate.status = status;

        if (status === 'completed' && solution) {
            queryToUpdate.completedAt = new Date();
            queryToUpdate.solution = solution;
            queryToUpdate.embedding = embedding;
        }

        await student.save();

        cache.del('allStudentQueries');

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
            <p>Dear ${student.name},</p>
            <p>Your query regarding "<b>${queryToUpdate.content}</b>" has been updated to the following status:</p>
            <p><b>${status}</b></p>
            ${status === 'completed' ? `<p>This query was completed on ${new Date(queryToUpdate.completedAt).toLocaleString()}.</p>` : ''}
            ${solution ? `<p>Solution: ${solution}</p>` : ''}
            <p>Thank you for your patience.</p>
        `;

        const mailOptions = {
            from: process.env.GMAIL,
            to: student.email,
            subject: `Query Status Update: ${status}`,
            html: emailHtml,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Query status updated and email notification sent successfully', success: true }, { status: 200 });
    } catch (error) {
        console.error('Error in PATCH function:', error.message);
        return NextResponse.json({ message: `Internal Server Error: ${error.message}`, success: false }, { status: 500 });
    }
}


export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    const departmentMap = {
        "Placement_Department": "Placement",
        "Admission_Department": "Admission",
        "Scholarships_Department": "Scholarship"
    };

    try {
        await mongoConnect();

        let cachedData = cache.get('allStudentQueries');
        if (cachedData) {
            return NextResponse.json({ allStudentQueries: cachedData, success: true }, { status: 200 });
        }

        let departmentFilter = {};
        if (role && departmentMap[role]) {
            departmentFilter = { 'queries.department': departmentMap[role] };
        }

        const allStudentQueries = await StudentQuery.find(departmentFilter);

        if (allStudentQueries.length === 0) {
            return NextResponse.json({ message: 'No queries found for this department or role', success: false }, { status: 404 });
        }

        if (!role) {
            cache.set('allStudentQueries', allStudentQueries);
        }

        return NextResponse.json({ allStudentQueries, success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: `Internal Server Error: ${error.message}`, success: false }, { status: 500 });
    }
}
