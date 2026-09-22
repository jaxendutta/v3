import { useRef, useState, useEffect } from "react";

/**
 * A hook that measures multi-line wrapped text inside an inline-level element (e.g. <a>, <span>)
 * and calculates the exact visual width of the widest rendered line.
 *
 * This overcomes the standard CSS shrink-wrap limitation where text containers
 * with `width: fit-content` stay locked to available space when multi-line text wraps,
 * leaving large unwanted phantom gaps.
 *
 * @param dependency Any value that changes the text content or styling (e.g. label)
 * @param breakpoint The max screen width (in px) under which to apply tight wrapping (default 768)
 */
export function useTightWrappedWidth<T extends HTMLElement = HTMLAnchorElement>(
    dependency: unknown,
    breakpoint = 768
) {
    const ref = useRef<T>(null);
    const [wrappedWidth, setWrappedWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const measure = () => {
            if (window.innerWidth >= breakpoint) {
                setWrappedWidth(undefined);
                return;
            }

            const wrapper = el.parentElement;

            // 1. Temporarily clear inline maxWidth so the browser calculates natural word wrap
            // in the full available space without being artificially constrained.
            if (wrapper) wrapper.style.maxWidth = "none";
            el.style.maxWidth = "none";

            // 2. Force synchronous reflow to ensure natural layout with maxWidth="none"
            void (wrapper?.offsetWidth || el.offsetWidth);

            // 3. Inspect the rendered text fragments
            const range = document.createRange();
            range.selectNodeContents(el);
            const rects = Array.from(range.getClientRects()).filter(
                (r) => r.width > 0 && r.height > 0
            );

            if (rects.length > 0) {
                // Group rects into visual lines based on vertical overlap
                const lineGroups: { top: number; bottom: number; left: number; right: number }[] = [];
                for (const r of rects) {
                    const match = lineGroups.find((g) => {
                        const overlap = Math.min(g.bottom, r.bottom) - Math.max(g.top, r.top);
                        const minHeight = Math.min(g.bottom - g.top, r.height);
                        return overlap > minHeight * 0.4;
                    });

                    if (match) {
                        match.left = Math.min(match.left, r.left);
                        match.right = Math.max(match.right, r.right);
                        match.top = Math.min(match.top, r.top);
                        match.bottom = Math.max(match.bottom, r.bottom);
                    } else {
                        lineGroups.push({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });
                    }
                }

                if (lineGroups.length > 1) {
                    // Multi-line wrapped text: determine the widest rendered line
                    const lineWidths = lineGroups.map((g) => g.right - g.left);
                    const maxLineWidth = Math.ceil(Math.max(...lineWidths));

                    if (maxLineWidth > 0) {
                        // Dynamically determine el's horizontal padding & border
                        const computed = window.getComputedStyle(el);
                        const pl = parseFloat(computed.paddingLeft) || 0;
                        const pr = parseFloat(computed.paddingRight) || 0;
                        const bl = parseFloat(computed.borderLeftWidth) || 0;
                        const br = parseFloat(computed.borderRightWidth) || 0;
                        const elExtra = pl + pr + bl + br;

                        // Add a safe 6px subpixel buffer so natural line wrapping doesn't break
                        const targetWidth = Math.ceil(maxLineWidth + elExtra + 6);

                        if (wrapper) wrapper.style.maxWidth = `${targetWidth}px`;
                        setWrappedWidth(targetWidth);
                        return;
                    }
                }
            }

            // Single line text or no wrap needed: let natural fit-content handle it
            if (wrapper) wrapper.style.maxWidth = "";
            setWrappedWidth(undefined);
        };

        measure();

        // Re-measure when web fonts finish loading, as font metrics can change line lengths
        if (typeof document !== "undefined" && document.fonts) {
            document.fonts.ready.then(measure);
        }

        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [dependency, breakpoint]);

    return { ref, wrappedWidth };
}
