"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type IPhoneFinish = "cosmic-orange" | "natural-titanium" | "black-titanium" | "silver";

interface IPhone3DCanvasProps {
    src: string;
    alt?: string;
    className?: string;
    color?: IPhoneFinish;
    initialTiltY?: number;
    initialTiltZ?: number;
    onClick?: () => void;
}

const FINISH_COLORS: Record<
    IPhoneFinish,
    {
        body: number;
        back: number;
        plateau: number;
        ring: number;
        logo: number;
    }
> = {
    "cosmic-orange": {
        body: 0xcd7442, // Warm desert/cosmic titanium
        back: 0xc46938, // Silky frosted warm amber rear glass
        plateau: 0xb85d2c, // Camera island plateau
        ring: 0xdc814b, // Polished titanium lens rings
        logo: 0xd57a44,
    },
    "natural-titanium": {
        body: 0x8a8781,
        back: 0x7c7974,
        plateau: 0x706e69,
        ring: 0x9e9b95,
        logo: 0x918e88,
    },
    "black-titanium": {
        body: 0x27282b,
        back: 0x1f2022,
        plateau: 0x191a1b,
        ring: 0x3e4044,
        logo: 0x333538,
    },
    silver: {
        body: 0xd8dbe0,
        back: 0xced2d8,
        plateau: 0xc2c6cc,
        ring: 0xe6e9ee,
        logo: 0xd4d8de,
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
// Prevents Three.js ShapeGeometry from clamping / repeating texture coordinates
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

export default function IPhone3DCanvas({
    src,
    alt = "Interactive 3D iPhone",
    className = "",
    color = "cosmic-orange",
    initialTiltY = -0.16,
    initialTiltZ = 0.0,
    onClick,
}: IPhone3DCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        let animationFrameId: number;
        // TWEAK HERE: BLEED controls the invisible overflow canvas margin around the container (0.16 = 16% on each side)
        const BLEED = 0.16;
        const width = container.clientWidth || 300;
        const height = container.clientHeight || 580;

        // 1. Three.js Scene & Camera Setup
        const scene = new THREE.Scene();
        const initialAspect = width / height;
        const camera = new THREE.PerspectiveCamera(40, initialAspect, 0.1, 100);

        // Guarantee phone height stays strictly within the container div bounds (90% fill, 5% padding top and bottom)
        const updateCameraDistance = (w: number, h: number) => {
            const aspect = w / h;
            camera.aspect = aspect;
            const verticalFill = 0.90;
            const phoneH = 5.80;
            const phoneW = 2.74;
            const hContainer = phoneH / verticalFill;
            const hCanvas = hContainer * (1 + BLEED * 2);
            const baseDist = hCanvas / (2 * Math.tan((camera.fov * Math.PI) / 360));
            const minAspect = phoneW / hContainer;
            if (aspect < minAspect) {
                camera.position.set(0, 0, baseDist * (minAspect / aspect));
            } else {
                camera.position.set(0, 0, baseDist);
            }
            camera.updateProjectionMatrix();
        };
        updateCameraDistance(width, height);

        // 2. WebGL Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
        });
        const canvasW = Math.round(width * (1 + BLEED * 2));
        const canvasH = Math.round(height * (1 + BLEED * 2));
        renderer.setSize(canvasW, canvasH);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;

        // 3. Studio Lighting Rig (Soft, diffused illumination)
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
        scene.add(ambientLight);

        // Key light: gentle diffused light
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
        keyLight.position.set(5, 7, 6);
        scene.add(keyLight);

        // Back/Rim light: soft edge definition
        const rimLight = new THREE.DirectionalLight(0xffecd6, 1.2);
        rimLight.position.set(-6, 3, -7);
        scene.add(rimLight);

        // Warm bounce light from below
        const fillLight = new THREE.DirectionalLight(0xff9955, 0.8);
        fillLight.position.set(4, -5, 3);
        scene.add(fillLight);

        // Soft opposite fill
        const leftFill = new THREE.DirectionalLight(0xdde8ff, 0.9);
        leftFill.position.set(-5, -2, 4);
        scene.add(leftFill);

        // 4. Phone Group & Dimensions (19.5 : 9 iPhone Pro geometry)
        const finish = FINISH_COLORS[color] ?? FINISH_COLORS["cosmic-orange"];
        const phoneGroup = new THREE.Group();
        phoneGroup.position.y = 0;

        // Exact screen geometry based on 1179 x 2556 ratio (ultra-thin modern iPhone bezel)
        const screenHeight = 5.68;
        const screenWidth = screenHeight * (1179 / 2556); // ~2.620
        const screenRadius = 0.40;

        // Phone body dimensions with ultra-thin ~1.1mm scale bezel
        const phoneWidth = 2.74;
        const phoneHeight = 5.80;
        const phoneThickness = 0.26;
        const cornerRadius = 0.46;

        const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

        // A. Outer Titanium Chassis
        const bodyShape = createRoundedRectShape(phoneWidth, phoneHeight, cornerRadius);
        const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, {
            depth: phoneThickness,
            bevelEnabled: true,
            bevelSegments: 8,
            steps: 1,
            bevelSize: 0.028,
            bevelThickness: 0.028,
            curveSegments: 24,
        });
        bodyGeometry.center();
        disposables.push(bodyGeometry);

        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: finish.body,
            metalness: 0.72,
            roughness: 0.48, // Brushed metallic titanium
        });
        disposables.push(bodyMaterial);
        const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        phoneGroup.add(bodyMesh);

        // Hardware Side Details on the Titanium Edges
        const buttonMat = new THREE.MeshStandardMaterial({
            color: finish.ring,
            metalness: 0.82,
            roughness: 0.32,
        });
        disposables.push(buttonMat);

        // Left Edge Action Button (near the top)
        const actionBtnGeom = new THREE.BoxGeometry(0.05, 0.30, phoneThickness * 0.4);
        disposables.push(actionBtnGeom);
        const actionBtn = new THREE.Mesh(actionBtnGeom, buttonMat);
        actionBtn.position.set(-(phoneWidth / 2 + 0.025), 1.75, 0);
        phoneGroup.add(actionBtn);

        // Left Edge Volume Up / Volume Down Rockers
        [{ y: 1.05, h: 0.46 }, { y: 0.48, h: 0.46 }].forEach(({ y, h }) => {
            const volGeom = new THREE.BoxGeometry(0.05, h, phoneThickness * 0.4);
            disposables.push(volGeom);
            const volBtn = new THREE.Mesh(volGeom, buttonMat);
            volBtn.position.set(-(phoneWidth / 2 + 0.025), y, 0);
            phoneGroup.add(volBtn);
        });

        // Right Edge Power / Side Button
        const powerBtnGeom = new THREE.BoxGeometry(0.05, 0.62, phoneThickness * 0.4);
        disposables.push(powerBtnGeom);
        const powerBtn = new THREE.Mesh(powerBtnGeom, buttonMat);
        powerBtn.position.set(phoneWidth / 2 + 0.025, 0.95, 0);
        phoneGroup.add(powerBtn);

        // B. Back Frosted Glass Panel
        const backShape = createRoundedRectShape(phoneWidth - 0.04, phoneHeight - 0.04, cornerRadius - 0.02);
        const backGeometry = new THREE.ShapeGeometry(backShape, 24);
        normalizeShapeUVs(backGeometry, phoneWidth - 0.04, phoneHeight - 0.04);
        disposables.push(backGeometry);

        const backMaterial = new THREE.MeshStandardMaterial({
            color: finish.back,
            metalness: 0.10,
            roughness: 0.86, // Silky frosted matte rear glass
        });
        disposables.push(backMaterial);
        const backMesh = new THREE.Mesh(backGeometry, backMaterial);
        backMesh.position.z = -(phoneThickness / 2 + 0.046);
        backMesh.rotation.y = Math.PI; // Faces backward
        phoneGroup.add(backMesh);

        // Back Apple Emblem
        const logoShape = new THREE.Shape();
        logoShape.absarc(0, 0.05, 0.28, 0, Math.PI * 2, false);
        const logoGeom = new THREE.ShapeGeometry(logoShape, 24);
        disposables.push(logoGeom);
        const logoMat = new THREE.MeshStandardMaterial({
            color: finish.logo,
            metalness: 0.95,
            roughness: 0.12,
        });
        disposables.push(logoMat);
        const logoMesh = new THREE.Mesh(logoGeom, logoMat);
        logoMesh.position.set(0, 0, -(phoneThickness / 2 + 0.048));
        logoMesh.rotation.y = Math.PI;
        phoneGroup.add(logoMesh);

        // C. Triple Camera Island on Back
        const cameraIslandGroup = new THREE.Group();
        const islandSize = 1.36;
        const islandRadius = 0.34;
        const islandShape = createRoundedRectShape(islandSize, islandSize, islandRadius);
        const islandGeometry = new THREE.ExtrudeGeometry(islandShape, {
            depth: 0.065,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 1,
            bevelSize: 0.025,
            bevelThickness: 0.025,
            curveSegments: 20,
        });
        islandGeometry.center();
        disposables.push(islandGeometry);

        const islandMaterial = new THREE.MeshStandardMaterial({
            color: finish.plateau,
            metalness: 0.28,
            roughness: 0.68, // Matte camera island
        });
        disposables.push(islandMaterial);
        const islandMesh = new THREE.Mesh(islandGeometry, islandMaterial);
        cameraIslandGroup.add(islandMesh);

        // 3 Camera Lenses
        const lensPositions = [
            [-0.32, 0.32],
            [-0.32, -0.32],
            [0.32, 0.0],
        ];

        lensPositions.forEach(([lx, ly]) => {
            const collarGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 32);
            disposables.push(collarGeom);
            const collarMat = new THREE.MeshStandardMaterial({
                color: finish.ring,
                metalness: 0.80,
                roughness: 0.38, // Satin machined titanium ring
            });
            disposables.push(collarMat);
            const collar = new THREE.Mesh(collarGeom, collarMat);
            collar.rotation.x = Math.PI / 2;
            collar.position.set(lx, ly, 0.055);
            cameraIslandGroup.add(collar);

            const glassGeom = new THREE.CylinderGeometry(0.20, 0.20, 0.065, 32);
            disposables.push(glassGeom);
            const glassMat = new THREE.MeshPhysicalMaterial({
                color: 0x05070c,
                metalness: 0.1,
                roughness: 0.05,
                reflectivity: 0.9,
            });
            disposables.push(glassMat);
            const glass = new THREE.Mesh(glassGeom, glassMat);
            glass.rotation.x = Math.PI / 2;
            glass.position.set(lx, ly, 0.058);
            cameraIslandGroup.add(glass);
        });

        // Flash and LiDAR sensor
        const flashGeom = new THREE.CircleGeometry(0.085, 20);
        disposables.push(flashGeom);
        const flashMat = new THREE.MeshBasicMaterial({ color: 0xfffae2 });
        disposables.push(flashMat);
        const flashMesh = new THREE.Mesh(flashGeom, flashMat);
        flashMesh.position.set(0.32, 0.34, 0.045);
        cameraIslandGroup.add(flashMesh);

        const lidarGeom = new THREE.CircleGeometry(0.065, 20);
        disposables.push(lidarGeom);
        const lidarMat = new THREE.MeshBasicMaterial({ color: 0x111317 });
        disposables.push(lidarMat);
        const lidarMesh = new THREE.Mesh(lidarGeom, lidarMat);
        lidarMesh.position.set(0.32, -0.34, 0.045);
        cameraIslandGroup.add(lidarMesh);

        cameraIslandGroup.position.set(-0.62, 1.96, -(phoneThickness / 2 + 0.075));
        cameraIslandGroup.rotation.y = Math.PI;
        phoneGroup.add(cameraIslandGroup);

        // D. Front Black Glass Bezel (Solid black border framing the screen)
        const frontGlassShape = createRoundedRectShape(phoneWidth - 0.02, phoneHeight - 0.02, cornerRadius - 0.01);
        const frontGlassGeom = new THREE.ShapeGeometry(frontGlassShape, 32);
        disposables.push(frontGlassGeom);
        const frontGlassMat = new THREE.MeshBasicMaterial({ color: 0x050608 });
        disposables.push(frontGlassMat);
        const frontGlassMesh = new THREE.Mesh(frontGlassGeom, frontGlassMat);
        frontGlassMesh.position.z = phoneThickness / 2 + 0.045;
        phoneGroup.add(frontGlassMesh);

        // Active Display Screen
        const screenShape = createRoundedRectShape(screenWidth, screenHeight, screenRadius);
        const screenGeometry = new THREE.ShapeGeometry(screenShape, 32);
        normalizeShapeUVs(screenGeometry, screenWidth, screenHeight);
        disposables.push(screenGeometry);

        // Initial placeholder screen (dark OLED glass)
        const screenMaterial = new THREE.MeshBasicMaterial({
            color: 0x0a0c10,
            // Render the screenshot as-authored; the scene's ACES filmic tone curve is meant
            // for lit chassis surfaces, not for a flat UI screenshot texture, and was dulling it
            toneMapped: false,
        });
        disposables.push(screenMaterial);

        const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
        screenMesh.position.z = phoneThickness / 2 + 0.046;
        phoneGroup.add(screenMesh);

        // Load screenshot texture
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            src,
            (texture) => {
                disposables.push(texture);
                texture.colorSpace = THREE.SRGBColorSpace;
                // Mipmaps + anisotropy are essential here: the screen is viewed at a persistent
                // oblique angle (unlike the flat CSS mockups), and a single non-mipmapped
                // bilinear tap looks noticeably blurrier at that kind of grazing angle
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
                // If texture fails to load, mark loaded so spinner dismisses
                setIsLoaded(true);
            }
        );

        // E. Front Dynamic Island Pill (slightly larger authentic proportion)
        const islandPillShape = createRoundedRectShape(0.74, 0.22, 0.11);
        const islandPillGeom = new THREE.ShapeGeometry(islandPillShape, 20);
        disposables.push(islandPillGeom);
        const islandPillMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        disposables.push(islandPillMat);
        const dynamicIslandMesh = new THREE.Mesh(islandPillGeom, islandPillMat);
        dynamicIslandMesh.position.set(0, screenHeight / 2 - 0.20, phoneThickness / 2 + 0.047);
        phoneGroup.add(dynamicIslandMesh);

        // F. iOS Home Indicator Bar (Dark/Black swipe-up bottom pill)
        const homeBarShape = createRoundedRectShape(0.96, 0.048, 0.024);
        const homeBarGeom = new THREE.ShapeGeometry(homeBarShape, 16);
        disposables.push(homeBarGeom);
        const homeBarMat = new THREE.MeshBasicMaterial({
            color: 0x141518,
            transparent: true,
            opacity: 0.90,
        });
        disposables.push(homeBarMat);
        const homeBarMesh = new THREE.Mesh(homeBarGeom, homeBarMat);
        homeBarMesh.position.set(0, -(screenHeight / 2) + 0.055, phoneThickness / 2 + 0.047);
        phoneGroup.add(homeBarMesh);

        // Initial resting angle: upright vertically, facing project text horizontally with playful idle roll
        phoneGroup.rotation.set(0.0, initialTiltY, initialTiltZ);
        scene.add(phoneGroup);

        // G. Side Contact Shadow — matches the flat draggable mockups' shadow convention
        // (dark near the object, fading away to its right, as if leaning against a surface)
        // rather than a shadow cast straight down onto a floor. Parented to phoneGroup so it
        // rotates and floats rigidly with the phone, the same way the CSS version's shadow
        // shares its parent's 3D transform instead of being independently animated.
        //
        // The soft edge is computed analytically in a fragment shader (a capsule signed-distance
        // field) rather than baked via CanvasRenderingContext2D's `filter` blur: iOS Safari only
        // gained ctx.filter support in 17.4, so on older/unsupported devices the blur silently
        // never applied, leaving a hard-edged, unblurred shape. A GLSL smoothstep has no such
        // compatibility gap — it's the same WebGL path already required to render the phone itself.
        const shadowCapsuleWidth = phoneWidth * 0.5;
        const shadowCapsuleHeight = phoneHeight * 0.8;
        const shadowBaseOpacity = 0.8;
        // The plane must be noticeably larger than the capsule shape it draws, or the feather
        // has nowhere to fade into before hitting the plane's own edge — same class of bug as
        // the earlier canvas-texture inset, just recurring in the shader version.
        const shadowMeshPadding = 1.3;
        const shadowUniforms = {
            uCapsuleWidth: { value: shadowCapsuleWidth },
            uCapsuleHeight: { value: shadowCapsuleHeight },
            uMeshWidth: { value: shadowCapsuleWidth * shadowMeshPadding },
            uMeshHeight: { value: shadowCapsuleHeight * shadowMeshPadding },
            uFeather: { value: 0.16 },
            uOpacity: { value: shadowBaseOpacity },
        };
        const shadowMaterial = new THREE.ShaderMaterial({
            uniforms: shadowUniforms,
            transparent: true,
            depthWrite: false,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float uCapsuleWidth;
                uniform float uCapsuleHeight;
                uniform float uMeshWidth;
                uniform float uMeshHeight;
                uniform float uFeather;
                uniform float uOpacity;
                void main() {
                    // Reconstruct local world-unit position across the (padded) plane, then test
                    // it against the smaller nominal capsule shape so there's real margin around
                    // the shape for the feather to fade into
                    vec2 p = (vUv - 0.5) * vec2(uMeshWidth, uMeshHeight);
                    float halfW = uCapsuleWidth * 0.5;
                    float bodyHalfH = max(uCapsuleHeight * 0.5 - halfW, 0.0);
                    float distY = max(abs(p.y) - bodyHalfH, 0.0);
                    float dist = length(vec2(p.x, distY)) - halfW;
                    float shapeAlpha = 1.0 - smoothstep(-uFeather, uFeather, dist);

                    // Dark near the phone (left edge), fading to transparent toward the right,
                    // matching the flat mockups' "leaning against a surface" CSS gradient.
                    // Anchored to the capsule's own width, not the padded plane's.
                    float t = clamp((p.x + halfW) / uCapsuleWidth, 0.0, 1.0);
                    float gradAlpha = mix(0.85, 0.42, smoothstep(0.0, 0.55, t));
                    gradAlpha = mix(gradAlpha, 0.0, smoothstep(0.55, 1.0, t));

                    gl_FragColor = vec4(0.0, 0.0, 0.0, shapeAlpha * gradAlpha * uOpacity);
                }
            `,
        });
        disposables.push(shadowMaterial);

        const shadowGeometry = new THREE.PlaneGeometry(1, 1);
        disposables.push(shadowGeometry);

        const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial);
        // Kept just inside the camera's bled viewport (see BLEED above) so the soft trailing
        // edge fades out on its own instead of being hard-cropped by the canvas boundary
        shadowMesh.position.set(phoneWidth / 2 - shadowCapsuleWidth * 0.001, -phoneHeight * 0.04, -0.35);
        shadowMesh.scale.set(shadowCapsuleWidth * shadowMeshPadding, shadowCapsuleHeight * shadowMeshPadding, 1);
        phoneGroup.add(shadowMesh);

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

                const sensitivity = e.pointerType === "mouse" ? 0.009 : 0.007;
                const rotY = deltaX * sensitivity;
                const rotX = deltaY * sensitivity;

                targetRotY = Math.max(-0.55, Math.min(0.55, targetRotY + rotY));
                targetRotX = Math.max(-0.24, Math.min(0.24, targetRotX + rotX));

                velocity = { x: rotX, y: rotY };
                startPointer = { x: e.clientX, y: e.clientY };
            } else if (e.pointerType === "mouse") {
                // Desktop Mouse Hover Tilt: symmetric threshold starting from flat (0)
                isHovering = true;
                const rect = container.getBoundingClientRect();
                const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
                const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1

                const maxTiltY = 0.48;
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

        // Capture click event so dragging does NOT trigger enclosing Link navigation
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
        const bobCenterY = 0.28;
        const bobAmplitude3D = 0.05;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const time = (performance.now() - startTime) * 0.001;

            if (isPointerDown) {
                // Direct snappy response while dragging
                phoneGroup.rotation.x += (targetRotX - phoneGroup.rotation.x) * 0.25;
                phoneGroup.rotation.y += (targetRotY - phoneGroup.rotation.y) * 0.25;
                phoneGroup.rotation.z += (0.0 - phoneGroup.rotation.z) * 0.25;
            } else {
                // Apply drag release inertia
                velocity.x *= 0.88;
                velocity.y *= 0.88;
                targetRotX = Math.max(-0.24, Math.min(0.24, targetRotX + velocity.x));
                targetRotY = Math.max(-0.55, Math.min(0.55, targetRotY + velocity.y));

                // Destination target: when hovering, tracks cursor; when idle, smoothly rests facing text with playful roll
                const currentTargetX = isHovering ? targetRotX : 0.0;
                const currentTargetY = isHovering ? targetRotY : initialTiltY;
                const currentTargetZ = isHovering ? 0.0 : initialTiltZ;

                // Smooth responsive spring lerp
                const lerpSpeed = isHovering ? 0.12 : 0.055;
                phoneGroup.rotation.x += (currentTargetX - phoneGroup.rotation.x) * lerpSpeed;
                phoneGroup.rotation.y += (currentTargetY - phoneGroup.rotation.y) * lerpSpeed;
                phoneGroup.rotation.z += (currentTargetZ - phoneGroup.rotation.z) * lerpSpeed;

                // Organic idle float resting higher to eliminate top empty space
                phoneGroup.position.y = bobCenterY + Math.sin(time * 1.5) * bobAmplitude3D;
            }

            // Shadow "depth": since the shadow is a rigid child of phoneGroup, its rotation and
            // position already track the phone's live tilt and bob for free. Only the
            // elevation-driven intensity needs to be computed by hand each frame.
            // 0 = phone at the lowest point of its idle bob (closest to the surface), 1 = highest
            const elevationT = THREE.MathUtils.clamp(
                (phoneGroup.position.y - (bobCenterY - bobAmplitude3D)) / (bobAmplitude3D * 2),
                0,
                1
            );

            // Mirrors the plain draggable image's CSS shadow: higher in the bob -> shadow
            // shrinks and lightens (further away); lower in the bob -> grows and darkens.
            // Capsule and plane sizes scale together so the padding margin (and thus the
            // feather) stays proportionally correct at every size.
            const elevationSpread = 1 - elevationT * 0.22;
            const capsuleWidthNow = shadowCapsuleWidth * elevationSpread;
            const capsuleHeightNow = shadowCapsuleHeight * elevationSpread;
            shadowMesh.scale.set(capsuleWidthNow * shadowMeshPadding, capsuleHeightNow * shadowMeshPadding, 1);
            shadowUniforms.uCapsuleWidth.value = capsuleWidthNow;
            shadowUniforms.uCapsuleHeight.value = capsuleHeightNow;
            shadowUniforms.uMeshWidth.value = capsuleWidthNow * shadowMeshPadding;
            shadowUniforms.uMeshHeight.value = capsuleHeightNow * shadowMeshPadding;
            shadowUniforms.uOpacity.value = Math.max(0.15, shadowBaseOpacity * (1 - elevationT * 0.45));

            renderer.render(scene, camera);
        };

        animate();

        // 7. Resize Observer
        const resizeObserver = new ResizeObserver(() => {
            if (!container) return;
            const newW = container.clientWidth || 300;
            const newH = container.clientHeight || 580;
            updateCameraDistance(newW, newH);
            const newCanvasW = Math.round(newW * (1 + BLEED * 2));
            const newCanvasH = Math.round(newH * (1 + BLEED * 2));
            renderer.setSize(newCanvasW, newCanvasH);
        });
        resizeObserver.observe(container);

        // 8. Cleanup on Unmount
        return () => {
            cancelAnimationFrame(animationFrameId);
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
    }, [src, color, initialTiltY, initialTiltZ, onClick]);

    return (
        <div
            ref={containerRef}
            className={`group relative mx-auto flex items-center justify-center cursor-grab active:cursor-grabbing select-none w-full h-full touch-none overflow-visible ${className}`}
        >
            <canvas
                ref={canvasRef}
                className="absolute top-[-16%] left-[-16%] w-[132%] h-[132%] block pointer-events-none overflow-visible"
            />

            {/* Loading Spinner */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                </div>
            )}
        </div>
    );
}
