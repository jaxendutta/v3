// src/components/sections/hero/HeroArt.tsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useEffect, useState } from "react";

function generateGreyNoiseDataURL(size = 256): string {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const v = Math.floor(
            (Math.random() * 0.5 + Math.random() * 0.3 + Math.random() * 0.2) * 300
        );
        data[i] = v; data[i + 1] = v; data[i + 2] = v; data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
}

function detectIOS(): boolean {
    return (
        /iPhone|iPad|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
}

// Sigil layout as normalised 0–1 fractions: converted to px at render time
const SIGIL_LAYOUT = [
    { nx: 0.12, ny: 0.18, r: 38, type: "eye", speed: 25, dir: 1 },
    { nx: 0.82, ny: 0.12, r: 30, type: "triangle", speed: 35, dir: -1 },
    { nx: 0.22, ny: 0.68, r: 34, type: "orbital", speed: 28, dir: 1 },
    { nx: 0.80, ny: 0.65, r: 36, type: "diamond", speed: 32, dir: -1 },
    { nx: 0.88, ny: 0.40, r: 24, type: "cross", speed: 40, dir: 1 },
    { nx: 0.06, ny: 0.45, r: 28, type: "eye", speed: 22, dir: -1 },
    { nx: 0.52, ny: 0.85, r: 32, type: "triangle", speed: 30, dir: 1 },
    { nx: 0.48, ny: 0.10, r: 22, type: "cross", speed: 38, dir: -1 },
] as const;

type SigilType = "eye" | "triangle" | "orbital" | "diamond" | "cross";

interface SigilProps {
    cx: number;
    cy: number;
    r: number;
    type: SigilType;
    speed: number;
    dir: number;
    color: string;
}

function SigilPaths({ r, type, color }: { r: number; type: SigilType; color: string }) {
    const s = { stroke: color, strokeWidth: 0.8, fill: "none", opacity: 0.4 };
    const d = { fill: color, opacity: 0.4 };

    switch (type) {
        case "eye":
            return (
                <>
                    <circle r={r} {...s} />
                    <circle r={r * 0.5} {...s} />
                    <circle r={r * 0.12} {...d} />
                    <line x1={-r} y1={0} x2={r} y2={0} {...s} />
                    <line x1={0} y1={-r} x2={0} y2={r} {...s} />
                    {[0, 90, 180, 270].map(a => {
                        const rad = a * Math.PI / 180;
                        return (
                            <line key={a}
                                x1={Math.cos(rad) * r * 0.75} y1={Math.sin(rad) * r * 0.75}
                                x2={Math.cos(rad) * r * 0.55} y2={Math.sin(rad) * r * 0.55}
                                {...s} strokeWidth={1.2}
                            />
                        );
                    })}
                </>
            );

        case "triangle": {
            const outer = [0, 1, 2].map(i => {
                const a = (i * 120 - 90) * Math.PI / 180;
                return `${Math.cos(a) * r},${Math.sin(a) * r}`;
            }).join(" ");
            const inner = [0, 1, 2].map(i => {
                const a = (i * 120 - 90) * Math.PI / 180;
                return `${Math.cos(a) * r * 0.45},${Math.sin(a) * r * 0.45}`;
            }).join(" ");
            return (
                <>
                    <polygon points={outer} {...s} />
                    <polygon points={inner} {...s} />
                    <circle r={r * 0.15} {...s} />
                    {[0, 1, 2].map(i => {
                        const a = (i * 120 - 90) * Math.PI / 180;
                        return (
                            <circle key={i}
                                cx={Math.cos(a) * r * 0.72}
                                cy={Math.sin(a) * r * 0.72}
                                r={r * 0.06} {...d}
                            />
                        );
                    })}
                </>
            );
        }

        case "orbital":
            return (
                <>
                    <circle r={r} {...s} />
                    <ellipse rx={r * 0.55} ry={r * 0.25} {...s} />
                    <ellipse rx={r * 0.55} ry={r * 0.25} transform="rotate(60)" {...s} />
                    <ellipse rx={r * 0.55} ry={r * 0.25} transform="rotate(120)" {...s} />
                    <circle r={r * 0.1} {...d} />
                </>
            );

        case "diamond": {
            const di = r * 0.72;
            return (
                <>
                    <polygon points={`0,${-r} ${r},0 0,${r} ${-r},0`} {...s} />
                    <polygon points={`0,${-di} ${di},0 0,${di} ${-di},0`} transform="rotate(45)" {...s} />
                    <circle r={r * 0.18} {...s} />
                    <circle r={r * 0.07} {...d} />
                </>
            );
        }

        case "cross": {
            const arm = r * 0.3;
            return (
                <>
                    <circle r={r} {...s} />
                    <rect x={-arm / 2} y={-r * 0.85} width={arm} height={r * 1.7} {...s} />
                    <rect x={-r * 0.85} y={-arm / 2} width={r * 1.7} height={arm} {...s} />
                    <circle r={r * 0.12} {...d} />
                    {[45, 135, 225, 315].map(a => (
                        <circle key={a}
                            cx={Math.cos(a * Math.PI / 180) * r * 0.7}
                            cy={Math.sin(a * Math.PI / 180) * r * 0.7}
                            r={r * 0.05} {...d}
                        />
                    ))}
                </>
            );
        }
    }
}

function Sigil({ cx, cy, r, type, speed, dir, color }: SigilProps) {
    return (
        // g at (cx, cy): all child paths drawn relative to (0,0)
        // rotation is applied around (0,0) of the inner g, which is the sigil centre
        <g transform={`translate(${cx}, ${cy})`}>
            <motion.g
                animate={{ rotate: [0, dir * 360] }}
                transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
                style={{ originX: 0, originY: 0 }}
            >
                <SigilPaths r={r} type={type} color={color} />
            </motion.g>
        </g>
    );
}

function IOSHeroArt({ isDark }: { isDark: boolean }) {
    const [dims, setDims] = useState({ w: 0, h: 0 });
    const color = isDark ? "#fff7ed" : "#1d4ed8";
    const bg = isDark ? "#18181b" : "#fff7ed";

    useEffect(() => {
        const update = () => setDims({ w: window.innerWidth, h: window.innerHeight });
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    if (dims.w === 0) return null;

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">

            {/* Grid */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, ${color} 1px, transparent 1px),
                        linear-gradient(to bottom, ${color} 1px, transparent 1px)
                    `,
                    backgroundSize: "20vw 20vw",
                    opacity: 0.06,
                }}
            />

            {/* Sigils: positioned with real px coords */}
            <svg
                width={dims.w}
                height={dims.h}
                className="absolute inset-0"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style={{ overflow: "visible" }}
            >
                {SIGIL_LAYOUT.map((s, i) => (
                    <Sigil
                        key={i}
                        cx={s.nx * dims.w}
                        cy={s.ny * dims.h}
                        r={s.r}
                        type={s.type}
                        speed={s.speed}
                        dir={s.dir}
                        color={color}
                    />
                ))}
            </svg>

            {/* Bottom fade: dissolves into background, no hard cutoff */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none"
                style={{
                    background: `linear-gradient(to bottom, transparent 0%, ${bg} 100%)`,
                }}
            />
        </div>
    );
}

export default function HeroArt() {
    const { theme } = useTheme();
    const [isFirefox, setIsFirefox] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [noiseUrl, setNoiseUrl] = useState<string>("");

    useEffect(() => {
        setIsFirefox(navigator.userAgent.toLowerCase().indexOf("firefox") > -1);
        setIsIOS(detectIOS());
        setNoiseUrl(generateGreyNoiseDataURL(256));
    }, []);

    const isDark = theme === "dark";

    if (isIOS) {
        return (
            <div className="w-full h-[100vh] overflow-visible relative">
                <IOSHeroArt isDark={isDark} />
            </div>
        );
    }

    if (!noiseUrl) return <div className="w-full h-[100vh]" />;

    const filterValue = isDark
        ? isFirefox
            ? "contrast(125%) brightness(400%) invert(100%)"
            : "contrast(145%) brightness(650%) invert(100%)"
        : isFirefox
            ? "contrast(100%) brightness(300%) invert(0%)"
            : "contrast(125%) brightness(400%) invert(0%)";

    return (
        <div className="w-full h-[100vh] overflow-visible relative">
            <motion.div
                className="absolute inset-0 z-[1] w-full h-full pointer-events-none bg-[size:20vh_20vh] opacity-20"
                animate={{ backgroundPosition: ["0px 0px", "100vh 0px"] }}
                transition={{
                    backgroundPosition: { duration: 20, repeat: Infinity, ease: "linear" },
                }}
                style={{
                    backgroundImage: `radial-gradient(circle at 0% 0%, ${isDark
                            ? "rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)"
                            : "rgb(0, 20, 90), rgba(255, 255, 0, 0)"
                        }), url("${noiseUrl}")`,
                    filter: filterValue,
                    mixBlendMode: isDark ? "color-dodge" : "multiply",
                }}
            />
        </div>
    );
}
