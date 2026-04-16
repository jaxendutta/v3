import "@/styles/globals.css";
import type { Metadata } from "next";
import { majorMono, googleSansCode } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import BottomBar from "@/components/layout/BottomBar";

export const metadata: Metadata = {
    metadataBase: new URL('https://anirban.ca'),
    title: {
        default: "Jaxen Dutta",
        template: "%s ✧ Jaxen Dutta",
    },
    description:
        "Personal portfolio website for Anirban (Jaxen) Dutta - UX/UI Engineer, HCI Researcher, Web Designer, App Developer",
    keywords: [
        "UX/UI",
        "Web Design",
        "App Development",
        "Portfolio",
        "Jaxen Dutta",
        "Anirban Dutta",
    ],
    authors: [{ name: "Jaxen Dutta" }],
    creator: "Jaxen Dutta",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://anirban.ca",
        title: "Jaxen Dutta",
        description:
            "UX/UI Engineer, HCI Researcher, Web Designer, and App Developer portfolio showcasing innovative digital creations and technical expertise.",
        siteName: "Jaxen Dutta ✧ Portfolio",
        // Adding a transparent pixel prevents the crawler from scraping your project images
        images: [
            {
                url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
                width: 1,
                height: 1,
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "Jaxen Dutta ✧ Portfolio",
        description: "UX/UI Engineer, HCI Researcher, Web Designer, and App Developer",
    }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${majorMono.className} ${googleSansCode.className}`}
        >
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
                />
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/favicon.png" type="image/png" />

                {/* Preconnect for external resources */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link rel="preconnect" href="https://i.gifer.com" />

                {/* Preload LCP image background */}
                <link
                    rel="preload"
                    href="https://i.gifer.com/ByRk.gif"
                    as="image"
                    fetchPriority="high"
                />
            </head>
            <body className="min-h-[100dvh] w-full cursor-crosshair">
                <Analytics />
                <ThemeProvider>
                    <BottomBar />
                    <div className="max-w-[2048px] mx-auto w-full">
                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
