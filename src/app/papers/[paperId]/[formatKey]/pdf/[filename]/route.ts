// src/app/papers/[paperId]/[formatKey]/[filename]/route.ts
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { papersData } from "@/data/papers";

type RouteParams = {
    params: Promise<{
        paperId: string;
        formatKey: string;
        filename: string; // The URL naturally grabs this!
    }>;
};

export async function GET(request: Request, { params }: RouteParams) {
    const { paperId, formatKey, filename } = await params;

    // --- 1. THE CRAWLER INTERCEPT ---
    const userAgent = request.headers.get("user-agent") || "";
    const isBot = /bot|crawler|spider|facebookexternalhit|twitterbot|slackbot|whatsapp|telegram|discordbot|linkedinbot|applebot|imessage/i.test(userAgent);

    if (isBot) {
        // Bounce bots back to the main page to scrape your Open Graph image
        const mainPageUrl = new URL(`/papers/${paperId}/${formatKey}`, request.url);
        return NextResponse.redirect(mainPageUrl);
    }

    // --- 2. NORMAL FILE SERVING ---
    const paper = papersData[paperId];
    const doc = paper?.links?.[formatKey];

    if (!paper || !doc || doc.type === "project") {
        return new NextResponse("Not Found", { status: 404 });
    }

    const formatDir = path.join(process.cwd(), "papers", paperId, formatKey);

    try {
        const searchDirs = [path.join(formatDir, "out"), formatDir];
        let pdfBlob: Blob | null = null;

        for (const dir of searchDirs) {
            try {
                const entries = await fs.readdir(dir);
                const pdfEntry = entries.find(f => f.endsWith(".pdf"));
                if (pdfEntry) {
                    const buf = await fs.readFile(path.join(dir, pdfEntry));
                    pdfBlob = new Blob([buf], { type: "application/pdf" });
                    break;
                }
            } catch {
                continue;
            }
        }

        if (!pdfBlob) return new NextResponse("Not Found", { status: 404 });

        return new NextResponse(pdfBlob, {
            headers: {
                // Instantly inject the filename variable from the URL path!
                "Content-Disposition": `inline; filename=\"${filename}\"`,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return new NextResponse("Not Found", { status: 404 });
    }
}
