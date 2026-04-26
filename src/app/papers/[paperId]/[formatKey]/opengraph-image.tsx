import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { papersData } from "@/data/papers";

type RouteParams = {
    params: Promise<{
        paperId: string;
        formatKey: string;
    }>;
};

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export async function GET(request: Request, { params }: RouteParams) {
    const { paperId, formatKey } = await params;

    // --- 1. THE CRAWLER INTERCEPT ---
    // Detect if the request is coming from a social media platform or messenger generating a link preview
    const userAgent = request.headers.get("user-agent") || "";
    const isBot = /bot|crawler|spider|facebookexternalhit|twitterbot|slackbot|whatsapp|telegram|discordbot|linkedinbot|applebot|imessage/i.test(userAgent);

    if (isBot) {
        // Redirect the bot back to the parent page so it can scrape your beautiful OG tags!
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

        const titleSlug = slugify(paper.title);
        const downloadName = `jaxen-dutta_${titleSlug}_${formatKey}.pdf`;

        return new NextResponse(pdfBlob, {
            headers: {
                "Content-Disposition": `inline; filename=\"${downloadName}\"`,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return new NextResponse("Not Found", { status: 404 });
    }
}
