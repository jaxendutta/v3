"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { FontInfo } from "@/types/project";
import Link from "next/link";
import { makeRainbowWords } from "@/lib/rainbowWords";

interface TypographySpiralProps {
    id?: string;
    fonts: FontInfo[];
    isLandscape: boolean;
}

const SPIRAL_WORD_REPEATS = 20;

export default function TypographySpiral({ id, fonts, isLandscape }: TypographySpiralProps) {
    const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
    const [index, setIndex] = useState(0);
    const indexRef = useRef(0);
    // Which way the carousel last moved - lets the tumble enter from the
    // correct side: forward advances enter from below, backward advances
    // enter from above, mirroring the direction actually scrolled.
    const [direction, setDirection] = useState<1 | -1>(1);

    // Two-slot buffer for the background lettering: both slots stay mounted
    // (and keep animating) for the component's whole lifetime, so switching
    // fonts never restarts the flow - it just crossfades which slot's
    // font-family is visible.
    const [bgSlots, setBgSlots] = useState<[FontInfo, FontInfo]>(() => [fonts[0], fonts[0]]);
    const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
    const isFirstIndexEffect = useRef(true);

    const currentFont = fonts[index] ?? fonts[0];

    // One continuous flowing spiral in the background, same for both
    // orientations - the shape naturally hugs whatever the container's
    // actual width/height are, so it doesn't need to be orientation-aware.
    const spiralWords = useMemo(() => makeRainbowWords(26 * SPIRAL_WORD_REPEATS), []);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;
        const observer = new ResizeObserver((entries) => {
            if (!entries || entries.length === 0) return;
            const { width, height } = entries[0].contentRect;
            setDimensions((prev) =>
                prev.width === width && prev.height === height ? prev : { width, height }
            );
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    // Measure the text block itself so the cutout can hug it regardless of
    // how long a given font's name/description happen to be.
    useEffect(() => {
        const element = contentRef.current;
        if (!element) return;
        const observer = new ResizeObserver((entries) => {
            if (!entries || entries.length === 0) return;
            const { width, height } = entries[0].contentRect;
            setContentSize((prev) =>
                prev.width === width && prev.height === height ? prev : { width, height }
            );
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [index]);

    // Crossfade the background lettering to the new font whenever the index
    // changes (skip on first mount - both slots already agree).
    useEffect(() => {
        if (isFirstIndexEffect.current) {
            isFirstIndexEffect.current = false;
            return;
        }
        setBgSlots((prev) => {
            const next: [FontInfo, FontInfo] = [...prev];
            next[activeSlot === 0 ? 1 : 0] = currentFont;
            return next;
        });
        setActiveSlot((prev) => (prev === 0 ? 1 : 0));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    // One "slot" of scroll distance per font, along whichever axis the page
    // actually scrolls (width in landscape, height in portrait).
    const unitSize = isLandscape ? dimensions.width : dimensions.height;

    // The section is widened/heightened to fonts.length slots so there's
    // real scroll distance to move through, while the content below stays
    // visually pinned (position: sticky) inside it - so scrolling through it
    // feels like scrubbing, not like a separate widget stealing the wheel.
    // A hard flick covers proportionally more of that distance and blows
    // through several fonts, a gentle one nudges past just one - the same
    // relationship a normal scroll has to normal content.
    const snapPointsAttr = useMemo(() => {
        if (fonts.length <= 1 || !unitSize) return undefined;
        return JSON.stringify(Array.from({ length: fonts.length }, (_, i) => i * unitSize));
    }, [fonts.length, unitSize]);

    // Track which font is nearest purely from where the page has actually
    // scrolled to - no wheel listening, no gesture heuristics. The page's
    // own scroll animation (in ShowcaseLayout) already drives a smooth,
    // physically-real scroll position; this just reads it.
    useEffect(() => {
        const section = sectionRef.current;
        const mainEl = section?.closest("main") ?? null;
        if (!section || !mainEl || fonts.length <= 1 || !unitSize) return;

        let rafId: number | null = null;

        const computeIndex = () => {
            rafId = null;
            const base = isLandscape ? section.offsetLeft : section.offsetTop;
            const scrollPos = isLandscape ? mainEl.scrollLeft : mainEl.scrollTop;
            const raw = (scrollPos - base) / unitSize;
            const clamped = Math.max(0, Math.min(fonts.length - 1, raw));
            const nearest = Math.round(clamped);
            if (nearest !== indexRef.current) {
                setDirection(nearest > indexRef.current ? 1 : -1);
                indexRef.current = nearest;
                setIndex(nearest);
            }
        };

        const handleScroll = () => {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(computeIndex);
        };

        computeIndex();
        mainEl.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            mainEl.removeEventListener("scroll", handleScroll);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, [fonts.length, isLandscape, unitSize]);

    // Desktop background: the original continuous rounded-rectangle spiral -
    // one single connected path hugging the screen's edges, laps winding
    // inward, text flowing along the whole thing via native SVG text-on-
    // path. A large, fixed, generously-sized word list (520 words) - same
    // as it always was - comfortably covers it with no gaps.
    const { spiralPath, gap } = useMemo(() => {
        const { width: w, height: h } = dimensions;
        if (w === 0 || h === 0) return { spiralPath: "", gap: 0 };

        const mobileCheck = w < 768;
        const isTablet = w >= 768 && w < 1024;

        const calculatedGap = mobileCheck
            ? Math.max(28, Math.min(45, w * 0.08))
            : isTablet
                ? Math.max(40, Math.min(60, Math.min(w, h) * 0.08))
                : Math.max(50, Math.min(80, Math.min(w, h) * 0.1));

        const laps = mobileCheck ? 5 : isTablet ? 4 : 3;
        const r = calculatedGap * 0.4;

        let d = "";

        for (let i = 0; i < laps; i++) {
            let cx1 = calculatedGap / 2 + i * calculatedGap;
            let cy1 = calculatedGap / 2 + i * calculatedGap;
            let cx2 = w - calculatedGap / 2 - i * calculatedGap;
            let cy2 = h - calculatedGap / 2 - i * calculatedGap;

            if (cx1 + r >= cx2 || cy1 + r >= cy2) break;

            if (i === 0) d += `M ${cx1 + r} ${cy1} `;

            d += `L ${cx2 - r} ${cy1} `;
            d += `Q ${cx2} ${cy1}, ${cx2} ${cy1 + r} `;

            d += `L ${cx2} ${cy2 - r} `;
            d += `Q ${cx2} ${cy2}, ${cx2 - r} ${cy2} `;

            d += `L ${cx1 + r} ${cy2} `;
            d += `Q ${cx1} ${cy2}, ${cx1} ${cy2 - r} `;

            let ny1 = cy1 + calculatedGap;

            if (i === laps - 1 || cx1 + calculatedGap + r >= cx2 - calculatedGap || ny1 + r >= cy2 - calculatedGap) {
                d += `L ${cx1} ${cy1 + r} `;
                d += `Q ${cx1} ${cy1}, ${cx1 + r} ${cy1} `;
                break;
            } else {
                d += `L ${cx1} ${ny1 + r} `;
                d += `Q ${cx1} ${ny1}, ${cx1 + r} ${ny1} `;
            }
        }

        return { spiralPath: d, gap: calculatedGap };
    }, [dimensions]);

    // Distance from the viewport edge to where the text starts - the left
    // edge in landscape, the top edge in portrait. Small and fixed-ish (not
    // a big percentage) so the text sits flush against the edge. Shared by
    // the content overlay's padding and the cutout math so they stay in
    // lockstep.
    const edgeInset = useMemo(() => {
        const edgeDim = isLandscape ? dimensions.width : dimensions.height;
        if (!edgeDim) return 0;
        return Math.max(16, Math.min(28, edgeDim * 0.015));
    }, [dimensions, isLandscape]);

    // True half-oval cutout: a single elliptical arc from one end of the
    // flat edge to the other, closed by a straight line back (the "Z"). In
    // landscape the flat edge is vertical, on the screen's left, and the arc
    // bulges right. In portrait it's horizontal, on the screen's top, and
    // the arc bulges down.
    //
    // Sizing: of all ellipses centered on that edge whose far half still
    // contains the text's far corner (p, q), the smallest-area one has
    // (long radius) = p*sqrt(2), (short radius) = q*sqrt(2) (Lagrange
    // multipliers on minimizing their product subject to (p/a)^2+(q/b)^2=1).
    // Capped at 75% of the viewport along the bulge direction.
    //
    // No CSS transition on this path's `d` - animating SVG path data via
    // CSS transitions is a known weak spot on Safari, so it snaps instantly
    // instead of morphing.
    const cutout = useMemo(() => {
        const { width: w, height: h } = dimensions;
        const { width: cw, height: ch } = contentSize;
        if (!w || !h || !cw || !ch) return null;

        if (isLandscape) {
            const hPad = Math.max(12, Math.min(24, w * 0.012));
            const vPad = Math.max(10, Math.min(20, w * 0.01));

            const p = edgeInset + cw + hPad;
            const q = ch / 2 + vPad;

            let rx = p * Math.SQRT2;
            let ry = q * Math.SQRT2;

            const maxRx = w * 0.75;
            if (rx > maxRx) {
                rx = maxRx;
                const ratio = p / rx;
                ry = ratio < 1 ? q / Math.sqrt(1 - ratio * ratio) : q * 4;
            }

            return { axis: "x" as const, x0: 0, cy: h / 2, rx, ry };
        }

        const vPad = Math.max(12, Math.min(24, h * 0.012));
        const hPad = Math.max(10, Math.min(20, h * 0.01));

        const p = edgeInset + ch + vPad;
        const q = cw / 2 + hPad;

        let ry = p * Math.SQRT2;
        let rx = q * Math.SQRT2;

        const maxRy = h * 0.75;
        if (ry > maxRy) {
            ry = maxRy;
            const ratio = p / ry;
            rx = ratio < 1 ? q / Math.sqrt(1 - ratio * ratio) : q * 4;
        }

        return { axis: "y" as const, y0: 0, cx: w / 2, rx, ry };
    }, [dimensions, contentSize, edgeInset, isLandscape]);

    // Rotary-dial tumble: the incoming font travels up from way down near the
    // bottom-left corner of the section (not just a small nudge), landing
    // with a subtle spring settle - like a mechanical digit rolling into
    // place with just a hint of give on the stop, not a pronounced bounce.
    // The outgoing font rolls out, quick, no bounce, so it's out of the way
    // before the next one lands. Forward moves enter from below and exit up;
    // backward moves mirror that (enter from above, exit down) so reversing
    // through the carousel visually reverses instead of always coming from
    // the same side.
    const rotaryVariants: Variants = useMemo(() => {
        const travelY = Math.max(260, dimensions.height * 0.55);
        const sign = direction;
        return {
            enter: { x: -36, y: travelY * sign, opacity: 0, rotate: 10 * sign },
            center: {
                x: 0,
                y: 0,
                opacity: 1,
                rotate: 0,
                transition: { type: "spring", stiffness: 220, damping: 22, mass: 1 },
            },
            exit: {
                x: -12,
                y: -90 * sign,
                opacity: 0,
                rotate: -8 * sign,
                transition: { duration: 0.22, ease: "easeIn" },
            },
        };
    }, [dimensions.height, direction]);

    if (!fonts.length) return null;

    return (
        <section
            ref={sectionRef}
            id={id}
            data-snap-points={snapPointsAttr}
            className="relative shrink-0 w-screen h-full"
            style={
                fonts.length > 1
                    ? isLandscape
                        ? { width: `${fonts.length * 100}vw` }
                        : { height: `${fonts.length * 100}vh` }
                    : undefined
            }
        >
            {/* Pinned viewport-sized window: stays put while the section
                above scrolls its extra length past underneath it, exactly
                like a native CSS-sticky "pinned" section. */}
            <div
                ref={containerRef}
                className="bg-background overflow-hidden"
                style={{
                    position: "sticky",
                    left: isLandscape ? 0 : undefined,
                    top: !isLandscape ? 0 : undefined,
                    width: isLandscape ? "100vw" : "100%",
                    height: isLandscape ? "100%" : "calc(100vh - 120px)",
                }}
            >
                {dimensions.width > 0 && (
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        mask={cutout ? `url(#cutout-${uid})` : undefined}
                    >
                        <defs>
                            <path id={`spiral-${uid}`} d={spiralPath} fill="transparent" />
                            {cutout && (
                                <mask id={`cutout-${uid}`} maskUnits="userSpaceOnUse" x={0} y={0} width={dimensions.width} height={dimensions.height}>
                                    <rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill="white" />
                                    <path
                                        d={cutout.axis === "x"
                                            ? `M ${cutout.x0} ${cutout.cy - cutout.ry} A ${cutout.rx} ${cutout.ry} 0 0 1 ${cutout.x0} ${cutout.cy + cutout.ry} Z`
                                            : `M ${cutout.cx - cutout.rx} ${cutout.y0} A ${cutout.rx} ${cutout.ry} 0 0 0 ${cutout.cx + cutout.rx} ${cutout.y0} Z`}
                                        fill="black"
                                    />
                                </mask>
                            )}
                        </defs>

                        {([0, 1] as const).map((slot) => (
                            <text
                                key={slot}
                                fontSize={Math.max(26, gap * 0.85)}
                                fontWeight="bold"
                                className="tracking-widest"
                                style={{ fontFamily: bgSlots[slot].fontFamily, transition: "opacity 0.22s ease" }}
                                opacity={activeSlot === slot ? 1 : 0}
                                textRendering="optimizeSpeed"
                            >
                                <textPath href={`#spiral-${uid}`}>
                                    <animate
                                        attributeName="startOffset"
                                        values="0%; -100%; 0%"
                                        dur="240s"
                                        repeatCount="indefinite"
                                        calcMode="linear"
                                    />
                                    {spiralWords.map((word, i) => (
                                        <tspan key={i} fill={word.color} fillOpacity={0.55}>{word.text}</tspan>
                                    ))}
                                </textPath>
                            </text>
                        ))}
                    </svg>
                )}

                {/* Content Overlay, pinned to the left edge in landscape,
                    the top edge (centered) in portrait */}
                <div
                    className={`absolute inset-0 flex pointer-events-none ${isLandscape ? "items-center justify-start py-6" : "items-start justify-center px-6"}`}
                    style={isLandscape ? { paddingLeft: edgeInset || undefined } : { paddingTop: edgeInset || undefined }}
                >
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                            key={currentFont.name}
                            ref={(el) => {
                                if (el) contentRef.current = el;
                            }}
                            variants={rotaryVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className={`pointer-events-auto flex flex-col gap-4 md:gap-6 max-w-2xl ${isLandscape ? "items-start text-left" : "items-center text-center"}`}
                        >
                            <div className={`flex items-baseline gap-2 flex-wrap ${isLandscape ? "" : "justify-center"}`}>
                                {fonts.length > 1 && (
                                    <span className="font-sans text-xs md:text-sm text-muted-foreground/70 tracking-widest">
                                        [{index + 1}/{fonts.length}]
                                    </span>
                                )}
                                <div style={{ fontFamily: currentFont.fontFamily }}>
                                    {currentFont.url ? (
                                        <Link
                                            href={`https://fonts.google.com/specimen/${currentFont.name.replace(/\s+/g, '+')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-4xl md:text-6xl no-underline!"
                                        >
                                            {currentFont.name}
                                        </Link>
                                    ) : (
                                        <span className="text-4xl md:text-6xl">{currentFont.name}</span>
                                    )}
                                </div>
                            </div>
                            <p className={`text-xs md:text-base text-muted-foreground leading-relaxed max-w-xs md:max-w-lg ${isLandscape ? "text-left" : "text-center"}`}>
                                {currentFont.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
