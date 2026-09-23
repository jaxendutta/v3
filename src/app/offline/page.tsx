"use client";

import Link from "next/link";
import { HiOutlineWifi, HiOutlineArrowPath } from "react-icons/hi2";

export default function OfflinePage() {
    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-center">
            <div className="flex flex-col items-center max-w-md gap-6">
                <div className="p-4 rounded-full border border-border bg-card/60 backdrop-blur-sm">
                    <HiOutlineWifi className="w-12 h-12 text-primary animate-pulse" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-mono tracking-tight text-foreground font-bold">
                        OFFLINE
                    </h1>
                    <p className="text-sm font-mono text-muted-foreground">
                        You appear to be disconnected from the internet. Previously cached pages and project details remain available.
                    </p>
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-none text-xs font-mono tracking-wider hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                    >
                        <HiOutlineArrowPath className="w-4 h-4" />
                        RETRY CONNECTION
                    </button>
                    <Link
                        href="/"
                        className="px-4 py-2 border border-border rounded-none text-xs font-mono tracking-wider hover:bg-foreground hover:text-background transition-colors"
                    >
                        RETURN HOME
                    </Link>
                </div>
            </div>
        </main>
    );
}
