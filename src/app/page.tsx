// src/app/page.tsx

import { Suspense } from "react";
import ContactSection from "@/components/sections/contact/ContactSection";
import Hero from "@/components/sections/hero/Hero";
import ProjectsSection from "@/components/sections/project/ProjectsSection";
import WorkSection from "@/components/sections/work/WorkSection";
import PapersSection from "@/components/sections/papers/PapersSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

function SectionFallback({ label }: { label: string }) {
    return (
        <div className="w-full h-[50vh] flex items-center justify-center text-muted-foreground font-mono text-sm">
            Loading {label}…
        </div>
    );
}

export default function Home() {
    return (
        <div className="max-w-screen min-h-screen">
            <Navbar />
            <main className="flex flex-col items-center justify-center">
                <Hero />

                <Suspense fallback={<SectionFallback label="projects" />}>
                    <ProjectsSection />
                </Suspense>

                <Suspense fallback={<SectionFallback label="work experience" />}>
                    <WorkSection />
                </Suspense>

                <Suspense fallback={<SectionFallback label="papers" />}>
                    <PapersSection limit={3} showLink={true} />
                </Suspense>

                <ContactSection />
                <Footer />
            </main>
        </div>
    );
}