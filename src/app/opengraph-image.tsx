import { ImageResponse } from 'next/og';
import { GiSquareBottle } from 'react-icons/gi';
import { loadOgFonts } from '@/lib/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    const { sansFamily, codeFamily, mignovaFamily, fonts } = await loadOgFonts();

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
                    padding: '60px 80px',
                    position: 'relative',
                }}
            >
                <GiSquareBottle
                    style={{ position: 'absolute', top: 100, right: 100, color: '#fff7ed' }}
                    size={180}
                />
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        paddingBottom: '40px',
                    }}
                >
                    <div
                        style={{
                            color: '#fff7ed',
                            fontSize: 180,
                            fontFamily: mignovaFamily,
                            fontWeight: 400,
                            lineHeight: 1.1,
                        }}
                    >
                        Jaxen Dutta
                    </div>
                </div>
                
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
                            fontSize: 36,
                            fontFamily: sansFamily,
                            opacity: 0.5,
                        }}
                    >
                        UX/UI Engineer · Researcher · Web Designer
                    </div>
                    <div
                        style={{
                            color: '#e11d48',
                            fontSize: 36,
                            fontFamily: codeFamily,
                        }}
                    >
                        anirban.ca
                    </div>
                </div>
            </div>
        ),
        { ...size, ...(fonts.length > 0 ? { fonts } : {}) }
    );
}
