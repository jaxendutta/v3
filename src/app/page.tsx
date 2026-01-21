// src/app/page.tsx

import { Suspense } from "react";
import ContactSection from "@/components/sections/contact/ContactSection";
import Hero from "@/components/layout/Hero";
import ProjectsSection from "@/components/sections/project/ProjectsSection";
import WorkSection from "@/components/sections/work/WorkSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
    return (
        <div className="max-w-screen min-h-screen">
            <Navbar />
            <main className="flex flex-col items-center justify-center relative">
                <Hero />
                <Suspense
                    fallback={
                        <div className="w-full h-[50vh] flex items-center justify-center">
                            Loading projects...
                        </div>
                    }
                >
                    <ProjectsSection />
                </Suspense>
                <Suspense
                    fallback={
                        <div className="w-full h-[50vh] flex items-center justify-center">
                            Loading work experience...
                        </div>
                    }
                >
                    <WorkSection />
                </Suspense>
                <ContactSection />
                <Footer />
            </main>
        </div>
    );
}
