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

export async function GET(_: Request, { params }: RouteParams) {
    const { paperId, formatKey } = await params;
    const paper = papersData[paperId];
    const doc = paper?.links?.[formatKey];

    if (!paper || !doc || doc.type === "project") {
        return new NextResponse("Not Found", { status: 404 });
    }

    const originalFilename = `${paperId}-${formatKey}.pdf`;
    const downloadFilename = `jaxen-dutta_${originalFilename}`;
    const pdfFilePath = path.join(process.cwd(), "public", "papers", paperId, originalFilename);

    try {
        const pdfBuffer = await fs.readFile(pdfFilePath);

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename=\"${downloadFilename}\"`,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return new NextResponse("Not Found", { status: 404 });
    }
}
