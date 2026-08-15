import { CV_DOC_URL } from "@/data/contact";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get("download") === "1";

    try {
        const response = await fetch(CV_DOC_URL, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            return new Response("Failed to fetch CV document", { status: response.status });
        }

        const pdfBuffer = await response.arrayBuffer();

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": isDownload
                    ? 'attachment; filename="Anirban_Dutta_CV.pdf"'
                    : 'inline; filename="Anirban_Dutta_CV.pdf"',
                "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    } catch (error) {
        return new Response("Error fetching CV document", { status: 500 });
    }
}
