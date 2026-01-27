// src/components/ui/DateTimePlace.tsx
"use client";

import { motion } from "framer-motion";
import { PiGlobeSimpleThin } from "react-icons/pi";
import { useState, useEffect } from "react";

export default function DateTimePlace() {
    const [currentTime, setCurrentTime] = useState("");

    // Update time every second
    useEffect(() => {
        const updateTime = () => {
            const estTime = new Date().toLocaleString("en-CA", {
                timeZone: "America/Toronto",
                hour12: false,
            });
            setCurrentTime(estTime);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`flex flex-row items-center justify-center gap-1 md:gap-1.5`}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 100,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                <PiGlobeSimpleThin className="text-xl md:text-3xl" />
            </motion.div>
            <div className="flex flex-col text-[8.5px] md:text-xs text-left leading-2.5 md:leading-4">
                <span>OTTAWA, ON</span>
                <span>{currentTime}</span>
            </div>
        </div>
    );
}
