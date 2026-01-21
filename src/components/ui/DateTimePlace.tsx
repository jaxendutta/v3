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
        <div className={`flex flex-row items-center justify-center gap-2`}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 100,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                <PiGlobeSimpleThin className="text-3xl" />
            </motion.div>
            <div className="flex flex-col text-xs text-left">
                <span>WATERLOO, ON</span>
                <span>{currentTime}</span>
            </div>
        </div>
    );
}
