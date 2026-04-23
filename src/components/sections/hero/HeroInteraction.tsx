// src/components/sections/hero/HeroInteraction.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";
import { sansFont } from "@/lib/fonts";

/**
 * Glyph Typewriter
 *
 * Name is rendered letter by letter.
 * Each letter has a constructed sigil character from a cybersigilism alphabet 
 * built from unicode math, alchemical, and geometric symbols.
 *
 * IDLE: Letters randomly and slowly bleed into their true form
 * for a flash, then snap back. Barely perceptible, like something
 * is leaking through. One letter at a time, staggered.
 *
 * INTERACTION:
 *  - Desktop: hover a letter > it rapidly cycles through its entire
 *    glyph sequence before slamming back to the real letter
 *  - Mobile: tap a letter > same effect, plus neighbouring letters
 *    get sympathetic micro-bleeds (the disturbance spreads)
 *
 * The effect uses two layers per letter:
 *  1. The real character (always present)
 *  2. The glyph overlay (animates in/out on top)
 */

// Cybersigilism character map
// Each letter maps to a sequence of increasingly "corrupted" forms, climaxing at the true sigil form.
// Built from unicode: alchemical, math, runic, geometric, APL symbols.
const GLYPH_MAP: Record<string, string[]> = {
    // Each array goes from "slightly off" → "fully corrupted" → "true form"
    J: ["ʝ", "ɟ", "ϳ", "⌡", "⎩", "ꓤ", "𐌹", "⟙"],
    a: ["α", "ą", "ɑ", "∂", "ꞵ", "⍺", "ᚨ", "⌀"],
    x: ["×", "χ", "ж", "⊗", "✕", "⌖", "᛭", "⍼"],
    e: ["ε", "ə", "ɛ", "∃", "ϵ", "ℯ", "ᚱ", "⋿"],
    n: ["η", "ñ", "ŋ", "∩", "⋂", "ℵ", "ᚾ", "⌁"],
    A: ["Λ", "Δ", "Α", "∀", "⋀", "⌂", "ᚨ", "⍋"],
    i: ["ι", "ɨ", "ï", "∣", "⌊", "ꟾ", "ᛁ", "⎸"],
    r: ["ρ", "ɾ", "ᴦ", "℞", "⌐", "ꝛ", "ᚱ", "⌣"],
    b: ["β", "ƀ", "ϐ", "♭", "⌬", "Ƀ", "ᛒ", "⍭"],
    D: ["Δ", "Ð", "∇", "⊡", "◈", "⌖", "ᛞ", "⎔"],
    u: ["υ", "ü", "ų", "∪", "⋃", "ꞹ", "ᚢ", "⌣"],
    t: ["τ", "ŧ", "ƭ", "†", "⊤", "⌶", "ᛏ", "⍊"],
    ".": ["·", "•", "◦", "⊙", "◉", "⌾", "⊛", "⍟"],
};

// Fallback for any character not in the map
const FALLBACK_GLYPHS = ["◌", "◍", "◎", "●", "◉", "⊙", "⌾", "⍟"];

function getGlyphs(char: string): string[] {
    return GLYPH_MAP[char] ?? FALLBACK_GLYPHS;
}

interface LetterState {
    char: string;
    glyphIndex: number;      // -1 = showing real char, 0+ = showing glyph
    isActive: boolean;       // hover/tap triggered
    idleBleeding: boolean;   // idle micro-bleed
}

// Names split into words, each word into letters
const NAME_WORDS = ["Jaxen", "Anirban", "Dutta."];

// Flat index across all letters
function buildLetterStates(): LetterState[] {
    return NAME_WORDS.flatMap(word =>
        word.split("").map(char => ({
            char,
            glyphIndex: -1,
            isActive: false,
            idleBleeding: false,
        }))
    );
}

// Total letter count
const TOTAL_LETTERS = NAME_WORDS.join("").length;

export default function HeroInteraction() {
    const { theme } = useTheme();
    const [letters, setLetters] = useState<LetterState[]>(buildLetterStates);
    const [hasMouse, setHasMouse] = useState(false);
    const activeTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
    const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const cycleTimersRef = useRef<Map<number, ReturnType<typeof setInterval>>>(new Map());

    const isDark = theme === "dark";
    const accentColor = isDark ? "#e11d48" : "#f43f5e";

    useEffect(() => {
        setHasMouse(window.matchMedia("(pointer: fine)").matches);
    }, []);

    // ── Update a single letter's state ──────────────────────────────────────
    const updateLetter = useCallback((index: number, patch: Partial<LetterState>) => {
        setLetters(prev => {
            const next = [...prev];
            next[index] = { ...next[index], ...patch };
            return next;
        });
    }, []);

    // ── Rapid cycle through glyphs then snap back ─────────────────────────
    const triggerActivation = useCallback((index: number, speed = 60) => {
        const glyphs = getGlyphs(NAME_WORDS.join("")[index] ?? "");
        let step = 0;

        // Clear any existing cycle for this letter
        if (cycleTimersRef.current.has(index)) {
            clearInterval(cycleTimersRef.current.get(index)!);
        }
        if (activeTimersRef.current.has(index)) {
            clearTimeout(activeTimersRef.current.get(index)!);
        }

        updateLetter(index, { isActive: true, glyphIndex: 0 });

        const interval = setInterval(() => {
            step++;
            if (step < glyphs.length * 2) {
                // Cycle through glyphs twice for drama
                updateLetter(index, { glyphIndex: step % glyphs.length });
            } else {
                // Slam back to real character
                clearInterval(interval);
                cycleTimersRef.current.delete(index);
                updateLetter(index, { glyphIndex: -1, isActive: false });
            }
        }, speed);

        cycleTimersRef.current.set(index, interval);
    }, [updateLetter]);

    // ── Idle bleed — one random letter flickers its true form ────────────
    useEffect(() => {
        idleTimerRef.current = setInterval(() => {
            const index = Math.floor(Math.random() * TOTAL_LETTERS);
            const glyphs = getGlyphs(NAME_WORDS.join("")[index] ?? "");
            const trueForm = glyphs[glyphs.length - 1]; // deepest corruption

            // Don't interrupt active letters
            setLetters(prev => {
                if (prev[index].isActive) return prev;
                const next = [...prev];
                next[index] = { ...next[index], idleBleeding: true, glyphIndex: glyphs.length - 1 };
                return next;
            });

            // Snap back after a brief flash
            const snapBack = setTimeout(() => {
                setLetters(prev => {
                    const next = [...prev];
                    if (!next[index].isActive) {
                        next[index] = { ...next[index], idleBleeding: false, glyphIndex: -1 };
                    }
                    return next;
                });
            }, 120 + Math.random() * 180);

            return () => clearTimeout(snapBack);
        }, 1400 + Math.random() * 600);

        return () => {
            if (idleTimerRef.current) clearInterval(idleTimerRef.current);
        };
    }, []);

    // ── Cleanup on unmount ────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            cycleTimersRef.current.forEach(t => clearInterval(t));
            activeTimersRef.current.forEach(t => clearTimeout(t));
        };
    }, []);

    // ── Interaction handlers ──────────────────────────────────────────────
    const handleInteractionStart = useCallback((flatIndex: number) => {
        triggerActivation(flatIndex, hasMouse ? 55 : 45);

        // Mobile: sympathetic bleeds on neighbours
        if (!hasMouse) {
            [-2, -1, 1, 2].forEach(offset => {
                const ni = flatIndex + offset;
                if (ni < 0 || ni >= TOTAL_LETTERS) return;
                const delay = Math.abs(offset) * 80;
                setTimeout(() => {
                    setLetters(prev => {
                        if (prev[ni].isActive) return prev;
                        const glyphs = getGlyphs(NAME_WORDS.join("")[ni] ?? "");
                        const next = [...prev];
                        next[ni] = { ...next[ni], idleBleeding: true, glyphIndex: Math.floor(Math.random() * glyphs.length) };
                        return next;
                    });
                    setTimeout(() => {
                        setLetters(prev => {
                            const next = [...prev];
                            if (!next[ni].isActive) {
                                next[ni] = { ...next[ni], idleBleeding: false, glyphIndex: -1 };
                            }
                            return next;
                        });
                    }, 200 + Math.abs(offset) * 60);
                }, delay);
            });
        }
    }, [hasMouse, triggerActivation]);

    const handleMouseEnter = useCallback((flatIndex: number) => {
        if (!hasMouse) return;
        triggerActivation(flatIndex, 55);
    }, [hasMouse, triggerActivation]);

    // ── Render ────────────────────────────────────────────────────────────
    let flatIndex = 0;

    return (
        <div
            className={`w-full flex flex-col text-7xl md:text-9xl px-4 text-center select-none ${sansFont}`}
        >
            {NAME_WORDS.map((word, wordIndex) => (
                <span key={wordIndex} className="flex justify-center">
                    {word.split("").map((char, charIndex) => {
                        const fi = flatIndex++;
                        const letter = letters[fi];
                        if (!letter) return null;

                        const isShowingGlyph = letter.glyphIndex >= 0;
                        const currentGlyph = isShowingGlyph
                            ? getGlyphs(char)[letter.glyphIndex] ?? char
                            : char;

                        const isCorrupted = letter.isActive || letter.idleBleeding;

                        return (
                            <motion.span
                                key={fi}
                                className="relative inline-block cursor-pointer"
                                onMouseEnter={() => handleMouseEnter(fi)}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    handleInteractionStart(fi);
                                }}
                                // Subtle lift on active
                                animate={letter.isActive ? {
                                    y: -4,
                                    transition: { type: "spring", stiffness: 400, damping: 15 }
                                } : {
                                    y: 0,
                                    transition: { type: "spring", stiffness: 300, damping: 20 }
                                }}
                            >
                                {/* Real character — fades out when glyph shows */}
                                <span
                                    style={{
                                        opacity: isShowingGlyph ? 0 : 1,
                                        transition: "opacity 40ms linear",
                                        display: "block",
                                    }}
                                >
                                    {char}
                                </span>

                                {/* Glyph overlay — slams in when active */}
                                <span
                                    aria-hidden="true"
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        opacity: isShowingGlyph ? 1 : 0,
                                        transition: "opacity 40ms linear",
                                        color: letter.isActive
                                            ? accentColor
                                            : isCorrupted
                                                ? accentColor
                                                : "inherit",
                                        // Slight scale punch on active
                                        transform: letter.isActive ? "scale(1.08)" : "scale(1)",
                                        fontFeatureSettings: "normal",
                                        // Glitch-like text shadow on active
                                        textShadow: letter.isActive
                                            ? `2px 0 ${accentColor}88, -2px 0 ${isDark ? "#fff7ed" : "#1d4ed8"}44`
                                            : "none",
                                    }}
                                >
                                    {currentGlyph}
                                </span>
                            </motion.span>
                        );
                    })}
                </span>
            ))}
        </div>
    );
}
