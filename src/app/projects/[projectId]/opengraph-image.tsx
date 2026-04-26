import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';
import { projectsData } from '@/data/projects';
import { loadOgFonts, getProjectImageSrc } from '@/lib/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Props = { params: Promise<{ projectId: string }> };

export default async function Image({ params }: Props) {
    const { projectId } = await params;
    const project = projectsData[projectId];
    if (!project) notFound();

    const { serifFamily, sansFamily, fonts } = await loadOgFonts();
    const imageSrc = getProjectImageSrc(projectId);
    const isMobile = project.screenshotDevice === 'mobile';

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#18181b',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '72px 80px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Mobile only: name at top left */}
                {isMobile && (
                    <div style={{ color: '#fff7ed', fontSize: 36, fontFamily: sansFamily, opacity: 0.6 }}>
                        Jaxen Dutta
                    </div>
                )}

                {/* Title + subtitle */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        paddingBottom: 40,
                        gap: 14,
                        maxWidth: imageSrc ? (isMobile ? 700 : 520) : undefined,
                    }}
                >
                    <div
                        style={{
                            color: '#fff7ed',
                            fontSize: 80,
                            fontFamily: serifFamily,
                            fontStyle: 'italic',
                            fontWeight: 400,
                            lineHeight: 1.1,
                        }}
                    >
                        {`${project.label}.`}
                    </div>
                </div>

                {/* Full-width bottom bar */}
                <div style={{ width: '100%', height: 2, background: '#e11d48', marginBottom: 28 }} />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: isMobile ? 'flex-start' : 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {!isMobile && (
                        <div style={{ color: '#fff7ed', fontSize: 36, fontFamily: sansFamily, opacity: 0.6 }}>
                            Jaxen Dutta
                        </div>
                    )}
                    <div style={{ color: '#e11d48', fontSize: 28, fontFamily: sansFamily }}>
                        {`anirban.ca/projects/${projectId}`}
                    </div>
                </div>

                {/* Images rendered LAST — paint over the bottom bar (DOM order = paint order in Satori) */}

                {/* Mobile: full card height, portrait, right side */}
                {imageSrc && isMobile && (
                    <div
                        style={{
                            position: 'absolute',
                            display: 'flex',
                            right: 30,
                            top: 30,
                            width: 310,
                            height: 580,
                            overflow: 'visible',
                            transform: 'rotate(6deg)',
                        }}
                    >
                        <img
                            src={imageSrc}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                objectPosition: 'top center',
                                borderRadius: 24,
                            }}
                        />
                    </div>
                )}

                {/* Desktop: wide landscape, overflows right edge */}
                {imageSrc && !isMobile && (
                    <div
                        style={{
                            position: 'absolute',
                            display: 'flex',
                            left: 600,
                            top: 0,
                            width: 880,
                            height: 490,
                            overflow: 'hidden',
                            transform: 'rotate(-4deg)',
                        }}
                    >
                        <img
                            src={imageSrc}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'top center',
                                borderRadius: 20,
                                border: '2px solid white',
                            }}
                        />
                    </div>
                )}
            </div>
        ),
        { ...size, ...(fonts.length > 0 ? { fonts } : {}) }
    );
}
