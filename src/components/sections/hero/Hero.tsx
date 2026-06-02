// src/components/sections/hero/Hero.tsx
'use client';

import { useEffect, useState } from "react";
import RotatingButton from "@/components/ui/RotatingButton";
import HeroArt from "@/components/sections/hero/HeroArt";
import HeroInteraction from "@/components/sections/hero/HeroInteraction";
import { GiJasmine, GiMaterialsScience, GiPlasticDuck, GiSquareBottle, GiUfo } from "react-icons/gi";
import { GiSnakeSpiral } from "react-icons/gi";

export default function Hero() {
    const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const smallest = Math.min(dims.w, dims.h);
    // Hide when aspect ratio is too close to square — at ~16:9 (1.75) the widest
    // word clears the button's horizontal position at left: 80%
    const showDesktopButton = dims.w / dims.h > 1.75;

    return (
        <section
            id="hero-container"
            className="relative w-screen min-h-screen overflow-hidden"
        >
            {/* Background noise art */}
            <HeroArt />

            {/* Content above HeroArt */}
            <div className="absolute text-center inset-0 w-full h-full flex justify-center items-center z-30 pointer-events-none">
                {/* Interactive name */}
                <div className="pointer-events-auto w-full">
                    <HeroInteraction />
                </div>
            </div>

            {/* Mobile Rotating Button */}
            <div className="md:hidden absolute right-[10%] bottom-[15%] z-40 pointer-events-auto">
                <RotatingButton
                    texts={["PROJECTS", "WORK", "RÉSUMÉ", "CONTACT"]}
                    href="#projects"
                    centerIcon={GiSquareBottle}
                />
            </div>

            {/* Desktop Rotating Button */}
            <div
                className="hidden lg:block absolute z-40 pointer-events-auto"
                style={{ top: '75%', left: '80%', transform: 'translate(-50%, -50%)', visibility: showDesktopButton ? 'visible' : 'hidden' }}
            >
                <RotatingButton
                    texts={["PROJECTS", "WORK", "RÉSUMÉ", "CONTACT"]}
                    href="#projects"
                    centerIcon={GiMaterialsScience}
                    size={smallest * 0.15}
                    fontSize={Math.pow(smallest, 0.45) * 0.625}
                />
            </div>
        </section>
    );
}
