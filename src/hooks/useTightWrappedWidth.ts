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

            // Temporarily clear inline maxWidth so the browser calculates natural word wrap
            const wrapper = el.parentElement;
            if (wrapper) wrapper.style.maxWidth = "none";

            const range = document.createRange();
            range.selectNodeContents(el);
            const rects = Array.from(range.getClientRects()).filter(
                (r) => r.width > 0 && r.height > 0
            );

            if (rects.length > 0) {
                // Group inline rects into visual lines by vertical coordinate
                const lineGroups: { top: number; left: number; right: number }[] = [];
                for (const r of rects) {
                    const match = lineGroups.find(
                        (g) => Math.abs(g.top - r.top) < r.height * 0.5
                    );
                    if (match) {
                        match.left = Math.min(match.left, r.left);
                        match.right = Math.max(match.right, r.right);
                    } else {
                        lineGroups.push({ top: r.top, left: r.left, right: r.right });
                    }
                }

                if (lineGroups.length > 1) {
                    // Multi-line wrapped text: determine the widest rendered line
                    const lineWidths = lineGroups.map((g) => g.right - g.left);
                    const maxLineWidth = Math.ceil(Math.max(...lineWidths));
                    if (maxLineWidth > 0) {
                        const targetWidth = maxLineWidth + 8;
                        if (wrapper) wrapper.style.maxWidth = `${targetWidth}px`;
                        setWrappedWidth(targetWidth);
                        return;
                    }
                }
            }

            if (wrapper) wrapper.style.maxWidth = "";
            setWrappedWidth(undefined);
        };

        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [dependency, breakpoint]);

    return { ref, wrappedWidth };
}
