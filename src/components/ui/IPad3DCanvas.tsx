"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { parseGIF, decompressFrames } from "gifuct-js";

export type DeviceFinish =
    | "space-gray"
    | "silver"
    | "natural-titanium"
    | "black-titanium"
    | "cosmic-orange"
    | "ultramarine"
    | "blue"
    | "teal"
    | "green"
    | "pink"
    | "purple"
    | "lavender"
    | "lavendar"
    | "white"
    | "black";

interface IPad3DCanvasProps {
    src: string;
    alt?: string;
    className?: string;
    color?: DeviceFinish;
    initialTiltY?: number;
    boomerang?: boolean;
    onClick?: () => void;
}

const FINISH_COLORS: Record<
    DeviceFinish,
    {
        body: number;
        back: number;
        ring: number;
        logo: number;
        button: number;
    }
> = {
    "space-gray": {
        body: 0x3d3f44, // Anodized Space Gray aluminum
        back: 0x323438,
        ring: 0x5a5d64,
        logo: 0x484b52,
        button: 0x3d3f44,
    },
    silver: {
        body: 0xdce0e6, // Brilliant Apple Silver aluminum
        back: 0xd0d5dc,
        ring: 0xedf1f7,
        logo: 0xd8dde4,
        button: 0xdce0e6,
    },
    "natural-titanium": {
        body: 0x8a8781,
        back: 0x7c7974,
        ring: 0x9e9b95,
        logo: 0x918e88,
        button: 0x8a8781,
    },
    "black-titanium": {
        body: 0x27282b,
        back: 0x1f2022,
        ring: 0x3e4044,
        logo: 0x333538,
        button: 0x27282b,
    },
    "cosmic-orange": {
        body: 0xcd7442,
        back: 0xc46938,
        ring: 0xdc814b,
        logo: 0xd57a44,
        button: 0xcd7442,
    },
    ultramarine: {
        body: 0x73aae6,
        back: 0x9cc7f2,
        ring: 0xbedcf8,
        logo: 0x659ad9,
        button: 0x5a9ee6,
    },
    blue: {
        body: 0x73aae6,
        back: 0x9cc7f2,
        ring: 0xbedcf8,
        logo: 0x659ad9,
        button: 0x5a9ee6,
    },
    teal: {
        body: 0x338f89,
        back: 0x4caea7,
        ring: 0x60c2bb,
        logo: 0x308882,
        button: 0x28857f,
    },
    green: {
        body: 0x8ad0a2,
        back: 0xb7eac7,
        ring: 0xd0f4dc,
        logo: 0x78be90,
        button: 0x78be90,
    },
    pink: {
        body: 0xdc7d9b,
        back: 0xf0a8bf,
        ring: 0xf7c6d6,
        logo: 0xcb6b8a,
        button: 0xd66d8e,
    },
    purple: {
        body: 0xb8a4d4,
        back: 0xe4dcf2,
        ring: 0xf2ecf8,
        logo: 0x9f8cb8,
        button: 0xb8a4d4,
    },
    lavender: {
        body: 0xb8a4d4,
        back: 0xe4dcf2,
        ring: 0xf2ecf8,
        logo: 0x9f8cb8,
        button: 0xb8a4d4,
    },
    lavendar: {
        body: 0xb8a4d4,
        back: 0xe4dcf2,
        ring: 0xf2ecf8,
        logo: 0x9f8cb8,
        button: 0xb8a4d4,
    },
    white: {
        body: 0xe2e4e8,
        back: 0xf0f2f5,
        ring: 0xf5f7fa,
        logo: 0xd2d5db,
        button: 0xdcdfe4,
    },
    black: {
        body: 0x1f2023,
        back: 0x18191b,
        ring: 0x2e3034,
        logo: 0x28292c,
        button: 0x222428,
    },
};

function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    return shape;
}

// Maps 2D position vertices [-w/2..w/2, -h/2..h/2] strictly to normalized UVs [0..1, 0..1]
function normalizeShapeUVs(geometry: THREE.BufferGeometry, width: number, height: number) {
    const pos = geometry.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        uvs[i * 2] = (x + width / 2) / width;
        uvs[i * 2 + 1] = (y + height / 2) / height;
    }
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
}

export default function IPad3DCanvas({
    src,
    alt = "Interactive 3D iPad",
    className = "",
    color = "silver",
    initialTiltY = -0.15,
    boomerang = false,
    onClick,
}: IPad3DCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);

    // 1. Viewport Observer: Only instantiate heavy WebGL context & video decoders when near viewport
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { rootMargin: "500px 0px" }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isInView) {
            setIsLoaded(false);
            return;
        }

        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        let animationFrameId = 0;
        const BLEED = 0.12;
        const width = container.clientWidth || 580;
        const height = container.clientHeight || 400;

        // 1. Three.js Scene & Camera Setup
        const scene = new THREE.Scene();
        const initialAspect = width / height;
        const camera = new THREE.PerspectiveCamera(38, initialAspect, 0.1, 100);

        const updateCameraDistance = (w: number, h: number) => {
            const aspect = w / h;
            camera.aspect = aspect;
            const targetAspect = 1.43;
            const baseDist = 8.6;
            if (aspect < targetAspect) {
                camera.position.set(0, 0, baseDist * (targetAspect / aspect));
            } else {
                camera.position.set(0, 0, baseDist);
            }
            camera.updateProjectionMatrix();
        };
        updateCameraDistance(width, height);

        // 2. WebGL Renderer
        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true,
                powerPreference: "high-performance",
            });
        } catch (e) {
            console.warn("Could not create WebGLRenderer for iPad3DCanvas", e);
            return;
        }
        const canvasW = Math.round(width * (1 + BLEED * 2));
        const canvasH = Math.round(height * (1 + BLEED * 2));
        renderer.setSize(canvasW, canvasH);
        // On mobile devices, capping pixel ratio at 1.5 saves ~50% VRAM while staying retina-crisp
        const maxDpr = typeof window !== "undefined" && window.innerWidth < 768 ? 1.5 : 2;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;

        // 3. Studio Lighting Rig (Soft diffused studio lights)
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
        keyLight.position.set(6, 7, 7);
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(0xdde8ff, 1.2);
        rimLight.position.set(-6, 4, -7);
        scene.add(rimLight);

        const fillLight = new THREE.DirectionalLight(0xffa875, 0.7);
        fillLight.position.set(4, -5, 3);
        scene.add(fillLight);

        const leftFill = new THREE.DirectionalLight(0xdde8ff, 0.9);
        leftFill.position.set(-5, -2, 4);
        scene.add(leftFill);

        // 4. iPad Pro Landscape Chassis (1.43 : 1 Pro ratio)
        const finish = FINISH_COLORS[color] ?? FINISH_COLORS["space-gray"];
        const tabletGroup = new THREE.Group();

        // Screen dimensions (Landscape tablet presentation)
        const screenWidth = 6.05;
        const screenHeight = 4.15;
        const screenRadius = 0.24;

        // Tablet body dimensions (substantial, realistic 3D unibody thickness)
        const tabletWidth = 6.32;
        const tabletHeight = 4.42;
        const tabletThickness = 0.52;
        const cornerRadius = 0.36;

        const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

        // A. Outer Aluminum Chassis (Flat-edge unibody with chamfer)
        const bodyShape = createRoundedRectShape(tabletWidth, tabletHeight, cornerRadius);
        const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, {
            depth: tabletThickness,
            bevelEnabled: true,
            bevelSegments: 8,
            steps: 1,
            bevelSize: 0.038,
            bevelThickness: 0.038,
            curveSegments: 24,
        });
        bodyGeometry.center();
        disposables.push(bodyGeometry);

        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: finish.body,
            metalness: 0.72,
            roughness: 0.46, // Anodized satin aluminum
        });
        disposables.push(bodyMaterial);
        const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        tabletGroup.add(bodyMesh);

        // Hardware Side Details on Aluminum Edges
        const buttonMat = new THREE.MeshStandardMaterial({
            color: finish.button,
            metalness: 0.82,
            roughness: 0.32,
        });
        disposables.push(buttonMat);

        // Top Power Button
        const powerBtnGeom = new THREE.BoxGeometry(0.50, 0.036, tabletThickness * 0.42);
        disposables.push(powerBtnGeom);
        const powerBtn = new THREE.Mesh(powerBtnGeom, buttonMat);
        powerBtn.position.set(tabletWidth / 2 - 0.75, tabletHeight / 2 + 0.036, 0);
        tabletGroup.add(powerBtn);

        // Top Apple Pencil Magnetic Charging Strip
        const pencilStripGeom = new THREE.BoxGeometry(2.5, 0.024, tabletThickness * 0.48);
        disposables.push(pencilStripGeom);
        const pencilStripMat = new THREE.MeshStandardMaterial({
            color: finish.logo,
            metalness: 0.85,
            roughness: 0.30,
        });
        disposables.push(pencilStripMat);
        const pencilStrip = new THREE.Mesh(pencilStripGeom, pencilStripMat);
        pencilStrip.position.set(0, tabletHeight / 2 + 0.032, 0);
        tabletGroup.add(pencilStrip);

        // Right Edge Volume Rockers
        [-0.30, 0.30].forEach((offset) => {
            const volGeom = new THREE.BoxGeometry(0.036, 0.32, tabletThickness * 0.42);
            disposables.push(volGeom);
            const volBtn = new THREE.Mesh(volGeom, buttonMat);
            volBtn.position.set(tabletWidth / 2 + 0.036, tabletHeight / 2 - 0.75 + offset, 0);
            tabletGroup.add(volBtn);
        });

        // Right Edge USB-C Port
        const usbPortGeom = new THREE.BoxGeometry(0.04, 0.28, tabletThickness * 0.28);
        disposables.push(usbPortGeom);
        const usbPortMat = new THREE.MeshBasicMaterial({ color: 0x08090c });
        disposables.push(usbPortMat);
        const usbPort = new THREE.Mesh(usbPortGeom, usbPortMat);
        usbPort.position.set(tabletWidth / 2 + 0.034, 0, 0);
        tabletGroup.add(usbPort);

        // Antenna Inlay Bands
        const antennaMat = new THREE.MeshBasicMaterial({ color: 0x222428 });
        disposables.push(antennaMat);
        [-1, 1].forEach((dirX) => {
            const bandGeom = new THREE.BoxGeometry(0.024, 0.044, tabletThickness + 0.08);
            disposables.push(bandGeom);
            const topBand = new THREE.Mesh(bandGeom, antennaMat);
            topBand.position.set(dirX * (tabletWidth / 2 - 0.38), tabletHeight / 2 + 0.02, 0);
            tabletGroup.add(topBand);

            const botBand = new THREE.Mesh(bandGeom, antennaMat);
            botBand.position.set(dirX * (tabletWidth / 2 - 0.38), -(tabletHeight / 2 + 0.02), 0);
            tabletGroup.add(botBand);
        });

        // B. Back Panel (Anodized aluminum back)
        const backShape = createRoundedRectShape(tabletWidth - 0.03, tabletHeight - 0.03, cornerRadius - 0.015);
        const backGeometry = new THREE.ShapeGeometry(backShape, 24);
        normalizeShapeUVs(backGeometry, tabletWidth - 0.03, tabletHeight - 0.03);
        disposables.push(backGeometry);

        const backMaterial = new THREE.MeshStandardMaterial({
            color: finish.back,
            metalness: 0.65,
            roughness: 0.52,
        });
        disposables.push(backMaterial);
        const backMesh = new THREE.Mesh(backGeometry, backMaterial);
        backMesh.position.z = -(tabletThickness / 2 + 0.040);
        backMesh.rotation.y = Math.PI;
        tabletGroup.add(backMesh);

        // Back Apple Emblem
        const logoShape = new THREE.Shape();
        logoShape.absarc(0, 0, 0.34, 0, Math.PI * 2, false);
        const logoGeom = new THREE.ShapeGeometry(logoShape, 24);
        disposables.push(logoGeom);
        const logoMat = new THREE.MeshStandardMaterial({
            color: finish.logo,
            metalness: 0.95,
            roughness: 0.15,
        });
        disposables.push(logoMat);
        const logoMesh = new THREE.Mesh(logoGeom, logoMat);
        logoMesh.position.set(0, 0, -(tabletThickness / 2 + 0.042));
        logoMesh.rotation.y = Math.PI;
        tabletGroup.add(logoMesh);

        // Rear Camera Plateau Module
        const cameraIslandGroup = new THREE.Group();
        const islandShape = createRoundedRectShape(1.15, 1.15, 0.28);
        const islandGeom = new THREE.ExtrudeGeometry(islandShape, {
            depth: 0.05,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 1,
            bevelSize: 0.02,
            bevelThickness: 0.02,
            curveSegments: 16,
        });
        islandGeom.center();
        disposables.push(islandGeom);
        const islandMat = new THREE.MeshStandardMaterial({
            color: finish.ring,
            metalness: 0.70,
            roughness: 0.40,
        });
        disposables.push(islandMat);
        const islandMesh = new THREE.Mesh(islandGeom, islandMat);
        cameraIslandGroup.add(islandMesh);

        // 2 Camera Lenses on Plateau
        const lenses = [
            [-0.26, 0.22],
            [0.22, -0.22],
        ];
        lenses.forEach(([lx, ly]) => {
            const ringGeom = new THREE.CylinderGeometry(0.20, 0.20, 0.05, 24);
            disposables.push(ringGeom);
            const ringMat = new THREE.MeshStandardMaterial({
                color: finish.ring,
                metalness: 0.85,
                roughness: 0.25,
            });
            disposables.push(ringMat);
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.set(lx, ly, 0.038);
            cameraIslandGroup.add(ring);

            const glassGeom = new THREE.CylinderGeometry(0.16, 0.16, 0.055, 24);
            disposables.push(glassGeom);
            const glassMat = new THREE.MeshPhysicalMaterial({
                color: 0x07090e,
                metalness: 0.1,
                roughness: 0.05,
                reflectivity: 0.9,
            });
            disposables.push(glassMat);
            const glass = new THREE.Mesh(glassGeom, glassMat);
            glass.rotation.x = Math.PI / 2;
            glass.position.set(lx, ly, 0.041);
            cameraIslandGroup.add(glass);
        });

        cameraIslandGroup.position.set(-(tabletWidth / 2 - 0.88), tabletHeight / 2 - 0.88, -(tabletThickness / 2 + 0.07));
        cameraIslandGroup.rotation.y = Math.PI;
        tabletGroup.add(cameraIslandGroup);

        // C. Front Black Glass Bezel
        const frontGlassShape = createRoundedRectShape(tabletWidth - 0.02, tabletHeight - 0.02, cornerRadius - 0.01);
        const frontGlassGeom = new THREE.ShapeGeometry(frontGlassShape, 32);
        disposables.push(frontGlassGeom);
        const frontGlassMat = new THREE.MeshBasicMaterial({ color: 0x050608 });
        disposables.push(frontGlassMat);
        const frontGlassMesh = new THREE.Mesh(frontGlassGeom, frontGlassMat);
        frontGlassMesh.position.z = tabletThickness / 2 + 0.040;
        tabletGroup.add(frontGlassMesh);

        // D. Active Display Screen
        const screenShape = createRoundedRectShape(screenWidth, screenHeight, screenRadius);
        const screenGeometry = new THREE.ShapeGeometry(screenShape, 32);
        normalizeShapeUVs(screenGeometry, screenWidth, screenHeight);
        disposables.push(screenGeometry);

        const screenMaterial = new THREE.MeshBasicMaterial({
            color: 0x0a0c10,
            // Render the screenshot as-authored; the scene's ACES filmic tone curve is meant
            // for lit chassis surfaces, not for a flat UI screenshot texture, and was dulling it
            toneMapped: false,
        });
        disposables.push(screenMaterial);

        const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
        screenMesh.position.z = tabletThickness / 2 + 0.041;
        tabletGroup.add(screenMesh);

        let gifPlayback: { update: (time: number) => void } | null = null;
        let videoElement: HTMLVideoElement | null = null;
        let videoTexture: THREE.VideoTexture | null = null;
        let removeGestureListeners: (() => void) | null = null;
        let isCancelled = false;
        let isIntersecting = true;

        const cleanSrc = src.split("?")[0].toLowerCase();
        const isVideo = cleanSrc.endsWith(".mp4") || cleanSrc.endsWith(".webm") || cleanSrc.endsWith(".ogg");
        const isGif = cleanSrc.endsWith(".gif");

        if (isVideo) {
            const video = document.createElement("video");
            video.src = src;
            video.crossOrigin = "anonymous";
            video.loop = true;
            video.defaultMuted = true;
            video.muted = true;
            video.autoplay = true;
            video.playsInline = true;
            video.setAttribute("muted", "");
            video.setAttribute("playsinline", "");
            video.setAttribute("webkit-playsinline", "");
            video.setAttribute("disablePictureInPicture", "");
            video.setAttribute("disableRemotePlayback", "");
            video.preload = "auto";
            videoElement = video;
            video.load();

            const vTexture = new THREE.VideoTexture(video);
            vTexture.colorSpace = THREE.SRGBColorSpace;
            vTexture.minFilter = THREE.LinearFilter;
            vTexture.magFilter = THREE.LinearFilter;
            vTexture.generateMipmaps = false;
            vTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            videoTexture = vTexture;
            disposables.push(vTexture);

            screenMaterial.map = vTexture;
            screenMaterial.color.setHex(0xffffff);
            screenMaterial.needsUpdate = true;

            const tryPlay = () => {
                if (isCancelled || !videoElement) return;
                videoElement.muted = true;
                const playPromise = videoElement.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            if (!isCancelled) setIsLoaded(true);
                        })
                        .catch(() => {
                            // Autoplay restricted on page refresh or Low Power Mode; mark loaded and recover on gesture
                            if (!isCancelled) setIsLoaded(true);
                        });
                }
            };

            const onReady = () => {
                if (!isCancelled) setIsLoaded(true);
                tryPlay();
            };

            video.addEventListener("loadeddata", onReady, { once: true });
            video.addEventListener("canplay", onReady, { once: true });
            video.addEventListener("loadedmetadata", onReady, { once: true });

            if (video.readyState >= 2) {
                onReady();
            } else {
                tryPlay();
            }

            // User gesture fallback for iOS Safari refresh & Low Power Mode:
            const unlockPlay = () => {
                if (videoElement && videoElement.paused && isIntersecting) {
                    videoElement.muted = true;
                    videoElement.play().catch(() => {});
                }
            };
            window.addEventListener("touchstart", unlockPlay, { passive: true });
            window.addEventListener("pointerdown", unlockPlay, { passive: true });
            window.addEventListener("scroll", unlockPlay, { passive: true });
            removeGestureListeners = () => {
                window.removeEventListener("touchstart", unlockPlay);
                window.removeEventListener("pointerdown", unlockPlay);
                window.removeEventListener("scroll", unlockPlay);
            };
        } else if (isGif) {
            fetch(src)
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch GIF");
                    return res.arrayBuffer();
                })
                .then((buffer) => {
                    if (isCancelled) return;
                    const parsedGif = parseGIF(buffer);
                    const frames = decompressFrames(parsedGif, true);
                    if (!frames || frames.length === 0) {
                        setIsLoaded(true);
                        return;
                    }

                    const gifW = parsedGif.lsd.width;
                    const gifH = parsedGif.lsd.height;

                    const gifCanvas = document.createElement("canvas");
                    gifCanvas.width = gifW;
                    gifCanvas.height = gifH;
                    const gifCtx = gifCanvas.getContext("2d", { willReadFrequently: true })!;

                    const patchCanvas = document.createElement("canvas");
                    const patchCtx = patchCanvas.getContext("2d")!;

                    const canvasTexture = new THREE.CanvasTexture(gifCanvas);
                    canvasTexture.colorSpace = THREE.SRGBColorSpace;
                    // Mipmaps + anisotropy so the animated screen holds up at the tablet's
                    // persistent oblique viewing angle, same as the static-image path below
                    canvasTexture.minFilter = THREE.LinearMipmapLinearFilter;
                    canvasTexture.magFilter = THREE.LinearFilter;
                    canvasTexture.generateMipmaps = true;
                    canvasTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                    disposables.push(canvasTexture);

                    const drawFrame = (frame: (typeof frames)[0]) => {
                        if (
                            frame.dims.width === gifW &&
                            frame.dims.height === gifH &&
                            frame.dims.left === 0 &&
                            frame.dims.top === 0
                        ) {
                            const imgData = new ImageData(new Uint8ClampedArray(frame.patch), gifW, gifH);
                            gifCtx.putImageData(imgData, 0, 0);
                        } else {
                            if (frame.disposalType === 2) {
                                gifCtx.clearRect(0, 0, gifW, gifH);
                            }
                            patchCanvas.width = frame.dims.width;
                            patchCanvas.height = frame.dims.height;
                            const patchData = new ImageData(
                                new Uint8ClampedArray(frame.patch),
                                frame.dims.width,
                                frame.dims.height
                            );
                            patchCtx.putImageData(patchData, 0, 0);
                            gifCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);
                        }
                    };

                    drawFrame(frames[0]);
                    canvasTexture.needsUpdate = true;

                    screenMaterial.map = canvasTexture;
                    screenMaterial.color.setHex(0xffffff);
                    screenMaterial.needsUpdate = true;
                    setIsLoaded(true);

                    let currentFrame = 0;
                    let lastFrameTime = performance.now();
                    let gifDirection = 1;

                    gifPlayback = {
                        update: (time: number) => {
                            const delay = Math.max(30, frames[currentFrame].delay || 50);
                            if (time - lastFrameTime >= delay) {
                                if (boomerang) {
                                    if (currentFrame >= frames.length - 1) {
                                        gifDirection = -1;
                                    } else if (currentFrame <= 0) {
                                        gifDirection = 1;
                                    }
                                    currentFrame = Math.max(0, Math.min(frames.length - 1, currentFrame + gifDirection));
                                } else {
                                    currentFrame = (currentFrame + 1) % frames.length;
                                }
                                drawFrame(frames[currentFrame]);
                                canvasTexture.needsUpdate = true;
                                lastFrameTime = time;
                            }
                        },
                    };
                })
                .catch(() => {
                    setIsLoaded(true);
                });
        } else {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
                src,
                (texture) => {
                    if (isCancelled) return;
                    disposables.push(texture);
                    texture.colorSpace = THREE.SRGBColorSpace;
                    // Mipmaps + anisotropy are essential here: the screen is viewed at a
                    // persistent oblique angle (unlike the flat CSS mockups), and a single
                    // non-mipmapped bilinear tap looks noticeably blurrier at that kind of angle
                    texture.minFilter = THREE.LinearMipmapLinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    texture.generateMipmaps = true;
                    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

                    screenMaterial.map = texture;
                    screenMaterial.color.setHex(0xffffff);
                    screenMaterial.needsUpdate = true;
                    setIsLoaded(true);
                },
                undefined,
                () => {
                    setIsLoaded(true);
                }
            );
        }

        // Initial resting posture: straight upright vertically, angled horizontally facing text
        tabletGroup.scale.set(1.0, 1.0, 1.0);
        tabletGroup.rotation.set(0.0, initialTiltY, 0.0);
        scene.add(tabletGroup);

        // 5. Interactive 3D Controls (Desktop Hover-Tracking + Mobile Touch Drag)
        let isPointerDown = false;
        let isHovering = false;
        let startPointer = { x: 0, y: 0 };
        let velocity = { x: 0, y: 0 };
        let didDragMove = false;

        let targetRotX = 0.0;
        let targetRotY = initialTiltY;

        const onPointerDown = (e: PointerEvent) => {
            isPointerDown = true;
            didDragMove = false;
            startPointer = { x: e.clientX, y: e.clientY };
            velocity = { x: 0, y: 0 };
            try {
                container.setPointerCapture(e.pointerId);
            } catch { }
        };

        const onPointerMove = (e: PointerEvent) => {
            if (isPointerDown) {
                const deltaX = e.clientX - startPointer.x;
                const deltaY = e.clientY - startPointer.y;

                if (Math.hypot(deltaX, deltaY) > 4) {
                    didDragMove = true;
                }

                const sensitivity = e.pointerType === "mouse" ? 0.007 : 0.0055;
                const rotY = deltaX * sensitivity;
                const rotX = deltaY * sensitivity;

                targetRotY = Math.max(-0.48, Math.min(0.48, targetRotY + rotY));
                targetRotX = Math.max(-0.22, Math.min(0.22, targetRotX + rotX));

                velocity = { x: rotX, y: rotY };
                startPointer = { x: e.clientX, y: e.clientY };
            } else if (e.pointerType === "mouse") {
                // Desktop Mouse Hover Tilt: symmetric threshold centered from flat (0)
                isHovering = true;
                const rect = container.getBoundingClientRect();
                const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
                const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1

                const maxTiltY = 0.40;
                const maxTiltX = 0.20;
                targetRotY = normX * maxTiltY;
                targetRotX = -normY * maxTiltX;
            }
        };

        const onPointerLeave = (e: PointerEvent) => {
            if (e.pointerType === "mouse" && !isPointerDown) {
                isHovering = false;
                targetRotX = 0.0;
                targetRotY = initialTiltY;
            }
        };

        const onPointerUp = (e: PointerEvent) => {
            if (!isPointerDown) return;
            isPointerDown = false;
            try {
                container.releasePointerCapture(e.pointerId);
            } catch { }
            if (!didDragMove && onClick) {
                onClick();
            }
            if (!isHovering) {
                targetRotX = 0.0;
                targetRotY = initialTiltY;
            }
        };

        const onClickCapture = (e: MouseEvent) => {
            if (didDragMove) {
                e.preventDefault();
                e.stopPropagation();
                didDragMove = false;
            }
        };

        container.addEventListener("pointerdown", onPointerDown);
        container.addEventListener("pointermove", onPointerMove);
        container.addEventListener("pointerleave", onPointerLeave);
        container.addEventListener("pointerup", onPointerUp);
        container.addEventListener("pointercancel", onPointerUp);
        container.addEventListener("click", onClickCapture, { capture: true });

        // 6. Animation Loop (Smooth spring-lerp + gentle organic float)
        const startTime = performance.now();

        const animate = () => {
            if (!isIntersecting) {
                animationFrameId = 0;
                return;
            }
            animationFrameId = requestAnimationFrame(animate);
            const time = (performance.now() - startTime) * 0.001;

            if (isPointerDown) {
                tabletGroup.rotation.x += (targetRotX - tabletGroup.rotation.x) * 0.25;
                tabletGroup.rotation.y += (targetRotY - tabletGroup.rotation.y) * 0.25;
            } else {
                velocity.x *= 0.88;
                velocity.y *= 0.88;
                targetRotX = Math.max(-0.22, Math.min(0.22, targetRotX + velocity.x));
                targetRotY = Math.max(-0.48, Math.min(0.48, targetRotY + velocity.y));

                const currentTargetX = isHovering ? targetRotX : 0.0;
                const currentTargetY = isHovering ? targetRotY : initialTiltY;

                const lerpSpeed = isHovering ? 0.12 : 0.055;
                tabletGroup.rotation.x += (currentTargetX - tabletGroup.rotation.x) * lerpSpeed;
                tabletGroup.rotation.y += (currentTargetY - tabletGroup.rotation.y) * lerpSpeed;

                tabletGroup.position.y = Math.sin(time * 1.5) * 0.07;
            }

            if (gifPlayback) {
                gifPlayback.update(performance.now());
            }

            if (videoTexture && videoElement && !videoElement.paused && videoElement.readyState >= 2) {
                videoTexture.needsUpdate = true;
            }

            renderer.render(scene, camera);
        };

        const startLoop = () => {
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(animate);
            }
            if (videoElement && videoElement.paused) {
                videoElement.muted = true;
                videoElement.play().catch(() => {});
            }
        };

        const stopLoop = () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = 0;
            }
            if (videoElement && !videoElement.paused) {
                videoElement.pause();
            }
        };

        // 7. Visibility Intersection Observer (pauses rendering and video decoding when off-screen)
        const intersectionObserver = new IntersectionObserver(
            ([entry]) => {
                isIntersecting = entry.isIntersecting;
                if (isIntersecting) {
                    startLoop();
                } else {
                    stopLoop();
                }
            },
            { rootMargin: "100px 0px" }
        );
        intersectionObserver.observe(container);

        // Resume playback if tab was hidden and becomes visible again
        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                if (videoElement && videoElement.paused && isIntersecting) {
                    videoElement.muted = true;
                    videoElement.play().catch(() => {});
                }
            } else {
                if (videoElement && !videoElement.paused) {
                    videoElement.pause();
                }
            }
        };
        document.addEventListener("visibilitychange", onVisibilityChange);

        // 8. Resize Observer
        const resizeObserver = new ResizeObserver(() => {
            if (!container) return;
            const newW = container.clientWidth || 580;
            const newH = container.clientHeight || 400;
            updateCameraDistance(newW, newH);
            const newCanvasW = Math.round(newW * (1 + BLEED * 2));
            const newCanvasH = Math.round(newH * (1 + BLEED * 2));
            renderer.setSize(newCanvasW, newCanvasH);
        });
        resizeObserver.observe(container);

        // 9. Cleanup on Unmount
        return () => {
            isCancelled = true;
            intersectionObserver.disconnect();
            stopLoop();
            if (removeGestureListeners) {
                removeGestureListeners();
                removeGestureListeners = null;
            }
            document.removeEventListener("visibilitychange", onVisibilityChange);
            if (videoElement) {
                videoElement.pause();
                videoElement.removeAttribute("src");
                videoElement.load();
                videoElement = null;
            }
            resizeObserver.disconnect();
            container.removeEventListener("pointerdown", onPointerDown);
            container.removeEventListener("pointermove", onPointerMove);
            container.removeEventListener("pointerleave", onPointerLeave);
            container.removeEventListener("pointerup", onPointerUp);
            container.removeEventListener("pointercancel", onPointerUp);
            container.removeEventListener("click", onClickCapture, { capture: true });

            disposables.forEach((d) => d.dispose());
            renderer.dispose();
        };
    }, [isInView, src, color, initialTiltY, onClick]);

    return (
        <div
            ref={containerRef}
            className={`group relative mx-auto flex items-center justify-center cursor-grab active:cursor-grabbing select-none w-full h-full touch-none overflow-visible ${className}`}
        >
            {isInView && (
                <canvas
                    ref={canvasRef}
                    className="absolute top-[-12%] left-[-12%] w-[124%] h-[124%] block pointer-events-none overflow-visible"
                />
            )}

            {(!isLoaded || !isInView) && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                </div>
            )}
        </div>
    );
}
