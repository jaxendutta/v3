"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Automatically handle ChunkLoadError after new deployments
        const errorMessage = error?.message || "";
        const isChunkError =
            errorMessage.includes("ChunkLoadError") ||
            errorMessage.includes("Failed to fetch dynamically imported module") ||
            errorMessage.includes("Loading chunk");

        if (isChunkError && typeof window !== "undefined") {
            const lastReload = sessionStorage.getItem("chunk_reload_attempt");
            const now = Date.now();
            // Prevent infinite reload loop by checking last reload was not within 10 seconds
            if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
                sessionStorage.setItem("chunk_reload_attempt", now.toString());
                window.location.reload();
            }
        }
    }, [error]);

    return (
        <html lang="en">
            <body className="bg-[#0a0a0c] text-[#f4f4f5] antialiased m-0 p-0 font-sans flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
                    <div className="w-12 h-12 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-6 text-rose-500">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight mb-2">
                        Unable to load page
                    </h1>
                    <p className="text-sm text-[#a1a1aa] mb-8 leading-relaxed">
                        A temporary client transition error occurred. Reloading the page will pull the latest version.
                    </p>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                if (typeof window !== "undefined") {
                                    window.location.reload();
                                } else {
                                    reset();
                                }
                            }}
                            className="px-5 py-2.5 rounded-full bg-[#f4f4f5] text-[#09090b] font-medium text-sm hover:bg-white transition-colors cursor-pointer"
                        >
                            Reload Page
                        </button>
                        <a
                            href="/"
                            className="px-5 py-2.5 rounded-full bg-[#18181b] text-[#f4f4f5] border border-[#27272a] font-medium text-sm hover:bg-[#27272a] transition-colors"
                        >
                            Back Home
                        </a>
                    </div>
                </div>
            </body>
        </html>
    );
}
