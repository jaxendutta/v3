import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Old UA forces Google Fonts to return TTF instead of WOFF2 — Satori only supports TTF/OTF
const UA = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1';

async function loadLibreBaskerville(italic: boolean): Promise<ArrayBuffer | undefined> {
    try {
        const variant = italic ? 'ital,wght@1,400' : 'wght@400';
        const css = await fetch(
            `https://fonts.googleapis.com/css2?family=Libre+Baskerville:${variant}`,
            { headers: { 'User-Agent': UA } }
        ).then((r) => r.text());
        const url = css.match(/src: url\(([^)]+)\) format\('truetype'\)/)?.[1];
        if (!url) return undefined;
        return fetch(url).then((r) => r.arrayBuffer());
    } catch {
        return undefined;
    }
}

async function loadGoogleSansFlex(): Promise<ArrayBuffer | undefined> {
    try {
        const css = await fetch(
            'https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400',
            { headers: { 'User-Agent': UA } }
        ).then((r) => r.text());
        const url = css.match(/src: url\(([^)]+)\) format\('truetype'\)/)?.[1];
        if (!url) return undefined;
        return fetch(url).then((r) => r.arrayBuffer());
    } catch {
        return undefined;
    }
}

export default async function Image() {
    const [italicFont, regularFont, sansFont] = await Promise.all([
        loadLibreBaskerville(true),
        loadLibreBaskerville(false),
        loadGoogleSansFlex(),
    ]);

    const serifFamily = italicFont || regularFont ? 'LibreBaskerville' : 'serif';
    const sansFamily = sansFont ? 'GoogleSansFlex' : 'sans-serif';
    const fonts = [];
    if (italicFont) fonts.push({ name: 'LibreBaskerville', data: italicFont, style: 'italic' as const, weight: 400 as const });
    if (regularFont) fonts.push({ name: 'LibreBaskerville', data: regularFont, style: 'normal' as const, weight: 400 as const });
    if (sansFont) fonts.push({ name: 'GoogleSansFlex', data: sansFont, style: 'normal' as const, weight: 400 as const });

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
                            fontSize: 120,
                            fontFamily: serifFamily,
                            fontStyle: 'italic',
                            fontWeight: 400,
                            lineHeight: 1.1,
                        }}
                    >
                        Projects.
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
                            fontFamily: sansFamily,
                            opacity: 0.6,
                        }}
                    >
                        Jaxen Dutta
                    </div>
                    <div
                        style={{
                            color: '#e11d48',
                            fontSize: 42,
                            fontFamily: sansFamily,
                        }}
                    >
                        anirban.ca/projects
                    </div>
                </div>
            </div>
        ),
        { ...size, ...(fonts.length > 0 ? { fonts } : {}) }
    );
}
