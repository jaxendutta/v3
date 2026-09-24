import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { majorMono, googleSansCode } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import BottomBar from "@/components/layout/BottomBar";
import BrowserThemeColor from "@/components/pwa/BrowserThemeColor";
import PWARegister from "@/components/pwa/PWARegister";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    viewportFit: "cover",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fff7ed" },
        { media: "(prefers-color-scheme: dark)", color: "#18181b" },
    ],
};

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
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Jaxen Dutta",
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon.png", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
            { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
            { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },
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
            data-scroll-behavior="smooth"
            className={`${majorMono.className} ${googleSansCode.className}`}
        >
            <head>
                <meta charSet="utf-8" />
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
            <body className="min-h-dvh w-full cursor-crosshair">
                {/*
                    A real fixed-position element, not a `background-attachment: fixed`
                    trick — that CSS property is notoriously unreliable in iOS Safari's
                    browser-tab mode (it only behaves in standalone/PWA mode, where the
                    dynamic toolbar doesn't resize the viewport). Actual `position: fixed`
                    elements are handled correctly in both, the same way RotatingButton's
                    pills already are. One layer, mounted once, identical on every route.
                */}
                <div
                    className="fixed inset-0 -z-10 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 50% 0%, var(--secondary) 0%, var(--background) 60%)",
                    }}
                    aria-hidden="true"
                />
                <Analytics />
                <ThemeProvider>
                    <BrowserThemeColor />
                    <PWARegister />
                    <BottomBar />
                    <div className="max-w-[2048px] mx-auto w-full">
                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
