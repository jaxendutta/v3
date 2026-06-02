import { readFileSync } from 'fs';
import { join } from 'path';

// Old UA forces Google Fonts to return TTF instead of WOFF2 — Satori only supports TTF/OTF
const UA = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1';

function loadLocalFont(relativePath: string): ArrayBuffer | undefined {
    try {
        const buf = readFileSync(join(process.cwd(), relativePath));
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
    } catch {
        return undefined;
    }
}

async function fetchFont(family: string, variant: string): Promise<ArrayBuffer | undefined> {
    try {
        const css = await fetch(
            `https://fonts.googleapis.com/css2?family=${family}:${variant}`,
            { headers: { 'User-Agent': UA } }
        ).then((r) => r.text());
        const url = css.match(/src: url\(([^)]+)\) format\('truetype'\)/)?.[1];
        if (!url) return undefined;
        return fetch(url).then((r) => r.arrayBuffer());
    } catch {
        return undefined;
    }
}

export async function loadOgFonts() {
    const csDeviousFont = loadLocalFont('public/fonts/CSDevious/csdevious-regular.otf');
    const mignovaFont = loadLocalFont('public/fonts/Mignova.ttf');

    const [italicFont, regularFont, sansFont, codeFont] = await Promise.all([
        fetchFont('Libre+Baskerville', 'ital,wght@1,400'),
        fetchFont('Libre+Baskerville', 'wght@400'),
        fetchFont('Google+Sans+Flex', 'wght@400'),
        fetchFont('Google+Sans+Code', 'wght@400'),
    ]);

    const serifFamily = italicFont || regularFont ? 'LibreBaskerville' : 'serif';
    const sansFamily = sansFont ? 'GoogleSansFlex' : 'sans-serif';
    const codeFamily = codeFont ? 'GoogleSansCode' : 'monospace';
    const csDeviousFamily = csDeviousFont ? 'CSDevious' : sansFamily;
    const mignovaFamily = mignovaFont ? 'Mignova' : 'serif';
    const fonts = [];
    if (csDeviousFont) fonts.push({ name: 'CSDevious', data: csDeviousFont, style: 'normal' as const, weight: 400 as const });
    if (italicFont) fonts.push({ name: 'LibreBaskerville', data: italicFont, style: 'italic' as const, weight: 400 as const });
    if (regularFont) fonts.push({ name: 'LibreBaskerville', data: regularFont, style: 'normal' as const, weight: 400 as const });
    if (sansFont) fonts.push({ name: 'GoogleSansFlex', data: sansFont, style: 'normal' as const, weight: 400 as const });
    if (codeFont) fonts.push({ name: 'GoogleSansCode', data: codeFont, style: 'normal' as const, weight: 400 as const });
    if (mignovaFont) fonts.push({ name: 'Mignova', data: mignovaFont, style: 'normal' as const, weight: 400 as const });

    return { serifFamily, sansFamily, codeFamily, csDeviousFamily, mignovaFamily, fonts };
}

export function getFaviconSrc(): string | undefined {
    try {
        const buffer = readFileSync(join(process.cwd(), 'src/app/favicon.png'));
        return `data:image/png;base64,${buffer.toString('base64')}`;
    } catch {
        return undefined;
    }
}

export function getProjectImageSrc(projectId: string): string | undefined {
    try {
        const buffer = readFileSync(join(process.cwd(), 'public', `${projectId}.png`));
        return `data:image/png;base64,${buffer.toString('base64')}`;
    } catch {
        return undefined;
    }
}
