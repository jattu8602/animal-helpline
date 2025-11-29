import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/reports/[id]/like
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { deviceId } = await req.json();
        const reportId = params.id;

        if (!deviceId || !reportId) {
            return NextResponse.json(
                { error: "Device ID and Report ID are required" },
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

        // Check if already liked
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_reportId: {
                    userId: user.id,
                    reportId: reportId,
                },
            },
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: { id: existingLike.id },
            });
            return NextResponse.json({ liked: false });
        } else {
            // Like
            await prisma.like.create({
                data: {
                    userId: user.id,
                    reportId: reportId,
                },
            });
            return NextResponse.json({ liked: true });
        }
    } catch (error) {
        console.error("Error toggling like:", error);
        return NextResponse.json(
            { error: "Failed to toggle like" },
            { status: 500 }
        );
    }
}
