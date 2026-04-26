"use client";

import { useEffect } from "react";

export default function IOSRedirect({ pdfUrl }: { pdfUrl: string }) {
    useEffect(() => {
        // Safely detect iOS on the client (handles iPhones, and iPads pretending to be Macs)
        const isIOS =
            /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

        if (isIOS) {
            // location.replace swaps the current URL in the history stack, 
            // so the user can still use the back button to return to your site natively.
            window.location.replace(pdfUrl);
        }
    }, [pdfUrl]);

    // Render absolutely nothing
    return null;
}
