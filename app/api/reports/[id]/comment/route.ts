import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/reports/[id]/comment
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { deviceId, text } = await req.json();
        const reportId = params.id;

        if (!deviceId || !reportId || !text) {
            return NextResponse.json(
                { error: "Device ID, Report ID, and text are required" },
                { status: 400 }
            );
        }

        // Find user by deviceId
        const user = await prisma.user.findUnique({
            where: { deviceId },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Create comment
        const comment = await prisma.comment.create({
            data: {
                userId: user.id,
                reportId: reportId,
                text: text,
            },
            include: {
                user: true,
            },
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
}
