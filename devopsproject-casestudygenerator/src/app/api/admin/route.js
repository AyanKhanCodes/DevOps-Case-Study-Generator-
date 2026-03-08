import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin
 * Returns all pain points ordered by id descending (newest first).
 */
export async function GET() {
    try {
        const painPoints = await prisma.painPoint.findMany({
            orderBy: { id: "desc" },
        });
        return NextResponse.json(painPoints);
    } catch (error) {
        console.error("Admin GET error:", error);
        return NextResponse.json(
            { error: "Failed to fetch pain points" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin
 * Creates a new pain point.
 * Body: { description: string, difficultyLevel: "Easy"|"Medium"|"Hard" }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { description, difficultyLevel } = body;

        // Validation
        if (!description || !description.trim()) {
            return NextResponse.json(
                { error: "Description is required" },
                { status: 400 }
            );
        }

        const validLevels = ["Easy", "Medium", "Hard"];
        if (!difficultyLevel || !validLevels.includes(difficultyLevel)) {
            return NextResponse.json(
                { error: "difficultyLevel must be 'Easy', 'Medium', or 'Hard'" },
                { status: 400 }
            );
        }

        const painPoint = await prisma.painPoint.create({
            data: {
                description: description.trim(),
                difficultyLevel,
            },
        });

        return NextResponse.json(painPoint, { status: 201 });
    } catch (error) {
        console.error("Admin POST error:", error);
        return NextResponse.json(
            { error: "Failed to create pain point" },
            { status: 500 }
        );
    }
}
