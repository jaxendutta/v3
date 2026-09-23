// src/app/talks/[talkId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { presentationsData } from "@/data/presentations";
import TalkDetailContent from "@/components/sections/talks/TalkDetailContent";

type Props = {
    params: Promise<{ talkId: string }>;
};

export function generateStaticParams() {
    return Object.keys(presentationsData).map((talkId) => ({
        talkId,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { talkId } = await params;
    const data = presentationsData[talkId];

    if (!data) {
        return {
            title: "Talk Not Found",
        };
    }

    const cleanTitle = data.title.replace(/<[^>]*>/g, "");
    const description = data.abstract?.replace(/<[^>]*>/g, "").slice(0, 160) || `Talk by Jaxen Dutta`;

    return {
        title: `${cleanTitle} ✧ Jaxen Dutta`,
        description,
        openGraph: {
            title: `${cleanTitle} ✧ Jaxen Dutta`,
            description,
        },
    };
}

export default async function TalkDetailPage({ params }: Props) {
    const { talkId } = await params;
    const data = presentationsData[talkId];

    if (!data) {
        notFound();
    }

    return <TalkDetailContent talkId={talkId} />;
}
