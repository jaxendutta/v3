// src/components/sections/hero/HeroArt.tsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useEffect, useState } from "react";

// The SVG noise to base64 encoded instead of percent-encoded.
// iOS WebKit silently fails to render SVG feTurbulence when the data URL uses percent-encoding (%3Csvg...).
const NOISE_SVG_BASE64 =
    "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDAwIDQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZUZpbHRlcikiLz48L3N2Zz4=";

export default function HeroArt() {
    const { theme } = useTheme();
    const [isFirefox, setIsFirefox] = useState(false);

    useEffect(() => {
        setIsFirefox(navigator.userAgent.toLowerCase().indexOf("firefox") > -1);
    }, []);

    const getFilterValue = () => {
        if (theme === "dark") {
            return isFirefox
                ? "contrast(125%) brightness(400%) invert(100%)"
                : "contrast(145%) brightness(650%) invert(100%)";
        } else {
            return isFirefox
                ? "contrast(100%) brightness(300%) invert(0%)"
                : "contrast(125%) brightness(400%) invert(0%)";
        }
    };

    return (
        <div className="w-full h-[100vh] overflow-visible relative">
            <motion.div
                className="absolute inset-0 z-[1] w-full h-full pointer-events-none bg-[size:20vh_20vh] opacity-30"
                animate={{
                    backgroundPosition: ["0px 0px", "100vh 0px"]
                }}
                transition={{
                    backgroundPosition: { duration: 20, repeat: Infinity, ease: "linear" }
                }}
                style={{
                    backgroundImage: `radial-gradient(circle at 0% 0%, 
                                ${theme === "dark" ? "rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)" : "rgb(0, 20, 90), rgba(255, 255, 0, 0)"}),
                                url("${NOISE_SVG_BASE64}")`,
                    filter: getFilterValue(),
                    mixBlendMode: theme === "dark" ? "color-dodge" : "multiply",
                }}
            />
        </div>
    );
}
