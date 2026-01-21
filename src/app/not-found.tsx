// src/app/not-found.tsx
"use client";

import Footer from "@/components/layout/Footer";
import RotatingButton from "@/components/ui/RotatingButton";
import { GiParanoia } from "react-icons/gi";
import SectionHeader from "@/components/ui/SectionHeader";

export default function NotFound() {
    return (
        <div className="max-w-screen min-h-screen overflow-clip">
            <SectionHeader title="404" />

            <main className="flex flex-col items-center justify-center gap-8">
                <div className="text-4xl md:text-6xl">Page Not Found</div>

                <div className="text-lg md:text-xl max-w-md">
                    Let&apos;s get you back home.
                </div>

                <RotatingButton
                    href="/"
                    texts={["Back to", "Home", "Shelter", "Safety"]}
                    size={120}
                    centerIcon={GiParanoia}
                />
                <Footer />
            </main>

            <SectionHeader title="404" />
        </div>
    );
}
