import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';
import { papersData } from '@/data/papers';
import { loadOgFonts } from '@/lib/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Props = { params: Promise<{ paperId: string; formatKey: string }> };

export default async function Image({ params }: Props) {
    const { paperId, formatKey } = await params;
    const paper = papersData[paperId];
    if (!paper) notFound();

    const { serifFamily, sansFamily, fonts } = await loadOgFonts();
    const formatLabel = paper.links[formatKey]?.label ?? formatKey.toUpperCase();
    const venue = paper.venue?.join(' · ') ?? '';
    const typeVenue = venue ? `${paper.paperType} — ${venue}` : paper.paperType;

    const endDate = paper.duration.end.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });

    return new ImageResponse(
        (
            <div style={{ background: '#18181b', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '72px 80px' }}>
                <div style={{ color: '#e11d48', fontSize: 24, fontFamily: sansFamily }}>{formatLabel}</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 40, gap: 20 }}>
                    <div style={{ color: '#fff7ed', fontSize: 60, fontFamily: serifFamily, fontStyle: 'italic', fontWeight: 400, lineHeight: 1.3, letterSpacing: '0.025em' }}>{paper.title}</div>
                    <div style={{ color: '#fff7ed', fontSize: 28, fontFamily: sansFamily, opacity: 0.5 }}>{typeVenue}</div>
                </div>
                <div style={{ width: '100%', height: 2, background: '#e11d48', marginBottom: 28 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#fff7ed', fontSize: 36, fontFamily: sansFamily, opacity: 0.6 }}>Jaxen Dutta</div>
                    <div style={{ color: '#e11d48', fontSize: 28, fontFamily: sansFamily }}>{endDate}</div>
                </div>
            </div>
        ),
        { ...size, ...(fonts.length > 0 ? { fonts } : {}) }
    );
}