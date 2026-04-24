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

export async function GET(_: Request, { params }: RouteParams) {
    const { paperId, formatKey } = await params;
    const paper = papersData[paperId];
    const doc = paper?.links?.[formatKey];

    if (!paper || !doc || doc.type === "project") {
        return new NextResponse("Not Found", { status: 404 });
    }

    const formatDir = path.join(process.cwd(), "src", "data", "papers", paperId, formatKey);

    try {
        // LaTeX output lives in out/; uploaded files (presentations etc.) sit directly in the format dir
        const searchDirs = [path.join(formatDir, "out"), formatDir];
        let pdfBuffer: Buffer | null = null;

        for (const dir of searchDirs) {
            try {
                const entries = await fs.readdir(dir);
                const pdfEntry = entries.find(f => f.endsWith(".pdf"));
                if (pdfEntry) {
                    pdfBuffer = await fs.readFile(path.join(dir, pdfEntry));
                    break;
                }
            } catch {
                continue;
            }
        }

        if (!pdfBuffer) return new NextResponse("Not Found", { status: 404 });

        const titleSlug = slugify(paper.title);
        const downloadName = `jaxen-dutta_${titleSlug}_${formatKey}.pdf`;

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename=\"${downloadName}\"`,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return new NextResponse("Not Found", { status: 404 });
    }
}
