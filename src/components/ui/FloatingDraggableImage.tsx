"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import {
    MotionStyle,
    MotionValue,
    motion,
    useAnimationFrame,
    useDragControls,
    useMotionValue,
    useTransform,
} from "framer-motion";

interface FloatingDraggableImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
    drag?: boolean;
    baseCursor?: "grab" | "pointer" | "default";
    dragElastic?: number;
    whileDragScale?: number;
    bobAmplitude?: number;
    bobDuration?: number;
    bobPhase?: number;
    style?: MotionStyle;
    tilt?: MotionValue<number> | number;
    className?: string;
    imageClassName?: string;
    frameClassName?: string;
    frameStyle?: CSSProperties;
    borderOnLandscape?: boolean;
    onImageLoad?: (details: { width: number; height: number; isVertical: boolean }) => void;
}

export default function FloatingDraggableImage({
    src,
    alt,
    width = 1200,
    height = 1200,
    priority = false,
    drag = true,
    baseCursor = "grab",
    dragElastic = 0.4,
    whileDragScale = 1.05,
    bobAmplitude = 12,
    bobDuration = 4,
    bobPhase = 0,
    style,
    tilt = 0,
    className,
    imageClassName,
    frameClassName,
    frameStyle,
    borderOnLandscape = true,
    onImageLoad,
}: FloatingDraggableImageProps) {
    const [imageSize, setImageSize] = useState({ width, height });
    const [isImageVertical, setIsImageVertical] = useState(false);
    const hoverOffset = useMotionValue(0);
    const staticTilt = useMotionValue(0);
    const dragControls = useDragControls();

    useEffect(() => {
        setImageSize({ width, height });
    }, [width, height]);

    useEffect(() => {
        if (typeof tilt === "number") {
            staticTilt.set(tilt);
        }
    }, [staticTilt, tilt]);

    const tiltValue = useMemo(() => {
        return typeof tilt === "number" ? staticTilt : tilt;
    }, [staticTilt, tilt]);

    useAnimationFrame((time) => {
        const phase = (time / 1000) * ((Math.PI * 2) / bobDuration) + bobPhase;
        hoverOffset.set(Math.sin(phase) * bobAmplitude);
    });

    const shadowOpacity = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [0.3, 0.5]);
    const shadowBlur = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [34, 16]);
    const shadowScaleX = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [0.82, 1.04]);
    const shadowScaleY = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [0.7, 0.95]);
    const shadowX = useTransform(tiltValue, [-12, 12], [-14, 14]);

    const sideShadowOpacity = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [0.42, 0.68]);
    const sideShadowBlur = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [26, 10]);
    const sideShadowScaleX = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [0.92, 1.08]);
    const sideShadowScaleY = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [0.88, 1.04]);
    const sideShadowX = useTransform(tiltValue, [-12, 12], [-1, 2]);
    const sideShadowY = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [8, -8]);

    const shadowFilter = useTransform(shadowBlur, (value) => `blur(${value}px)`);
    const sideShadowFilter = useTransform(sideShadowBlur, (value) => `blur(${value}px)`);

    const cursorClass = baseCursor === "pointer"
        ? "cursor-pointer"
        : baseCursor === "grab"
            ? "cursor-grab"
            : "cursor-default";

    const cursorStyle = baseCursor === "pointer"
        ? "pointer"
        : baseCursor === "grab"
            ? "grab"
            : "default";

    return (
        <motion.div
            drag={drag}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={dragElastic}
            whileDrag={drag ? { scale: whileDragScale, cursor: "grabbing" } : undefined}
            style={{
                ...style,

            }}
            className={className}
        >
            <motion.div
                style={{ y: hoverOffset }}
                className="w-full h-full relative flex items-center justify-center"
            >
                <div
                    className={`relative z-30 flex shrink-0 items-center justify-center ${frameClassName ?? ""}`}
                    style={frameStyle}
                >
                    <motion.div
                        aria-hidden
                        style={{
                            opacity: isImageVertical ? sideShadowOpacity : shadowOpacity,
                            filter: isImageVertical ? sideShadowFilter : shadowFilter,
                            scaleX: isImageVertical ? sideShadowScaleX : shadowScaleX,
                            scaleY: isImageVertical ? sideShadowScaleY : shadowScaleY,
                            x: isImageVertical ? sideShadowX : shadowX,
                            y: isImageVertical ? sideShadowY : 0,
                        }}
                        className={isImageVertical
                            ? "absolute top-[58%] left-[84%] z-0 h-[68%] w-[30%] -translate-y-1/2 rounded-[999px] bg-gradient-to-r from-black/90 via-black/55 to-transparent pointer-events-none"
                            : "absolute bottom-[-7%] left-1/2 z-0 h-[15%] w-[62%] -translate-x-1/2 rounded-[999px] bg-black/90 pointer-events-none"
                        }
                    />
                    <Image
                        src={src}
                        alt={alt}
                        width={imageSize.width}
                        height={imageSize.height}
                        draggable={false}
                        className={`object-contain relative z-10 ${drag ? `${cursorClass} active:cursor-grabbing touch-none` : ""} ${borderOnLandscape && !isImageVertical ? "border border-foreground rounded-lg" : ""} ${imageClassName ?? ""}`}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        onPointerDown={(event) => {
                            if (!drag) return;
                            dragControls.start(event);
                        }}
                        onDragStart={(event) => event.preventDefault()}
                        onLoadingComplete={(img) => {
                            const nextIsVertical = img.naturalHeight > img.naturalWidth;
                            setIsImageVertical(nextIsVertical);

                            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                                const nextSize = { width: img.naturalWidth, height: img.naturalHeight };
                                setImageSize(nextSize);
                                onImageLoad?.({ ...nextSize, isVertical: nextIsVertical });
                            }
                        }}
                        priority={priority}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}
