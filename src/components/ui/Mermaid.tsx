"use client";

import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

// 1. Safe Global Init (No Variables here!)
mermaid.initialize({
    startOnLoad: false,
    theme: "base", // 'base' allows us to override variables
    securityLevel: "loose",
    fontFamily: "inherit",
});

interface MermaidProps {
    chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
    const [svg, setSvg] = useState<string>("");

    useEffect(() => {
        const renderChart = async () => {
            if (!chart) return;

            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

                // 2. Dynamic Color Resolution
                // We read the ACTUAL hex values from the DOM
                const style = getComputedStyle(document.documentElement);
                const foreground = style.getPropertyValue('--foreground').trim() || '#000000';
                const primary = style.getPropertyValue('--primary').trim() || '#ff0000';
                const background = style.getPropertyValue('--background').trim() || '#ffffff';

                // 3. Configure Mermaid for this render
                mermaid.mermaidAPI.initialize({
                    theme: 'base',
                    themeVariables: {
                        primaryColor: background,
                        primaryTextColor: foreground,
                        primaryBorderColor: foreground,
                        lineColor: foreground,
                        secondaryColor: background,
                        tertiaryColor: background,
                        mainBkg: 'transparent',
                        nodeBorder: foreground,
                        clusterBkg: 'transparent',
                        clusterBorder: foreground,
                        edgeLabelBackground: background,
                        actorBorder: foreground,
                        actorBkg: background,
                        actorTextColor: foreground,
                        signalColor: foreground,
                        signalTextColor: foreground,
                    }
                });

                const { svg } = await mermaid.render(id, chart);
                setSvg(svg);
            } catch (err) {
                console.error("Mermaid render error:", err);
            }
        };

        renderChart();
    }, [chart]);

    return (
        <div
            className="mermaid-chart flex justify-center my-8 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
