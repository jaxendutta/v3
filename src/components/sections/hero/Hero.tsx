// src/components/sections/hero/Hero.tsx
"use client";

import RotatingButton from "@/components/ui/RotatingButton";
import HeroArt from "@/components/sections/hero/HeroArt";
import HeroInteraction from "@/components/sections/hero/HeroInteraction";
import { GiMaterialsScience } from "react-icons/gi";

export default function Hero() {
    return (
        <section
            id="hero-container"
            className="relative w-full min-h-screen"
        >
            {/* Background noise art */}
            <HeroArt />

            {/* Content above HeroArt */}
            <div className="absolute text-center top-[10vh] w-screen h-screen flex flex-col justify-center items-center gap-[5vh] z-30">

                {/* Interactive name */}
                <HeroInteraction />

                <div className="w-2/3 flex justify-end">
                    <RotatingButton
                        texts={["PROJECTS", "WORK", "RÉSUMÉ", "CONTACT"]}
                        delimiters={["✦"]}
                        href="#projects"
                        centerIcon={GiMaterialsScience}
                    />
                </div>
            </div>
        </section>
    );
}
