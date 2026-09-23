import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Jaxen Dutta ✧ Portfolio",
        short_name: "Jaxen Dutta",
        description:
            "UX/UI Engineer, HCI Researcher, Web Designer, and App Developer portfolio showcasing innovative digital creations and technical expertise.",
        start_url: "/",
        display: "standalone",
        background_color: "#18181b",
        theme_color: "#18181b",
        orientation: "portrait-primary",
        categories: ["portfolio", "design", "development", "technology", "research"],
        icons: [
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icon-maskable-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
    };
}
