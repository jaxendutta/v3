// src/components/sections/HeroSection.tsx
"use client";

import RotatingButton from "@/components/ui/RotatingButton";
import NightSky from "@/components/ui/NightSky";
import { displayFont } from "@/lib/fonts";
import { GiMaterialsScience } from "react-icons/gi";

export default function Hero() {
    return (
        <section
            id="hero-container"
            className="w-full min-h-[500px] h-screen relative"
        >
            {/* Moon + Noise */}
            <NightSky />

            {/* Main intro content */}
            <div className="absolute text-center top-[15vh] w-screen h-screen flex flex-col justify-center items-center gap-[5vh]">
                <div
                    className={`text-7xl md:text-9xl italic px-4 clip-text ${displayFont}`}
                >
                    <em>{`¿ JAXEN DUTTA ?`}</em>
                </div>

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
