import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Company name prefixes and suffixes used to generate a fictional company name
 * that feels thematically connected to the selected industry.
 */
const COMPANY_PREFIXES = {
    Healthcare: ["Med", "Health", "Care", "Bio", "Vita"],
    FinTech: ["Pay", "Fin", "Cash", "Ledger", "Capital"],
    "E-Commerce": ["Shop", "Cart", "Market", "Retail", "Buy"],
    EdTech: ["Learn", "Edu", "Scholar", "Campus", "Brain"],
    "Logistics & Supply Chain": ["Ship", "Fleet", "Route", "Cargo", "Trans"],
};

const COMPANY_SUFFIXES = [
    "Flow",
    "Systems",
    "Hub",
    "Works",
    "Bridge",
    "Dynamics",
    "Sphere",
    "Core",
    "Pulse",
    "Wave",
];

/**
 * Picks a random element from an array.
 */
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a fictional company name based on the industry.
 */
function generateCompanyName(industryName) {
    const prefixes = COMPANY_PREFIXES[industryName] || ["Tech", "Digi", "Nova"];
    return pickRandom(prefixes) + pickRandom(COMPANY_SUFFIXES);
}

/**
 * Builds the "challenge" paragraph — the prompt students must respond to.
 */
function buildChallenge(industry, architecture, painPoints) {
    const painSummary = painPoints
        .map((p, i) => `(${i + 1}) ${p.description.split(".")[0]}`)
        .join("; ");

    return (
        `As a DevOps consultant hired by this ${industry.name} company, ` +
        `you must design a comprehensive transformation roadmap. ` +
        `The current system is built on a ${architecture.name}. ` +
        `The most pressing problems are: ${painSummary}. ` +
        `Your proposal should include CI/CD pipeline design, infrastructure automation, ` +
        `monitoring strategy, and a phased migration plan that minimises downtime and risk. ` +
        `Justify every tool and process choice with clear reasoning.`
    );
}

/**
 * GET /api/generate?difficulty=Easy|Medium|Hard
 *
 * Randomly selects an Industry, an Architecture, and 1-3 Pain Points
 * (optionally filtered by difficulty) and returns a cohesive case study JSON.
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const difficulty = searchParams.get("difficulty"); // "Easy" | "Medium" | "Hard" | null

        // ── Fetch all records ──────────────────────────────────────────────
        const [industries, architectures] = await Promise.all([
            prisma.industry.findMany(),
            prisma.architecture.findMany(),
        ]);

        if (industries.length === 0 || architectures.length === 0) {
            return NextResponse.json(
                { error: "Database is empty. Run `npx prisma db seed` first." },
                { status: 500 }
            );
        }

        // Fetch pain points — filter by difficulty if supplied
        const painPointsWhere = difficulty
            ? { difficultyLevel: difficulty }
            : {};

        const allPainPoints = await prisma.painPoint.findMany({
            where: painPointsWhere,
        });

        if (allPainPoints.length === 0) {
            return NextResponse.json(
                {
                    error: difficulty
                        ? `No pain points found for difficulty "${difficulty}".`
                        : "No pain points in the database. Run `npx prisma db seed` first.",
                },
                { status: 404 }
            );
        }

        // ── Randomly select records ────────────────────────────────────────
        const selectedIndustry = pickRandom(industries);
        const selectedArchitecture = pickRandom(architectures);

        // Pick 1-3 random pain points (without duplicates)
        const count = Math.min(
            Math.floor(Math.random() * 3) + 1,
            allPainPoints.length
        );
        const shuffled = [...allPainPoints].sort(() => 0.5 - Math.random());
        const selectedPainPoints = shuffled.slice(0, count);

        // ── Assemble the case study ────────────────────────────────────────
        const companyName = generateCompanyName(selectedIndustry.name);

        const caseStudy = {
            companyProfile: {
                companyName,
                industry: selectedIndustry.name,
                description: `${companyName} is ${selectedIndustry.description}`,
            },
            currentArchitecture: {
                name: selectedArchitecture.name,
                description: selectedArchitecture.description,
            },
            problems: selectedPainPoints.map((pp) => ({
                id: pp.id,
                description: pp.description,
                difficultyLevel: pp.difficultyLevel,
            })),
            challenge: buildChallenge(
                selectedIndustry,
                selectedArchitecture,
                selectedPainPoints
            ),
            metadata: {
                generatedAt: new Date().toISOString(),
                difficultyFilter: difficulty || "random",
                painPointCount: selectedPainPoints.length,
            },
        };

        return NextResponse.json(caseStudy);
    } catch (error) {
        console.error("Case study generation failed:", error);
        return NextResponse.json(
            { error: "Failed to generate case study. Ensure the database is seeded." },
            { status: 500 }
        );
    }
}
