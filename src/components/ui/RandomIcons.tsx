import {
    GiAirBalloon,
    GiBrassEye,
    GiCircleSparks,
    GiDrakkar,
    GiEclipse,
    GiEclipseFlare,
    GiFalconMoon,
    GiGiantSquid,
    GiGreekSphinx,
    GiOrbital,
    GiPaperBoat,
    GiSemiClosedEye,
    GiShinyIris,
    GiSixEyes,
    GiStarSattelites,
    GiSurroundedEye,
    GiTrojanHorse,
} from "react-icons/gi";
import { IconType } from "react-icons";
import { useEffect, useState } from "react";

const GAME_ICONS = [
    GiEclipseFlare,
    GiCircleSparks,
    GiStarSattelites,
    GiShinyIris,
    GiOrbital,
    GiEclipse,
    GiFalconMoon,
    GiGiantSquid,
    GiBrassEye,
    GiSixEyes,
    GiSurroundedEye,
    GiSemiClosedEye,
    GiDrakkar,
    GiTrojanHorse,
    GiGreekSphinx,
    GiPaperBoat,
    GiAirBalloon

];

export const getRandomIcons = (count: number = 4): IconType[] => {
    const uniqueIcons = new Set<IconType>();
    // Prevent infinite loop if count is larger than available icons
    const limit = Math.min(count, GAME_ICONS.length);

    while (uniqueIcons.size < limit) {
        const randomIndex = Math.floor(Math.random() * GAME_ICONS.length);
        uniqueIcons.add(GAME_ICONS[randomIndex]);
    }
    return Array.from(uniqueIcons);
};

export function RandomIconsLoader({ count = 3, shuffleCount = 16, interval = 100 }) {
    const [shuffle, setShuffle] = useState(0);
    // Math.random() picks a different icon set on the server than on the
    // client, so rendering it immediately mismatches during hydration.
    // Render nothing until mounted (identical on server and the client's
    // first pass), then let the shuffle animation take over client-side.
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || shuffle >= shuffleCount) return;
        const timer = setTimeout(() => setShuffle(s => s + 1), interval);
        return () => clearTimeout(timer);
    }, [mounted, shuffle, shuffleCount, interval]);

    if (!mounted) return null;
    return <RandomIcons count={count} key={shuffle} />;
}

export interface RandomIconsProps {
    count?: number;
}

export default function RandomIcons({ count = 4, }: RandomIconsProps) {
    const icons = getRandomIcons(count);
    return icons.map((Icon: IconType, index) => (
        <Icon key={index} className="mx-0.5" />
    ));
}
