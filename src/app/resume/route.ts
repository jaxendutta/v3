import { RESUME_DOC_URL } from "@/data/contact";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get("download") === "1";

    try {
        const response = await fetch(RESUME_DOC_URL, {
            cache: "no-store",
        });

        if (!response.ok) {
            return new Response("Failed to fetch resume document", { status: response.status });
        }

        const pdfBuffer = await response.arrayBuffer();

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": isDownload
                    ? 'attachment; filename="Anirban_Dutta_Resume.pdf"'
                    : 'inline; filename="Anirban_Dutta_Resume.pdf"',
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
            },
        });
    } catch (error) {
        return new Response("Error fetching resume document", { status: 500 });
    }
}
