import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadMajorMono(): Promise<ArrayBuffer | undefined> {
    try {
        const css = await fetch(
            'https://fonts.googleapis.com/css2?family=Major+Mono+Display'
        ).then((r) => r.text());
        const url = css.match(/src: url\(([^)]+)\) format\('woff2'\)/)?.[1];
        if (!url) return undefined;
        return fetch(url).then((r) => r.arrayBuffer());
    } catch {
        return undefined;
    }
}

export default async function Image() {
    const fontData = await loadMajorMono();
    const fontFamily = fontData ? 'MajorMono' : 'serif';

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
                            fontWeight: 400,
                            lineHeight: 1.1,
                        }}
                    >
                        papers &{'\n'}written records.
                    </div>
                </div>
                <div
                    style={{
                        width: '100%',
                        height: 2,
                        background: '#e11d48',
                        marginBottom: 28,
                    }}
                />
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
                            opacity: 0.6,
                        }}
                    >
                        jaxen dutta
                    </div>
                    <div
                        style={{
                            color: '#e11d48',
                            fontSize: 22,
                            fontFamily,
                        }}
                    >
                        anirban.ca/papers
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            ...(fontData
                ? {
                      fonts: [
                          {
                              name: 'MajorMono',
                              data: fontData,
                              style: 'normal' as const,
                              weight: 400 as const,
                          },
                      ],
                  }
                : {}),
        }
    );
}
