import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.gifer.com",
            },
            {
                protocol: "https",
                hostname: "media.giphy.com",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "2mb",
            allowedOrigins: ["*"],
        },
    },
    async headers() {
        return [
            {
                source: "/:all*(svg|jpg|png|webp|avif|woff2|woff)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: "/_next/static/:path*",
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
