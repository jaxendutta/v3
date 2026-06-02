import { ImageResponse } from 'next/og';
import { GiSquareBottle } from 'react-icons/gi';
import { loadOgFonts } from '@/lib/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    const { serifFamily, sansFamily, codeFamily, fonts } = await loadOgFonts();

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#18181b',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '72px 80px',
                    position: 'relative',
                }}
            >
                <GiSquareBottle
                    style={{ position: 'absolute', top: 72, right: 80, color: '#fff7ed' }}
                    size={180}
                />
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'flex-end',
                        paddingBottom: '40px',
                    }}
                >
                    <div
                        style={{
                            color: '#fff7ed',
                            fontSize: 100,
                            fontFamily: serifFamily,
                            fontStyle: 'italic',
                            fontWeight: 400,
                            lineHeight: 1.4,
                            whiteSpace: 'pre-line',
                        }}
                    >
                        {"Papers &\nWritten Records."}
                    </div>
                </div>
                <div style={{ width: '100%', height: 2, background: '#e11d48', marginBottom: 28 }} />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            color: '#fff7ed',
                            fontSize: 54,
                            fontFamily: codeFamily,
                            opacity: 0.6,
                        }}
                    >
                        Jaxen Dutta
                    </div>
                    <div
                        style={{
                            color: '#e11d48',
                            fontSize: 42,
                            fontFamily: codeFamily,
                        }}
                    >
                        anirban.ca/papers
                    </div>
                </div>
            </div>
        ),
        { ...size, ...(fonts.length > 0 ? { fonts } : {}) }
    );
}
