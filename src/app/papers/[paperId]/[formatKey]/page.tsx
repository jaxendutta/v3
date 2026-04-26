// src/app/papers/[paperId]/[formatKey]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { papersData } from "@/data/papers";
import IOSRedirect from "@/components/ui/IOSRedirect";

type Props = {
    params: Promise<{
        paperId: string;
        formatKey: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { paperId, formatKey } = await params;
    const paper = papersData[paperId];
    const doc = paper?.links?.[formatKey];

    if (!paper || !doc || doc.type === "project") {
        return {
            title: "Paper Not Found",
        };
    }

    return {
        title: `${paper.title} [${doc.label}]`,
        description: paper.abstract,
    };
}

export default async function PaperDocumentPage({ params }: Props) {
    const { paperId, formatKey } = await params;
    const paper = papersData[paperId];
    const doc = paper?.links?.[formatKey];

    if (!paper || !doc || doc.type === "project") {
        notFound();
    }

    const fileName = `jaxen-dutta_${paperId}_${formatKey}.pdf`;
    const pdfPath = `/papers/${paperId}/${formatKey}/${fileName}`;

    return (
        <main className="min-h-[100dvh] w-full bg-background no-scrollbar overflow-x-hidden relative">
            <IOSRedirect pdfUrl={pdfPath} />
            <iframe
                src={pdfPath}
                title={`${doc.label} - ${paper.title}`}
                className="absolute inset-0 h-[100dvh] w-full border-0"
            />
        </main>
    );
}
