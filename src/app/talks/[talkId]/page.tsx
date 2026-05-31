// src/app/talks/[talkId]/page.tsx
"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { HiOutlineArrowLeft, HiOutlineArrowUp } from "react-icons/hi2";
import { LuMapPin, LuCalendar, LuBuilding2, LuMic, LuLayers, LuClock, LuPresentation } from "react-icons/lu";
import { presentationsData } from "@/data/presentations";
import { SocialItem } from "@/components/sections/contact/SocialItem";
import RotatingButton from "@/components/ui/RotatingButton";
import Footer from "@/components/layout/Footer";
import CollapsibleAbstract from "@/components/ui/CollapsibleAbstract";
import { serifFont, sansFont, codeFont } from "@/lib/fonts";
import { formatDate } from "@/lib/format";
import { fadeIn } from "@/lib/motionVariants";

// Helpers

function resolveAspectRatio(url: string, override?: number): number {
    if (override) return override;
    try {
        const u = new URL(url);
        const wdAr = u.searchParams.get("wdAr");
        if (wdAr) return parseFloat(wdAr);
    } catch { /* ignore */ }
    return 16 / 9;
}

// Renders a trusted HTML string. Only used with developer-controlled data.
function Html({ html, className = "", tag = "span" }: { html: string; className?: string; tag?: "span" | "p" | "h1" | "h2" | "h3" }) {
    const Tag = tag;
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

//  Sub-components 

function SectionLabel({ label, delay = 0 }: { label: string; delay?: number }) {
    return (
        <>
            <p className={`${codeFont} text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground-subtle mb-3`}>
                {label}
            </p>
            <motion.div
                className="w-full h-px origin-left bg-current mb-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay }}
            />
        </>
    );
}

function MetaRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
    return (
        <div className="flex gap-0 md:gap-3 py-2.5 border-b border-current/20">
            <div className="flex items-center gap-1.25 md:gap-2 min-w-[22.5%] md:min-w-[30%] max-w-[50%] flex-shrink-0 text-muted-foreground-subtle text-[11px] md:text-base leading-0">
                <Icon className="mb-0.5 hidden md:inline" />
                <span className={`${codeFont} uppercase tracking-wider`}>{label}</span>
            </div>
            <div className={`${sansFont} text-sm md:text-lg flex-1`}>{value}</div>
        </div>
    );
}

//  Page

export default function TalkDetailPage({ params }: { params: Promise<{ talkId: string }> }) {
    const { talkId } = use(params);
    const data = presentationsData[talkId];

    if (!data) notFound();

    const eventDisplay = data.event?.short ?? data.event?.long;
    const linkEntries = data.links ? Object.entries(data.links) : [];
    const hasRecognition = data.recognition && data.recognition.length > 0;
    const aspectRatio = resolveAspectRatio(data.embed?.url ?? "", data.embed?.aspectRatio);

    return (
        <div className="min-h-screen flex flex-col gap-8 p-4 md:p-6 lg:p-8 xl:p-12 2xl:p-16 text-[13px] md:text-sm lg:text-base">

            {/*  Sticky nav  */}
            <motion.header
                className="sticky top-4 z-50 flex justify-between items-center"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <RotatingButton href="/papers" texts={["Papers & Talks", "Back"]} centerIcon={HiOutlineArrowLeft} size={80} fontSize={12} variant="glow" />
                <RotatingButton href="#top" texts={["Back to top", "Scroll up"]} centerIcon={HiOutlineArrowUp} size={80} fontSize={12} variant="glow" />
            </motion.header>

            {/*  Event headline  */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="w-full text-center mt-4 md:mt-6">
                {eventDisplay ? (
                    <Html
                        tag="h1"
                        html={eventDisplay}
                        className={`${serifFont} italic text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.15] md:max-w-[85vw] mx-auto`}
                    />
                ) : (
                    <h1 className={`${serifFont} italic text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.15] md:max-w-[85vw] mx-auto`}>
                        {data.presentationType}
                    </h1>
                )}
            </motion.div>

            {/* Divider */}
            <motion.div className="w-full h-px bg-current" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }} />

            {/* Metadata */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 w-full max-w-7xl mx-auto">
                <MetaRow icon={LuCalendar} label="Date" value={formatDate(data.duration.end, "Weekday, DD Month YYYY")} />
                {data.time && (
                    <MetaRow icon={LuClock} label="Time" value={data.time} />
                )}
                {data.event?.long && (
                    <MetaRow icon={LuPresentation} label="Event" value={<Html html={data.event.long} />} />
                )}
                {data.host && (
                    <MetaRow icon={LuBuilding2} label="Host" value={data.host} />
                )}
                {data.location && (
                    <MetaRow icon={LuMapPin} label="Location" value={data.location} />
                )}
                {data.session && (
                    <MetaRow icon={LuLayers} label="Session" value={data.session} />
                )}
            </motion.div>

            {/* External links */}
            {linkEntries.length > 0 && (
                <motion.div variants={fadeIn} initial="hidden" animate="visible" className="w-full max-w-7xl mx-auto text-xl md:text-2xl">
                    <SectionLabel label="Links" delay={0.15} />
                    <div className="border-t border-current">
                        {linkEntries.map(([key, link], i) => (
                            <SocialItem key={key} index={i} item={link} />
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Presentation Title */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="w-full max-w-7xl mx-auto">
                <SectionLabel label="Title" delay={0.2} />
                <Html
                    tag="p"
                    html={data.title}
                    className={`${serifFont} italic text-[15px] md:text-2xl lg:text-3xl leading-[1.5] text-justify`}
                />
            </motion.div>

            {/* Abstract */}
            {data.abstract && (
                <motion.div variants={fadeIn} initial="hidden" animate="visible" className="w-full max-w-7xl mx-auto">
                    <CollapsibleAbstract abstract={data.abstract} lineDelay={0.25} />

                    {data.keywords && data.keywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-3">
                            <span className={`${codeFont} text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground-subtle mr-1`}>
                                Keywords
                            </span>
                            {data.keywords.map((kw) => (
                                <span key={kw} className={`${codeFont} text-[9px] md:text-[10px] uppercase tracking-wider border border-current/40 px-2 py-0.5 text-muted-foreground`}>
                                    {kw}
                                </span>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Recognition */}
            {hasRecognition && (
                <motion.div variants={fadeIn} initial="hidden" animate="visible" className="w-full max-w-7xl mx-auto">
                    <SectionLabel label="Recognition / Awards" delay={0.1} />
                    <div className="flex flex-col gap-1">
                        {data.recognition!.map((r) => (
                            <p key={r} className={`${serifFont} italic text-sm md:text-base text-muted-foreground`}>
                                {r}
                            </p>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Slide embed */}
            {data.embed && (
                <motion.div variants={fadeIn} initial="hidden" animate="visible" className="w-full max-w-7xl mx-auto">
                    <SectionLabel label="Slides" delay={0.3} />
                    <div className="w-full relative border border-current" style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}>
                        <iframe
                            src={data.embed.url}
                            className="absolute inset-0 w-full h-full"
                            title={data.title.replace(/<[^>]*>/g, "")}
                            loading="lazy"
                            allowFullScreen
                        />
                    </div>
                </motion.div>
            )}

            <Footer className="mt-4" />
        </div>
    );
}
