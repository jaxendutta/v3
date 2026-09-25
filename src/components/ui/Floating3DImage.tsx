"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import {
    MotionStyle,
    MotionValue,
    motion,
    useAnimationFrame,
    useInView,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import IPhone3DCanvas, { IPhoneFinish } from "@/components/ui/IPhone3DCanvas";
import IPad3DCanvas, { DeviceFinish } from "@/components/ui/IPad3DCanvas";

interface Floating3DImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
    drag?: boolean;
    baseCursor?: "grab" | "pointer" | "default";
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
    mockup?: "iphone" | "ipad" | "none";
    iphoneColor?: IPhoneFinish;
    ipadColor?: DeviceFinish;
    initialTiltY?: number;
    initialTiltZ?: number;
    boomerang?: boolean;
    align?: "center" | "start" | "end" | "left" | "right";
    onImageLoad?: (details: { width: number; height: number; isVertical: boolean }) => void;
}

export default function Floating3DImage({
    src,
    alt,
    width = 1200,
    height = 1200,
    priority = false,
    drag = true,
    baseCursor = "grab",
    whileDragScale = 1.04,
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
    mockup = "none",
    iphoneColor = "cosmic-orange",
    ipadColor = "silver",
    initialTiltY,
    initialTiltZ,
    boomerang = false,
    align = "center",
    onImageLoad,
}: Floating3DImageProps) {
    const is3DMockup = mockup === "iphone" || mockup === "ipad";
    const isVideo = src.toLowerCase().endsWith(".mp4") || src.toLowerCase().endsWith(".webm");
    const [imageSize, setImageSize] = useState({ width, height });
    const [isImageVertical, setIsImageVertical] = useState(mockup === "iphone" || (mockup !== "ipad" && height > width));
    const [isDragging, setIsDragging] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const hoverOffset = useMotionValue(0);
    const staticTilt = useMotionValue(0);

    // 3D rotation offsets driven by dragging
    const rawRotateX = useMotionValue(0);
    const rawRotateY = useMotionValue(0);
    const rawScale = useMotionValue(1);

    // Smooth physics springs that snap back when released
    const springRotateX = useSpring(rawRotateX, { stiffness: 260, damping: 24 });
    const springRotateY = useSpring(rawRotateY, { stiffness: 260, damping: 24 });
    const springScale = useSpring(rawScale, { stiffness: 300, damping: 26 });

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

    // Base initial rotateX from style prop if supplied
    const initialRotateX = typeof style?.rotateX === "number" ? style.rotateX : 0;
    const finalRotateX = useTransform(springRotateX, (val) => val + initialRotateX);

    // Combine base tilt (Z) with subtle Y steering
    const finalRotateZ = tiltValue;

    const isInView = useInView(containerRef, { margin: "250px 0px 250px 0px" });

    // Bobbing animation (only runs when near/in viewport)
    useAnimationFrame((time) => {
        if (!isInView) return;
        const phase = (time / 1000) * ((Math.PI * 2) / bobDuration) + bobPhase;
        hoverOffset.set(Math.sin(phase) * bobAmplitude);
    });

    const didMoveRef = useRef(false);

    // Pointer event handlers for 3D dragging
    const handlePointerDown = (e: React.PointerEvent) => {
        if (!drag || is3DMockup) return;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setIsDragging(true);
        didMoveRef.current = false;
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
        };
        rawScale.set(whileDragScale);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || is3DMockup) return;

        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        if (Math.hypot(deltaX, deltaY) > 5) {
            didMoveRef.current = true;
        }

        // Sensitivity factor: maps pixel drag to degrees (max ~35deg)
        const rotY = Math.max(-35, Math.min(35, deltaX * 0.22));
        const rotX = Math.max(-35, Math.min(35, -deltaY * 0.22));

        rawRotateX.set(rotX);
        rawRotateY.set(rotY);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging || is3DMockup) return;
        try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch { }
        setIsDragging(false);
        // Spring back to resting isometric angle
        rawRotateX.set(0);
        rawRotateY.set(0);
        rawScale.set(1);
    };

    const handleClickCapture = (e: React.MouseEvent) => {
        if (didMoveRef.current) {
            e.preventDefault();
            e.stopPropagation();
            didMoveRef.current = false;
        }
    };

    const combinedFrameStyle: CSSProperties = {
        aspectRatio: is3DMockup ? undefined : `${imageSize.width} / ${imageSize.height}`,
        ...(frameStyle ?? {}),
        position: "relative",
        transformStyle: "preserve-3d",
    };

    if (!frameStyle || (frameStyle && (frameStyle as any).width === undefined)) {
        combinedFrameStyle.width = "100%";
    }

    // Dynamic ground shadow calculations that react to both bobbing and 3D angle
    const shadowOpacity = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [0.3, 0.55]);
    const shadowBlur = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [36, 16]);
    const shadowScaleX = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [0.82, 1.05]);
    const shadowScaleY = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [0.7, 0.95]);
    const shadowFilter = useTransform(shadowBlur, (value) => `blur(${value}px)`);

    // Shadow offset also reacts to 3D rotation
    const dynamicShadowX = useTransform(
        [tiltValue, springRotateY],
        ([tiltZ, rotY]: number[]) => tiltZ * -1.2 + rotY * 1.5
    );
    const dynamicShadowY = useTransform(
        [hoverOffset, springRotateX],
        ([hover, rotX]: number[]) => (isImageVertical ? hover * 0.5 - rotX * 0.8 : -rotX * 0.8)
    );

    const sideShadowOpacity = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [0.4, 0.68]);
    const sideShadowBlur = useTransform(hoverOffset, [-bobAmplitude, bobAmplitude], [26, 10]);
    const sideShadowFilter = useTransform(sideShadowBlur, (value) => `blur(${value}px)`);

    const cursorClass = isDragging
        ? "cursor-grabbing"
        : baseCursor === "pointer"
            ? "cursor-pointer"
            : baseCursor === "grab"
                ? "cursor-grab"
                : "cursor-default";

    const justifyClass =
        align === "start" || align === "left"
            ? "justify-center md:justify-start"
            : align === "end" || align === "right"
                ? "justify-center md:justify-end"
                : "justify-center";

    const { rotateX: _ignoredRotateX, rotateZ: _ignoredRotateZ, ...motionStyle } = (style || {}) as any;

    return (
        <motion.div
            ref={containerRef}
            className={`relative select-none perspective-distant overflow-visible flex items-center ${justifyClass} ${className ?? ""}`}
            style={{
                transformStyle: "preserve-3d",
                ...motionStyle,
            }}
        >
            <motion.div
                style={{
                    y: hoverOffset,
                    transformStyle: "preserve-3d",
                }}
                className={`w-full h-full relative flex items-center ${justifyClass} overflow-visible`}
            >
                <motion.div
                    className={`relative z-30 flex shrink-0 items-center justify-center overflow-visible ${frameClassName ?? ""}`}
                    style={{
                        ...combinedFrameStyle,
                        rotateX: is3DMockup ? 0 : finalRotateX,
                        rotateY: is3DMockup ? 0 : springRotateY,
                        rotateZ: is3DMockup ? 0 : finalRotateZ,
                        scale: is3DMockup ? 1 : springScale,
                        transformStyle: "preserve-3d",
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onClickCapture={handleClickCapture}
                >
                    {/* Floating Drop Shadow on Ground (iPhone renders its own dynamic shadow inside the 3D canvas) */}
                    {mockup !== "iphone" && (
                        <motion.div
                            aria-hidden
                            style={{
                                opacity: (!is3DMockup && isImageVertical) ? sideShadowOpacity : shadowOpacity,
                                filter: (!is3DMockup && isImageVertical) ? sideShadowFilter : shadowFilter,
                                scaleX: shadowScaleX,
                                scaleY: shadowScaleY,
                                x: is3DMockup ? 0 : dynamicShadowX,
                                y: is3DMockup ? 0 : dynamicShadowY,
                                rotate: 0,
                                transform: "translateZ(-80px)",
                            }}
                            className={
                                mockup === "ipad"
                                    ? "absolute bottom-[-4%] left-1/2 z-0 h-[16%] w-[84%] -translate-x-1/2 rounded-[999px] bg-black/90 pointer-events-none"
                                    : isImageVertical
                                        ? "absolute top-[58%] left-[84%] z-0 h-[68%] w-[30%] -translate-y-1/2 rounded-[999px] bg-linear-to-r from-black/90 via-black/55 to-transparent pointer-events-none"
                                        : "absolute bottom-[-7%] left-1/2 z-0 h-[15%] w-[62%] -translate-x-1/2 rounded-[999px] bg-black/90 pointer-events-none"
                            }
                        />
                    )}

                    {mockup === "iphone" ? (
                        <div className="relative z-10 w-full h-full flex items-center justify-center overflow-visible">
                            <IPhone3DCanvas
                                src={src}
                                alt={alt}
                                color={iphoneColor}
                                initialTiltY={initialTiltY}
                                initialTiltZ={initialTiltZ}
                                boomerang={boomerang}
                                className={imageClassName}
                            />
                        </div>
                    ) : mockup === "ipad" ? (
                        <div className="relative z-10 w-full h-full flex items-center justify-center overflow-visible">
                            <IPad3DCanvas
                                src={src}
                                alt={alt}
                                color={ipadColor}
                                initialTiltY={initialTiltY}
                                boomerang={boomerang}
                                className={imageClassName}
                            />
                        </div>
                    ) : isVideo ? (
                        <div
                            className={`relative z-10 w-full h-full touch-none ${cursorClass} ${borderOnLandscape && !isImageVertical
                                    ? "border-[6px] sm:border-8 md:border-10 border-[#202734] rounded-2xl md:rounded-3xl overflow-hidden ring-1.5 sm:ring-2 ring-slate-400/90 shadow-2xl"
                                    : ""
                                }`}
                            style={{
                                transformStyle: "preserve-3d",
                            }}
                        >
                            <video
                                src={src}
                                autoPlay
                                loop
                                muted
                                playsInline
                                onLoadedMetadata={(e) => {
                                    const v = e.currentTarget;
                                    const nextIsVertical = v.videoHeight > v.videoWidth;
                                    setIsImageVertical(nextIsVertical);
                                    if (v.videoWidth > 0 && v.videoHeight > 0) {
                                        const nextSize = { width: v.videoWidth, height: v.videoHeight };
                                        setImageSize(nextSize);
                                        onImageLoad?.({ ...nextSize, isVertical: nextIsVertical });
                                    }
                                }}
                                className={`${isImageVertical ? "object-contain" : "object-cover"} w-full h-full pointer-events-none ${imageClassName ?? ""}`}
                            />
                        </div>
                    ) : (
                        /* Device Screen Container with 3D Bezel */
                        <div
                            className={`relative z-10 w-full h-full touch-none ${cursorClass} ${borderOnLandscape && !isImageVertical
                                    ? "border-[6px] sm:border-8 md:border-10 border-[#202734] rounded-2xl md:rounded-3xl overflow-hidden ring-1.5 sm:ring-2 ring-slate-400/90 shadow-2xl"
                                    : ""
                                }`}
                            style={{
                                transformStyle: "preserve-3d",
                            }}
                        >
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                unoptimized={src.endsWith(".gif")}
                                draggable={false}
                                className={`${isImageVertical ? "object-contain" : "object-cover"} pointer-events-none ${imageClassName ?? ""}`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                                onLoad={(event) => {
                                    const img = event.currentTarget as HTMLImageElement;
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
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
