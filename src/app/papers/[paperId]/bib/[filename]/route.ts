import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { papersData } from "@/data/papers";

type RouteParams = {
    params: Promise<{ paperId: string }>;
};

export async function GET(_: Request, { params }: RouteParams) {
    const { paperId } = await params;
    const paper = papersData[paperId];

    if (!paper) return new NextResponse("Not Found", { status: 404 });

    const bibPath = path.join(
        process.cwd(),
        "papers", paperId, `${paperId}.bib`
    );

    try {
        const content = await fs.readFile(bibPath, "utf-8");
        return new NextResponse(content, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch {
        return new NextResponse("Not Found", { status: 404 });
    }
}
