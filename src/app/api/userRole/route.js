import { NextResponse } from "next/server";
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(req) {
    const { email, role, phoneNo } = await req.json();

    const clerk = clerkClient();
    const userList = await clerk.users.getUserList({
        emailAddress: [email]
    });

    if (userList.totalCount !== 1) {
        return NextResponse.json(
            { message: 'User not found', success: false },
            { status: 404 }
        );
    }

    const user = userList?.data[0];
    const publicMetadata = user?.publicMetadata;

    if (publicMetadata?.role) {
        return NextResponse.json(
            { message: 'Role already assigned, cannot change role.', success: false },
            { status: 400 }
        );
    }

    try {
        await clerk.users.updateUserMetadata(user.id, {
            publicMetadata: {
                role: role,
                phoneNo: phoneNo
            },
        });
        return NextResponse.json({ message: 'Login successfull', success: true }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: `Internal Server Error: ${err.message}`, success: false }, { status: 500 });
    }
}


export async function GET() {
    const clerk = clerkClient();
    try {
        const users = await clerk.users.getUserList();
        const usersWithRoles = users.data.map(user => ({
            email: user.emailAddresses[0]?.emailAddress,
            role: user.publicMetadata?.role || 'No role assigned',
            phoneNo: user.publicMetadata?.phoneNo,
        }));

        return NextResponse.json({ users: usersWithRoles.role, success: true }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ message: `Internal Server Error: ${err.message}`, success: false }, { status: 500 });
    }
}