import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function loadLibreBaskerville(italic: boolean): Promise<ArrayBuffer | undefined> {
    try {
        const variant = italic ? 'ital,wght@1,400' : 'wght@400';
        const css = await fetch(
            `https://fonts.googleapis.com/css2?family=Libre+Baskerville:${variant}`,
            { headers: { 'User-Agent': UA } }
        ).then((r) => r.text());
        const url = css.match(/src: url\(([^)]+)\) format\('woff2'\)/)?.[1];
        if (!url) return undefined;
        return fetch(url).then((r) => r.arrayBuffer());
    } catch {
        return undefined;
    }
}

export default async function Image() {
    const [italicFont, regularFont] = await Promise.all([
        loadLibreBaskerville(true),
        loadLibreBaskerville(false),
    ]);

    const fontFamily = italicFont || regularFont ? 'LibreBaskerville' : 'serif';
    const fonts = [];
    if (italicFont) fonts.push({ name: 'LibreBaskerville', data: italicFont, style: 'italic' as const, weight: 400 as const });
    if (regularFont) fonts.push({ name: 'LibreBaskerville', data: regularFont, style: 'normal' as const, weight: 400 as const });

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
                }}
            >
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
                            fontSize: 80,
                            fontFamily,
                            fontStyle: 'italic',
                            fontWeight: 400,
                            lineHeight: 1.1,
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
                            fontSize: 28,
                            fontFamily,
                            fontStyle: 'normal',
                            opacity: 0.6,
                        }}
                    >
                        Jaxen Dutta
                    </div>
                    <div
                        style={{
                            color: '#e11d48',
                            fontSize: 22,
                            fontFamily,
                            fontStyle: 'normal',
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
