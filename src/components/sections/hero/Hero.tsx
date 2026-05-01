// src/components/sections/hero/Hero.tsx
'use client';

import { useEffect, useState } from "react";
import RotatingButton from "@/components/ui/RotatingButton";
import HeroArt from "@/components/sections/hero/HeroArt";
import HeroInteraction from "@/components/sections/hero/HeroInteraction";
import { GiMaterialsScience } from "react-icons/gi";

export default function Hero() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            <div className="md:hidden absolute right-[5%] bottom-[15%] z-40 pointer-events-auto">
                <RotatingButton
                    texts={["PROJECTS", "WORK", "RÉSUMÉ", "CONTACT"]}
                    delimiters={["✦"]}
                    href="#projects"
                    centerIcon={GiMaterialsScience}
                />
            </div>

            {/* Desktop Rotating Button */}
            <div
                className="hidden md:block absolute z-40 pointer-events-auto"
                style={{ top: '75%', left: '75%', transform: 'translate(-50%, -50%)' }}
            >
                <RotatingButton
                    texts={["PROJECTS", "WORK", "RÉSUMÉ", "CONTACT"]}
                    href="#projects"
                    centerIcon={GiMaterialsScience}
                    size={width * 0.15}
                    fontSize={Math.pow(width, 0.45) * 0.625}
                />
            </div>
        </section>
    );
}
