import { StudentQuery } from "@/app/models/Query";
import { mongoConnect } from "@/app/utils/feature";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ message: 'Login First', success: false }, { status: 400 });
        }

        await mongoConnect();
        const studentQuery = await StudentQuery.findOne({ email });
        console.log(studentQuery);
        if (!studentQuery) {
            return NextResponse.json({ message: 'No queries found for your email', success: false }, { status: 404 });
        }

        return NextResponse.json({ queries: studentQuery.queries, success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: `Internal Server Error: ${error.message}`, success: false }, { status: 500 });
    }
}
