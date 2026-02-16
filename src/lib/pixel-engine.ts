export type PixelColor = string;

export interface PixelArtTrait {
    label: string;
    value: string;
}

export interface GeneratedPixelArt {
    id: number;
    svg: string;
    traits: PixelArtTrait[];
}

const GRID_SIZE = 32;

const PALETTES = {
    skin: [
        "#FFDBAC", "#F1C27D", "#E0AC69", "#8D5524", "#C68642",
        // 6 nuovi colori pelle
        "#FED7AA", "#D4A574", "#A67C52", "#6B4423", "#4A2511", "#2D1B13"
    ],
    hair: {
        Black: ["#090806", "#2D2926"],
        Brown: ["#2B1B10", "#3D2B1F"],
        Chestnut: ["#5C4033", "#7A5C41"],
        Blonde: ["#E6C17A", "#F3D692"],
        Green: ["#22C55E", "#4ADE80"],
        Orange: ["#EA580C", "#FB923C"]
    },
    background: {
        day: [
            // Sfondi diurni (chiari)
            "#D1D5DB", "#E5E7EB", "#F3F4F6", "#CBD5E1", "#E2E8F0",
            "#F1F5F9", "#D4D4D8", "#E4E4E7", "#F4F4F5", "#D4D4D4",
            "#E5E5E5", "#F5F5F5", "#D1D1D1", "#D6D3D1", "#E7E5E4",
            "#F5F5F4", "#CCCCCC", "#DDDDDD", "#EEEEEE", "#D9D9D9",
            "#C7D2FE", "#DDD6FE", "#FED7E2", "#FBCFE8", "#CFFAFE",
            "#D1FAE5", "#FEF3C7", "#FFEDD5", "#E2E8F0", "#F8FAFC",
            // 6 nuovi colori diurni
            "#BAE6FD", "#FEF9C3", "#FED7AA", "#E9D5FF", "#FBCFE8", "#D1FAE5",
            // Altri 5 colori unici
            "#FDE68A", "#99F6E4", "#FCA5A5", "#F0ABFC", "#E0F2FE"
        ],
        night: [
            // Sfondi notturni (scuri)
            "#0A0E27", "#0F172A", "#1E1B4B", "#1A1625", "#0C1222",
            "#0B1437", "#1C1B33", "#0D1B2A", "#111827", "#18181B",
            "#1E293B", "#312E81", "#1F2937", "#374151", "#1E3A8A",
            // 6 nuovi colori notturni
            "#0C0A1D", "#1A0B2E", "#0E1428", "#1B1340", "#0A1929", "#121063",
            // Altri 5 colori unici
            "#083344", "#052e16", "#310d20", "#164e63", "#581c87"
        ]
    },
    suits: [
        "#111827", "#1E293B", "#312E81", "#18181B", "#4A0404",
        "#0F172A", "#1E1B4B", "#2D064A", "#440307", "#064E3B",
        "#171717", "#262626", "#3B0764", "#701A75", "#020617",
        // 6 nuovi colori armatura
        "#1C1917", "#27272A", "#450A0A", "#4C0519", "#14532D", "#1E1B4B",
        // Altri 5 colori unici
        "#F87171", "#818CF8", "#F472B6", "#34D399", "#60A5FA"
    ],
    neon: [
        "#00F2FF", "#FF00FF", "#39FF14", "#FFD700", "#FF4500",
        "#A78BFA", "#F43F5E", "#0EA5E9", "#10B981", "#EC4899",
        "#8B5CF6", "#06B6D4", "#D946EF", "#FACC15", "#FB923C",
        "#4ADE80", "#2DD4BF", "#F472B6", "#6366F1", "#EF4444"
    ]
};

export function generateCyberPixel(id: number): GeneratedPixelArt {
    let seed = id;
    const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    const pixels: Map<string, string> = new Map();
    const traitList: PixelArtTrait[] = [];

    const drawPixel = (x: number, y: number, color: string) => {
        const floorX = Math.floor(x);
        const floorY = Math.floor(y);
        if (floorX >= 0 && floorX < GRID_SIZE && floorY >= 0 && floorY < GRID_SIZE) {
            pixels.set(`${floorX},${floorY}`, color);
        }
    };

    // Helper for symmetric drawing
    const drawSymmetric = (offsetX: number, y: number, color: string) => {
        drawPixel(midX - offsetX, y, color);
        drawPixel(midX + offsetX, y, color);
    };

    function adjustColor(hex: string, amt: number) {
        const num = parseInt(hex.replace("#", ""), 16);
        const R = Math.max(0, Math.min(255, (num >> 16) + amt));
        const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
        const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
        return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }

    // Calculate relative luminance for contrast checking
    function getLuminance(hex: string): number {
        const num = parseInt(hex.replace("#", ""), 16);
        const r = (num >> 16) / 255;
        const g = ((num >> 8) & 0x00FF) / 255;
        const b = (num & 0x0000FF) / 255;

        const [rs, gs, bs] = [r, g, b].map(c =>
            c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        );

        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    // Check if two colors have sufficient contrast (WCAG AA standard: 4.5:1)
    function hasGoodContrast(color1: string, color2: string): boolean {
        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);
        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);
        const contrast = (lighter + 0.05) / (darker + 0.05);
        return contrast >= 3.0; // Using 3.0 for pixel art (more lenient than WCAG 4.5)
    }

    // --- State Selection with Contrast Guarantee ---
    const isWoman = random() > 0.5;

    // --- Rarity Check (Mythic: 1% chance) ---
    const isMythic = random() < 0.01;

    // 1. Select background first
    const isNight = random() > 0.5;
    const bgType = isNight ? "night" : "day";
    const bgPalette = isNight ? PALETTES.background.night : PALETTES.background.day;
    let bgColor = isMythic ? "#FFD700" : bgPalette[Math.floor(random() * bgPalette.length)];

    // Stars (only for night, 70% chance)
    const hasStars = !isMythic && isNight && random() > 0.3;

    // Rain (both day and night, 40% chance)
    const hasRain = !isMythic && random() > 0.6;

    // 2. Select skin color with good contrast to background
    let skinColor = "";
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        const candidate = PALETTES.skin[Math.floor(random() * PALETTES.skin.length)];
        if (hasGoodContrast(candidate, bgColor)) {
            skinColor = candidate;
            break;
        }
        attempts++;
    }

    // Fallback: if no good skin color found, force contrasting background
    if (!skinColor) {
        bgColor = isNight ? "#0A0E27" : "#F3F4F6"; // Very dark or very light
        skinColor = PALETTES.skin[Math.floor(random() * PALETTES.skin.length)];
    }

    const skinDark = adjustColor(skinColor, -30);

    // 3. Select suit color
    let suitColor = "";
    if (isMythic) {
        suitColor = "#B9F2FF"; // Diamond color
        traitList.push({ label: "Rarity", value: "Mythic" });
    } else {
        attempts = 0;
        while (attempts < maxAttempts) {
            const candidate = PALETTES.suits[Math.floor(random() * PALETTES.suits.length)];
            if (hasGoodContrast(candidate, bgColor)) {
                suitColor = candidate;
                break;
            }
            attempts++;
        }
    }

    // Fallback: use a very dark suit if nothing works
    if (!suitColor) {
        suitColor = "#0F172A";
    }

    const suitLight = isMythic ? "#E0FBFF" : adjustColor(suitColor, 30);
    const neonColor = isMythic ? "#FFFFFF" : PALETTES.neon[Math.floor(random() * PALETTES.neon.length)];

    const type = isWoman ? "Woman" : "Man";
    traitList.push({ label: "Type", value: type });

    // Background traits
    traitList.push({ label: "Background", value: isNight ? "Night" : "Day" });
    if (hasStars) traitList.push({ label: "Stars", value: "Yes" });
    if (hasRain) traitList.push({ label: "Rain", value: "Yes" });

    // Hair
    const hairKeys = Object.keys(PALETTES.hair) as (keyof typeof PALETTES.hair)[];
    const hairColorKey = hairKeys[Math.floor(random() * hairKeys.length)];
    const hairColors = PALETTES.hair[hairColorKey];
    const hairType = ["Long", "Short", "Mohawk", "Bald"][Math.floor(random() * 4)];

    const midX = GRID_SIZE / 2;

    // --- 1. Background ---
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            drawPixel(x, y, bgColor);
        }
    }

    // Stars (night backgrounds only)
    if (hasStars) {
        const starCount = 15 + Math.floor(random() * 25); // 15-40 stars
        const starColors = ["#FFFFFF", "#FFFACD", "#F0E68C", "#FFD700"];

        for (let i = 0; i < starCount; i++) {
            const starX = Math.floor(random() * GRID_SIZE);
            const starY = Math.floor(random() * GRID_SIZE);
            const starColor = starColors[Math.floor(random() * starColors.length)];

            // Small stars (1 pixel)
            if (random() > 0.3) {
                drawPixel(starX, starY, starColor);
            } else {
                // Larger stars (2x2 or cross pattern)
                if (random() > 0.5) {
                    // 2x2 star
                    drawPixel(starX, starY, starColor);
                    drawPixel(starX + 1, starY, starColor);
                    drawPixel(starX, starY + 1, starColor);
                    drawPixel(starX + 1, starY + 1, starColor);
                } else {
                    // Cross pattern star
                    drawPixel(starX, starY, starColor);
                    drawPixel(starX - 1, starY, adjustColor(starColor, -40));
                    drawPixel(starX + 1, starY, adjustColor(starColor, -40));
                    drawPixel(starX, starY - 1, adjustColor(starColor, -40));
                    drawPixel(starX, starY + 1, adjustColor(starColor, -40));
                }
            }
        }
    }

    // Rain (both day and night)
    if (hasRain) {
        const rainDrops = 20 + Math.floor(random() * 30); // 20-50 rain drops
        const rainColor = isNight ? "#4A5568" : "#94A3B8";
        const rainColorLight = isNight ? "#2D3748" : "#CBD5E1";

        for (let i = 0; i < rainDrops; i++) {
            const rainX = Math.floor(random() * GRID_SIZE);
            const rainY = Math.floor(random() * GRID_SIZE);
            const rainLength = 2 + Math.floor(random() * 2); // 2-3 pixels long

            // Draw rain drop (vertical line)
            for (let j = 0; j < rainLength; j++) {
                const y = rainY + j;
                if (y < GRID_SIZE) {
                    // Alternate between two shades for depth
                    const color = j % 2 === 0 ? rainColor : rainColorLight;
                    drawPixel(rainX, y, color);
                }
            }
        }
    }

    // --- 2. Body & Tech Armor (Improved proportions) ---
    const bodyStartY = 24;
    const shoulderWidth = isWoman ? 3 : 4;

    // Torso - trapezoid shape
    for (let y = bodyStartY; y < GRID_SIZE; y++) {
        const expansion = (y - bodyStartY) * 0.7;
        const width = shoulderWidth + expansion;
        for (let x = midX - width; x <= midX + width; x++) {
            // Mythic Glints (random sparkles on diamond suit)
            if (isMythic && random() > 0.92) {
                drawPixel(x, y, "#FFFFFF");
            } else {
                drawPixel(x, y, suitColor);
            }
        }
    }

    // Shoulders (defined, symmetric)
    for (let x = 0; x <= 3; x++) {
        drawSymmetric(shoulderWidth + x, bodyStartY - 1, suitLight);
        if (x < 2) drawSymmetric(shoulderWidth + x, bodyStartY, suitLight);
    }

    // Shoulder LED indicators (symmetric)
    drawSymmetric(shoulderWidth + 2, bodyStartY - 1, neonColor);

    // Chest armor panel
    const chestY = bodyStartY + 2;
    for (let y = chestY; y < chestY + 4; y++) {
        for (let x = midX - 2; x <= midX + 2; x++) {
            drawPixel(x, y, adjustColor(suitColor, 20));
        }
    }

    // Arc Reactor (40% chance)
    if (random() > 0.6) {
        traitList.push({ label: "Reactor", value: "Arc" });
        const reactorColor = PALETTES.neon[Math.floor(random() * PALETTES.neon.length)];
        drawPixel(midX, chestY + 1, reactorColor);
        drawPixel(midX, chestY + 2, reactorColor);
        drawSymmetric(1, chestY + 1, adjustColor(reactorColor, -40));
        drawSymmetric(1, chestY + 2, adjustColor(reactorColor, -40));
    }

    // Neon circuit lines (symmetric)
    for (let y = bodyStartY + 1; y < GRID_SIZE - 2; y += 2) {
        if (random() > 0.5) {
            drawSymmetric(2, y, neonColor);
        }
    }

    // Cyber Arm Implant (30% chance)
    if (random() > 0.7) {
        traitList.push({ label: "Implant", value: "Cyber Arm" });
        const armSide = random() > 0.5 ? 1 : -1;
        const armColor = "#666";
        for (let y = bodyStartY; y < bodyStartY + 6; y++) {
            const armX = midX + armSide * (shoulderWidth + 2 + (y - bodyStartY) * 0.4);
            drawPixel(armX, y, armColor);
            if (y % 2 === 0) drawPixel(armX, y, neonColor);
        }
    }

    // --- 3. Neck & Transition (IMPROVED - connected to shoulders) ---
    const neckY = 19;
    const neckWidth = isWoman ? 1 : 2;

    // Neck main
    for (let y = neckY; y < neckY + 4; y++) {
        for (let x = midX - neckWidth; x <= midX + neckWidth; x++) {
            drawPixel(x, y, skinColor);
        }
    }
    drawPixel(midX - 1, neckY - 1, skinColor);
    drawPixel(midX, neckY - 1, skinColor);
    drawPixel(midX + 1, neckY - 1, skinColor);

    // Neck to shoulder transition (trapezius area) - CRITICAL FIX
    for (let x = midX - neckWidth - 1; x <= midX + neckWidth + 1; x++) {
        drawPixel(x, neckY + 3, skinColor);
    }
    for (let x = midX - shoulderWidth; x <= midX + shoulderWidth; x++) {
        drawPixel(x, neckY + 4, skinDark);
    }

    // Cyber port on neck (70% chance)
    if (random() > 0.3) {
        const portSide = random() > 0.5 ? neckWidth : -neckWidth;
        drawPixel(midX + portSide, neckY + 2, neonColor);
        drawPixel(midX + portSide, neckY + 3, adjustColor(neonColor, -40));
    }

    // Circuit Tattoos (25% chance)
    if (random() > 0.75) {
        traitList.push({ label: "Tattoo", value: "Neon Circuits" });
        const tattooColor = PALETTES.neon[Math.floor(random() * PALETTES.neon.length)];
        const tatSide = random() > 0.5 ? 1 : -1;
        drawPixel(midX + tatSide * (neckWidth + 1), neckY + 1, tattooColor);
        drawPixel(midX + tatSide * (neckWidth + 1), neckY + 2, tattooColor);
        drawPixel(midX + tatSide * neckWidth, neckY + 3, tattooColor);
    }

    // --- 4. Head (IMPROVED - larger, better proportions) ---
    const headY = 14;
    const headWidth = isWoman ? 5 : 6;
    const headHeight = 8;

    // Head oval shape with outline
    for (let y = headY - headHeight; y <= headY + headHeight; y++) {
        const distFromCenter = Math.abs(y - headY);
        const width = headWidth - distFromCenter * 0.5;
        for (let x = midX - width; x <= midX + width; x++) {
            drawPixel(x, y, skinColor);
        }
    }

    // Head shading (left and right edges for depth)
    for (let y = headY - headHeight + 2; y <= headY + headHeight - 2; y++) {
        const distFromCenter = Math.abs(y - headY);
        const width = headWidth - distFromCenter * 0.5;
        drawPixel(midX - width, y, skinDark);
        drawPixel(midX + width, y, skinDark);
    }

    // --- 5. Facial Features (Cyberpunk) ---
    // Cyber Visor / Goggles (60% chance)
    const visorRoll = random();
    let visorType = "None";

    if (visorRoll > 0.4) {
        const visors = ["Neon Visor", "Full Face", "Mono Lens", "AR Glasses", "Combat Visor", "Hacker Goggles"];
        visorType = visors[Math.floor(random() * visors.length)];
        traitList.push({ label: "Visor", value: visorType });

        const visorColor = random() > 0.5 ? neonColor : "#000";
        const glowColor = PALETTES.neon[Math.floor(random() * PALETTES.neon.length)];

        if (visorType === "Neon Visor") {
            // Horizontal visor (3 pixels tall)
            for (let y = headY - 2; y <= headY; y++) {
                for (let x = midX - 4; x <= midX + 4; x++) {
                    drawPixel(x, y, visorColor);
                }
            }
            drawSymmetric(5, headY - 1, glowColor);
            drawSymmetric(5, headY, glowColor);
        } else if (visorType === "Full Face") {
            // Full face mask
            for (let y = headY - 3; y <= headY + 2; y++) {
                for (let x = midX - 4; x <= midX + 4; x++) {
                    drawPixel(x, y, visorColor);
                }
            }
            // Glowing eyes (2x2)
            drawSymmetric(2, headY - 1, glowColor);
            drawSymmetric(2, headY, glowColor);
            // Breathing vents
            drawPixel(midX, headY + 1, neonColor);
            drawPixel(midX, headY + 2, neonColor);
        } else if (visorType === "Mono Lens") {
            // Single eye cyber implant (larger)
            drawSymmetric(2, headY - 1, "#000");
            drawSymmetric(2, headY, "#000");
            drawPixel(midX - 2, headY - 2, visorColor);
            drawPixel(midX - 3, headY - 1, visorColor);
            drawPixel(midX - 2, headY - 1, glowColor);
            drawPixel(midX - 2, headY, glowColor);
            drawPixel(midX - 1, headY - 1, glowColor);
        } else if (visorType === "AR Glasses") {
            // Sleek AR glasses
            for (let x = midX - 5; x <= midX + 5; x++) {
                if (Math.abs(x - midX) > 1) drawPixel(x, headY - 2, visorColor);
            }
            drawSymmetric(2, headY - 1, glowColor);
            drawSymmetric(2, headY, glowColor);
        } else if (visorType === "Combat Visor") {
            // Military style visor
            for (let x = midX - 5; x <= midX + 5; x++) {
                drawPixel(x, headY - 1, visorColor);
                drawPixel(x, headY - 2, adjustColor(visorColor, -20));
            }
            drawPixel(midX, headY - 1, glowColor);
            drawPixel(midX, headY - 2, glowColor);
        } else if (visorType === "Hacker Goggles") {
            // Round goggles (2x2 each)
            drawSymmetric(2, headY - 1, visorColor);
            drawSymmetric(2, headY, visorColor);
            drawSymmetric(3, headY - 1, glowColor);
            drawSymmetric(3, headY, glowColor);
            drawSymmetric(2, headY - 2, visorColor);
        }
    } else {
        // No visor - cyber eyes (2x2 pixels)
        const hasOptic = random() > 0.4;
        const eyeColor = hasOptic ? neonColor : "#000";
        drawSymmetric(2, headY - 1, eyeColor);
        drawSymmetric(2, headY, eyeColor);
    }

    // Mouth / Respirator Mask (25% chance)
    const hasMask = random() > 0.75;
    if (hasMask && visorType !== "Full Face") {
        traitList.push({ label: "Mask", value: "Respirator" });
        const maskColor = PALETTES.suits[Math.floor(random() * PALETTES.suits.length)];
        for (let x = midX - 2; x <= midX + 2; x++) {
            drawPixel(x, headY + 4, maskColor);
            drawPixel(x, headY + 5, maskColor);
        }
        drawSymmetric(3, headY + 4, neonColor);
    } else {
        // Simple mouth
        drawPixel(midX, headY + 5, skinDark);
        drawPixel(midX - 1, headY + 5, skinDark);
        drawPixel(midX + 1, headY + 5, skinDark);
    }

    // Facial Implant (35% chance)
    if (random() > 0.65) {
        traitList.push({ label: "Implant", value: "Facial" });
        const implantColor = PALETTES.neon[Math.floor(random() * PALETTES.neon.length)];
        const implantSide = random() > 0.5 ? 1 : -1;
        drawPixel(midX + implantSide * 4, headY, implantColor);
        drawPixel(midX + implantSide * 4, headY + 1, adjustColor(implantColor, -40));
        drawPixel(midX + implantSide * 5, headY, adjustColor(implantColor, -20));
    }

    // Antenna / Sensor (20% chance)
    if (random() > 0.8) {
        traitList.push({ label: "Antenna", value: "Cyber" });
        const antennaColor = PALETTES.neon[Math.floor(random() * PALETTES.neon.length)];
        const antennaSide = random() > 0.5 ? 1 : -1;
        drawPixel(midX + antennaSide * 6, headY - 5, "#666");
        drawPixel(midX + antennaSide * 6, headY - 6, "#666");
        drawPixel(midX + antennaSide * 6, headY - 7, antennaColor);
        drawPixel(midX + antennaSide * 6, headY - 8, antennaColor);
    }

    // --- 6. Hair with Neon Accents ---
    if (hairType !== "Bald") {
        traitList.push({ label: "Hair", value: `${hairColorKey} ${hairType}` });
        const hCol = hairColors[0];
        const hairNeon = PALETTES.neon[Math.floor(random() * PALETTES.neon.length)];

        if (hairType === "Long") {
            // Long hair
            for (let y = headY - headHeight - 2; y < headY + headHeight + 4; y++) {
                drawSymmetric(headWidth + 1, y, hCol);
                if (y < headY) {
                    for (let x = midX - headWidth; x <= midX + headWidth; x++) {
                        drawPixel(x, y, hCol);
                    }
                }
            }
            // Neon streak
            if (random() > 0.6) drawSymmetric(headWidth + 1, headY - 2, hairNeon);
        } else if (hairType === "Short") {
            // Short hair
            for (let y = headY - headHeight - 2; y < headY - headHeight + 4; y++) {
                for (let x = midX - headWidth - 1; x <= midX + headWidth + 1; x++) {
                    drawPixel(x, y, hCol);
                }
            }
            // Neon dye
            if (random() > 0.5) {
                drawPixel(midX, headY - headHeight - 1, hairNeon);
                drawPixel(midX, headY - headHeight, hairNeon);
            }
        } else if (hairType === "Mohawk") {
            // Mohawk
            for (let y = headY - headHeight - 6; y < headY - headHeight + 2; y++) {
                drawPixel(midX, y, hCol);
                drawPixel(midX - 1, y, hCol);
                drawPixel(midX + 1, y, hCol);
            }
            // Glowing tips
            drawPixel(midX, headY - headHeight - 6, hairNeon);
            drawPixel(midX, headY - headHeight - 5, hairNeon);
        }
    }

    // --- 7. Headgear (Tech Modified) ---
    const hatRoll = random();
    if (hatRoll > 0.75) {
        const headgear = ["Cyber Hood", "Neural Crown", "Combat Helmet", "Holo Halo", "Stealth Cap"];
        const gearType = headgear[Math.floor(random() * headgear.length)];
        traitList.push({ label: "Headgear", value: gearType });

        const gearBase = PALETTES.suits[Math.floor(random() * PALETTES.suits.length)];
        const gearNeon = PALETTES.neon[Math.floor(random() * PALETTES.neon.length)];

        if (gearType === "Cyber Hood") {
            // Futuristic hood
            for (let y = headY - headHeight - 2; y < headY - headHeight + 3; y++) {
                for (let x = midX - 8; x <= midX + 8; x++) {
                    if (Math.abs(x - midX) > headWidth - (y - (headY - headHeight - 2))) {
                        drawPixel(x, y, gearBase);
                    }
                }
            }
            drawPixel(midX, headY - headHeight - 2, gearNeon);
            drawSymmetric(1, headY - headHeight - 1, gearNeon);
        } else if (gearType === "Neural Crown") {
            // Crown with neural connectors
            for (let x = midX - 6; x <= midX + 6; x += 3) {
                drawPixel(x, headY - headHeight - 2, gearNeon);
                drawPixel(x, headY - headHeight - 3, gearNeon);
                drawPixel(x, headY - headHeight - 4, adjustColor(gearNeon, -40));
            }
            for (let x = midX - 7; x <= midX + 7; x++) {
                drawPixel(x, headY - headHeight - 1, gearBase);
            }
        } else if (gearType === "Combat Helmet") {
            // Military helmet
            for (let y = headY - headHeight - 3; y < headY - headHeight + 3; y++) {
                for (let x = midX - 7; x <= midX + 7; x++) {
                    drawPixel(x, y, gearBase);
                }
            }
            for (let x = midX - 6; x <= midX + 6; x++) {
                drawPixel(x, headY - headHeight + 1, gearNeon);
            }
            drawSymmetric(5, headY - headHeight - 1, gearNeon);
        } else if (gearType === "Holo Halo") {
            // Holographic halo
            const haloY = headY - headHeight - 4;
            for (let x = midX - 6; x <= midX + 6; x++) {
                if (Math.abs(x - midX) > 2) {
                    drawPixel(x, haloY, gearNeon);
                    if (random() > 0.5) drawPixel(x, haloY - 1, adjustColor(gearNeon, -60));
                }
            }
        } else if (gearType === "Stealth Cap") {
            // Tactical cap
            for (let y = headY - headHeight - 2; y < headY - headHeight + 2; y++) {
                for (let x = midX - 6; x <= midX + 6; x++) {
                    drawPixel(x, y, gearBase);
                }
            }
            for (let x = midX - 7; x <= midX + 7; x++) {
                drawPixel(x, headY - headHeight + 2, adjustColor(gearBase, -30));
            }
            drawPixel(midX, headY - headHeight, gearNeon);
        }
    }

    // --- Render ---
    const Sorted: { x: number; y: number; fill: string }[] = [];
    pixels.forEach((fill, k) => {
        const [x, y] = k.split(',').map(Number);
        Sorted.push({ x, y, fill });
    });

    const svgContent = Sorted.map(p => `<rect x="${p.x}" y="${p.y}" width="1" height="1" fill="${p.fill}" />`).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="shape-rendering: crispEdges;">${svgContent}</svg>`;

    return { id, svg, traits: traitList };
}
