import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { deviceId, imageUrl, analysisResult, location, latitude, longitude } = body;

        if (!deviceId || !imageUrl) {
            return NextResponse.json(
                { error: "Device ID and Image URL are required" },
                { status: 400 }
            );
        }

        // Find or create user by deviceId
        let user = await prisma.user.findUnique({
            where: { deviceId },
        });

        if (!user) {
            user = await prisma.user.create({
                data: { deviceId },
            });
        }

        // Create report
        const report = await prisma.report.create({
            data: {
                userId: user.id,
                imageUrl,
                analysisResult: analysisResult || {},
                location: location || "Unknown",
                latitude,
                longitude,
                status: "pending",
            },
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error("Error creating report:", error);
        return NextResponse.json(
            { error: "Failed to create report" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const reports = await prisma.report.findMany({
            include: {
                user: true,
                likes: true,
                comments: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        return NextResponse.json(
            { error: "Failed to fetch reports" },
            { status: 500 }
        );
    }
}
