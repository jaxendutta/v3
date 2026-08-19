import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    reactCompiler: false,
    images: {
        formats: ["image/avif", "image/webp"],
    },
    allowedDevOrigins: ["tipless-melida-pardonably.ngrok-free.dev"],
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
                source: "/:all*(svg|jpg|png|webp|avif|woff2|woff)",
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
