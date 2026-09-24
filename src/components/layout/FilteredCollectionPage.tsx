"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { HiOutlineArrowLeft, HiOutlineArrowUp } from "react-icons/hi2";
import { TbFilterDown, TbFilterUp, TbFilterX } from "react-icons/tb";
import { csDeviousFont, csDeviousStippledFont } from "@/lib/fonts";
import { fadeIn } from "@/lib/motionVariants";
import RotatingButton from "@/components/ui/RotatingButton";
import Footer from "@/components/layout/Footer";
import FilterContainer from "@/components/ui/FilterContainer";

interface FilteredCollectionPageProps {
    backHref: string;
    backTexts: [string, string];
    title: ReactNode;
    titleClassName: string;
    summary: ReactNode;
    isFilterVisible: boolean;
    onToggleFilters: () => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    filterPanel: ReactNode;
    children: ReactNode;
    mainClassName?: string;
    footerClassName?: string;
}

export default function FilteredCollectionPage({
    backHref,
    backTexts,
    title,
    titleClassName,
    summary,
    isFilterVisible,
    onToggleFilters,
    hasActiveFilters,
    onClearFilters,
    filterPanel,
    children,
    mainClassName = "containerd",
    footerClassName = "mt-6",
}: FilteredCollectionPageProps) {
    return (
        <div
            id="top"
            className="min-h-screen flex flex-col gap-4 px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pb-4 md:pb-6 lg:pb-8 xl:pb-12 2xl:pb-16 pt-[calc(env(safe-area-inset-top,0px)+4.75rem)] md:pt-16 text-[13px] md:text-sm lg:text-base w-full max-w-full overflow-visible"
        >
            {/* Top Navigation Controls - floating corner buttons matching ../jeffrey */}
            <motion.div
                className="fixed top-[calc(env(safe-area-inset-top,0px)+0.75rem)] md:top-6 lg:top-8 left-3 md:left-6 lg:left-8 xl:left-12 2xl:left-16 z-50 pointer-events-auto"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
            >
                <RotatingButton
                    href={backHref}
                    texts={backTexts}
                    centerIcon={HiOutlineArrowLeft}
                    size={80}
                    fontSize={12}
                    variant="wavy"
                />
            </motion.div>

            <motion.div
                className="fixed top-[calc(env(safe-area-inset-top,0px)+0.75rem)] md:top-6 lg:top-8 right-3 md:right-6 lg:right-8 xl:right-12 2xl:right-16 z-50 pointer-events-auto"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
            >
                <RotatingButton
                    href="#top"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    texts={["Back to top", "Scroll up"]}
                    centerIcon={HiOutlineArrowUp}
                    size={80}
                    fontSize={12}
                    variant="wavy"
                />
            </motion.div>

            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="w-full max-w-full overflow-visible">
                <motion.div className={`${titleClassName} text-center`}>
                    {typeof title === "string"
                        ? title.split("").map((char: string, i: number) => (
                            <span key={i} className={/\p{L}/u.test(char) ? csDeviousStippledFont : csDeviousFont}>
                                {char}
                            </span>
                        ))
                        : title}
                </motion.div>

                <div className="flex justify-between items-center gap-4 md:gap-8 border-b border-current pb-4">
                    <div className="w-full min-w-0 text-center items-center text-[13px] xl:text-base leading-none justify-center flex flex-wrap">
                        <span className="max-w-full wrap-break-word text-left leading-relaxed">{summary}</span>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        {hasActiveFilters && (
                            <motion.button
                                title="Clear filters"
                                onClick={onClearFilters}
                                className="px-2 py-1.5 border border-current text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap"
                                whileHover={{ backgroundColor: "red", color: "white" }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                <TbFilterX className="shrink-0" />
                                <span className="hidden md:flex">Clear filters</span>
                            </motion.button>
                        )}

                        <button
                            type="button"
                            title={isFilterVisible ? "Hide filters" : "Show filters"}
                            onClick={onToggleFilters}
                            className="px-2 py-1.5 border border-current hover:bg-foreground hover:text-background transition-colors flex items-center gap-2 whitespace-nowrap text-[13px] xl:text-[15px]"
                            aria-label={isFilterVisible ? "Hide filters" : "Show filters"}
                        >
                            {isFilterVisible ? <TbFilterUp className="shrink-0" /> : <TbFilterDown className="shrink-0" />}
                            <span className="hidden md:flex">{isFilterVisible ? "Hide filters" : "Show filters"}</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            <FilterContainer isVisible={isFilterVisible} className="container w-full flex self-center">
                {filterPanel}
            </FilterContainer>

            <main className={`${mainClassName} w-full max-w-full min-w-0 overflow-visible`}>{children}</main>

            <Footer className={footerClassName} />
        </div>
    );
}