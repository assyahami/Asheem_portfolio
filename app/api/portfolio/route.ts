import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData, updatePortfolioSection, PortfolioData } from "@/lib/portfolio-data";

// GET /api/portfolio — returns the full portfolio data object
export async function GET() {
  try {
    const data = getPortfolioData();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message =
      err instanceof Error && err.message.trim()
        ? err.message
        : "Failed to load portfolio data.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/portfolio — updates a single section
// Body: { section: keyof PortfolioData, data: PortfolioData[section] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, data } = body as { section: keyof PortfolioData; data: unknown };

    const validSections: Array<keyof PortfolioData> = [
      "hero",
      "about",
      "works",
      "places",
      "timeline",
    ];

    if (!section || !validSections.includes(section)) {
      return NextResponse.json(
        {
          error: `Invalid section. Must be one of: ${validSections.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (data === undefined || data === null) {
      return NextResponse.json(
        { error: "Missing data payload for section update." },
        { status: 400 }
      );
    }

    const updated = updatePortfolioSection(
      section,
      data as PortfolioData[typeof section]
    );

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message =
      err instanceof Error && err.message.trim()
        ? err.message
        : "Failed to update portfolio data.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
