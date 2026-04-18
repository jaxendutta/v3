#!/usr/bin/env node
/**
 * Watches src/data/papers for PDF files and mirrors them into public/papers/
 *
 * Directory mapping:
 *   src/data/papers/emma/thesis/out/emma.pdf  ->  public/papers/emma/thesis/emma.pdf
 *   src/data/papers/emma/acm/out/emma.pdf     ->  public/papers/emma/acm/emma.pdf
 */

import { watch } from "fs";
import {
    copyFileSync,
    mkdirSync,
    readdirSync,
    statSync,
    existsSync,
} from "fs";
import { join, relative, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PAPERS_ROOT = join(ROOT, "src", "data", "papers");
const PUBLIC_PAPERS = join(ROOT, "public", "papers");
const ONE_SHOT = process.argv.includes("--sync");

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Given the full path of a PDF inside a latex `out/` directory,
 * compute the destination path under public/papers/.
 *
 * src/data/latex/<project>/<format>/out/<file>.pdf
 *   →  public/papers/<project>/<format>/<file>.pdf
 *
 * Also handles the simple flat case:
 * src/data/latex/<project>/out/<file>.pdf
 *   →  public/papers/<project>/<file>.pdf
 */
function destPath(srcPdfPath) {
    const rel = relative(PAPERS_ROOT, srcPdfPath);
    const parts = rel.split(/[\\/]/);

    const outIdx = parts.indexOf("out");
    if (outIdx === -1) return null;

    const projectId = parts[0];                    // e.g. "emma"
    const formatKey = parts[outIdx - 1];           // e.g. "thesis", "acm"
    const newFilename = `${projectId}-${formatKey}.pdf`;  // e.g. "emma-thesis.pdf"

    return join(PUBLIC_PAPERS, projectId, newFilename);
}

function copyPdf(srcPath) {
    const dest = destPath(srcPath);
    if (!dest) return;

    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(srcPath, dest);

    const relSrc = relative(ROOT, srcPath);
    const relDest = relative(ROOT, dest);
    console.log(`  ✓  ${relSrc}  ->  ${relDest}`);
}

/**
 * Recursively find all *.pdf files inside `out/` subdirectories
 * under the given directory.
 */
function findAllPdfs(dir) {
    if (!existsSync(dir)) return [];
    const results = [];

    function walk(current) {
        let entries;
        try {
            entries = readdirSync(current);
        } catch {
            return;
        }

        for (const entry of entries) {
            const full = join(current, entry);
            let stat;
            try {
                stat = statSync(full);
            } catch {
                continue;
            }

            if (stat.isDirectory()) {
                walk(full);
            } else if (stat.isFile() && entry.endsWith(".pdf")) {
                // Use path.sep-agnostic check — split on both separators
                const parts = full.split(/[\\/]/);
                if (parts.includes("out")) {
                    results.push(full);
                }
            }
        }
    }

    walk(dir);
    return results;
}

// ─── One-shot sync ────────────────────────────────────────────────────────────

function syncAll() {
    console.log("> Syncing PDFs from latex -> public/papers …");
    const pdfs = findAllPdfs(PAPERS_ROOT);

    if (pdfs.length === 0) {
        console.log("> No PDFs found yet! Remember to compile your LaTeX first!");
        return;
    }

    for (const pdf of pdfs) {
        copyPdf(pdf);
    }

    console.log(`✓ Done! ${pdfs.length} file(s) synced.\n`);
}

// ─── Watch mode ───────────────────────────────────────────────────────────────

function startWatcher() {
    // Initial sync on startup
    syncAll();

    if (!existsSync(PAPERS_ROOT)) {
        mkdirSync(PAPERS_ROOT, { recursive: true });
    }

    console.log(`> Watching ${relative(ROOT, PAPERS_ROOT)} for PDF changes…\n`);

    // fs.watch is recursive on macOS/Windows; on Linux you may need chokidar
    // for deep recursion. For a solo-dev workflow this is fine.
    watch(PAPERS_ROOT, { recursive: true }, (eventType, filename) => {
        if (!filename || !filename.endsWith(".pdf")) return;
        if (!filename.includes("out")) return; // only care about compiled output

        const fullPath = join(PAPERS_ROOT, filename);

        // Small debounce — LaTeX writes the file in chunks
        setTimeout(() => {
            if (!existsSync(fullPath)) return; // file was deleted, ignore
            console.log(`\n> Detected change: ${filename}`);
            try {
                copyPdf(fullPath);
            } catch (err) {
                console.error(`  ✕ Failed to copy: ${err.message}`);
            }
        }, 300);
    });
}

// ─── Entry point ──────────────────────────────────────────────────────────────

if (ONE_SHOT) {
    syncAll();
} else {
    startWatcher();
}
