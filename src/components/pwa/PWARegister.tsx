"use client";

import { useEffect } from "react";

export default function PWARegister() {
    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            "serviceWorker" in navigator &&
            process.env.NODE_ENV === "production"
        ) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log(
                        "[PWA] ServiceWorker registered with scope:",
                        registration.scope
                    );
                })
                .catch((error) => {
                    console.error("[PWA] ServiceWorker registration failed:", error);
                });
        }
    }, []);

    return null;
}
