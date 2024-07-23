import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { title } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        console.log("UserId:", userId)

        if (!title) {
            return new NextResponse("Course title is required!")
        }

        const course = await db.course.create({
            data: {
                userId,
                title,
            },
        });

        return NextResponse.json(course)

    } catch (error) {
        console.log("[COURSES]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}