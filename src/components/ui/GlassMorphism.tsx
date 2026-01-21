// src/components/ui/GlassMorphism.tsx
import { ReactNode } from "react";

export const GlassMorphism = ({ children }: { children: ReactNode }) => {
    return (
        <div className="relative rounded-full p-4 backdrop-blur-md bg-white/10 border border-white/20 shadow-lg">
            {/* Gradient overlay */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-white/5"></div>
            </div>

            {/* Children content */}
            <div className="flex justify-between w-full">{children}</div>
        </div>
    );
};
