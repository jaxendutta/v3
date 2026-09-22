import type { NextConfig } from "next";
import fs from "fs";
import path from "path";
import os from "os";

// Parse .env.local into process.env if present
function loadLocalEnv() {
    try {
        const envPath = path.resolve(process.cwd(), ".env.local");
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, "utf-8");
            for (const line of content.split("\n")) {
                const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
                if (match) {
                    const key = match[1];
                    let value = (match[2] || "").trim();
                    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                    process.env[key] = value;
                }
            }
        }
    } catch {}
}
loadLocalEnv();

// Automatically detect all active local network IPv4 addresses (e.g. 192.168.x.x)
// so that local device testing (e.g. iPhone on Wi-Fi) works seamlessly
// without needing to hardcode or commit personal IP addresses to Git.
function getLocalNetworkOrigins(): string[] {
    const interfaces = os.networkInterfaces();
    const origins: string[] = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
            if (iface.family === "IPv4" && !iface.internal) {
                origins.push(iface.address);
                origins.push(`${iface.address}:3000`);
            }
        }
    }
    return origins;
}

// Also parse custom origins from .env.local if provided (LOCAL_IP, ALLOWED_DEV_ORIGINS)
const customOrigins = (
    process.env.ALLOWED_DEV_ORIGINS ||
    process.env.LOCAL_IP ||
    process.env.DEV_IP ||
    ""
)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const parsedDevOrigins = customOrigins.flatMap((origin) => {
    const clean = origin.replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (!clean) return [];
    if (clean.includes(":")) {
        return [clean];
    }
    return [clean, `${clean}:3000`];
});

const autoDetectedOrigins = getLocalNetworkOrigins();

const nextConfig: NextConfig = {
    reactStrictMode: true,
    reactCompiler: false,
    images: {
        formats: ["image/avif", "image/webp"],
    },
    allowedDevOrigins: [
        "tipless-melida-pardonably.ngrok-free.dev",
        ...autoDetectedOrigins,
        ...parsedDevOrigins,
    ],
    experimental: {
        serverActions: {
            bodySizeLimit: "2mb", // Keep this if larger uploads are needed
        },
    },
    async headers() {
        // Return empty headers in development so the browser always asks for the latest code
        if (process.env.NODE_ENV === "development") {
            return [];
        }

        return [
            {
                source: "/:all*(svg|jpg|jpeg|png|webp|avif|woff2|woff|gif|pdf)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
