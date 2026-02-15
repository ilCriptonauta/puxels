"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Tag, Share2, ImageIcon } from "lucide-react";
import { GeneratedPixelArt } from "@/lib/pixel-engine";

interface ArtModalProps {
    image: GeneratedPixelArt | null;
    onClose: () => void;
    onSave: (image: GeneratedPixelArt) => void;
}

export default function ArtModal({ image, onClose, onSave }: ArtModalProps) {
    if (!image) return null;

    const downloadPng = () => {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set high resolution for quality (1024x1024)
        const size = 1024;
        canvas.width = size;
        canvas.height = size;

        // Create an image from the SVG string
        const img = new Image();
        const svgBlob = new Blob([image.svg], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            // Disable smoothing to keep pixel art crisp
            ctx.imageSmoothingEnabled = false;

            // Draw the SVG image onto the canvas
            ctx.drawImage(img, 0, 0, size, size);

            // Convert canvas to PNG blob
            canvas.toBlob((blob) => {
                if (!blob) return;

                const pngUrl = URL.createObjectURL(blob);
                const downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = `cyber-punxel-${image.id.toString().padStart(6, '0')}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                // Clean up
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    URL.revokeObjectURL(pngUrl);
                }, 100);
            }, "image/png");
        };

        img.onerror = () => {
            console.error("Failed to load SVG image");
            URL.revokeObjectURL(url);
        };

        img.src = url;
    };

    const handleShare = async () => {
        const text = `Check out this #PUNXEL I just generated! ⚡️`;
        const shareUrl = `${window.location.origin}/?id=${image.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Cyber Punxels',
                    text: text,
                    url: shareUrl,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            // Fallback to Twitter/X share
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(twitterUrl, '_blank');
        }
    };

    const isMythic = image.traits.some(t => t.value === "Mythic");

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-cyber-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className={`relative w-full max-w-4xl bg-white overflow-hidden flex flex-col md:flex-row border-4 ${isMythic ? 'border-[#FFD700]' : 'border-cyber-black'} shadow-[5px_5px_0_rgba(0,0,0,1)] md:shadow-[10px_10px_0_rgba(0,0,0,1)] max-h-[95vh] md:max-h-[90vh]`}
                >
                    {isMythic && (
                        <div className="absolute inset-0 pointer-events-none z-10 border-[6px] border-[#FFD700]/50 animate-pulse" />
                    )}

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className={`absolute top-2 right-2 md:top-4 md:right-4 p-2 ${isMythic ? 'bg-[#FFD700] text-black' : 'bg-cyber-black text-white'} hover:bg-cyber-pink transition-colors z-30`}
                    >
                        <X size={20} />
                    </button>

                    {/* Left: Image */}
                    <div
                        className={`w-full md:w-1/2 h-[35vh] md:h-auto md:aspect-square ${isMythic ? 'bg-gradient-to-br from-[#FFD700]/10 via-white to-[#FFD700]/10' : 'bg-[#f8f9fa]'} flex items-center justify-center p-6 md:p-12 cursor-pointer group relative overflow-hidden flex-shrink-0`}
                    >
                        {isMythic && (
                            <div className="absolute inset-0 z-0">
                                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#FFD700] animate-ping" />
                                <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-white animate-ping delay-300" />
                                <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-[#FFD700] animate-ping delay-700" />
                            </div>
                        )}
                        <div
                            id={`modal-svg-${image.id}`}
                            className="w-full h-full max-w-[250px] md:max-w-none drop-shadow-2xl transition-transform group-hover:scale-105 z-10"
                            dangerouslySetInnerHTML={{ __html: image.svg }}
                        />
                        <div className={`absolute top-0 left-0 w-full h-full ${isMythic ? 'bg-[#FFD700]/5' : 'bg-cyber-pink/5'} opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity`} />
                    </div>

                    {/* Right: Details */}
                    <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col gap-4 md:gap-6 bg-white border-t-4 md:border-t-0 md:border-l-4 border-cyber-black overflow-y-auto overflow-x-hidden">
                        <div className="pr-10 md:pr-12">
                            <div className="flex items-center justify-between mb-1 md:mb-2">
                                <div className="flex flex-col gap-1">
                                    {isMythic && (
                                        <span className="font-pixel-heading text-[10px] bg-[#FFD700] text-black px-2 py-0.5 w-fit animate-pulse">
                                            MYTHIC RARITY
                                        </span>
                                    )}
                                    <h3 className="font-pixel-heading text-lg md:text-xl text-cyber-black">
                                        PUNXEL #{image.id.toString().padStart(6, '0')}
                                    </h3>
                                </div>
                                <button
                                    onClick={handleShare}
                                    className="p-2 border-2 border-cyber-black hover:bg-cyber-pink text-cyber-black transition-colors"
                                    title="Share"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>
                            <p className="font-pixel-body text-sm md:text-lg text-gray-500 italic leading-tight">
                                "{textMap[image.id % textMap.length]}"
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2 md:gap-3">
                            {image.traits.map(trait => (
                                <div key={trait.label} className="border-2 border-slate-100 p-2 md:p-3 hover:border-cyber-pink/30 transition-colors bg-slate-50/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Tag size={12} className="text-cyber-pink" />
                                        <span className="font-pixel-heading text-[8px] md:text-[9px] text-gray-400 uppercase tracking-tighter">
                                            {trait.label}
                                        </span>
                                    </div>
                                    <div className="font-pixel-body text-sm md:text-lg text-cyber-black uppercase tracking-wide">
                                        {trait.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-2 md:gap-3 mt-4 md:mt-auto pb-4 md:pb-0">
                            <button
                                onClick={() => onSave(image)}
                                className="pixel-button flex items-center justify-center gap-3 w-full !bg-cyber-pink !text-black !py-3 md:!py-4"
                            >
                                <Download size={18} /> DOWNLOAD SVG
                            </button>

                            <button
                                onClick={downloadPng}
                                className="pixel-button flex items-center justify-center gap-3 w-full !bg-white !text-black border-2 border-cyber-black !py-3 md:!py-4"
                            >
                                <ImageIcon size={18} /> DOWNLOAD PNG
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

const textMap = [
    "A unique street samurai from the neon underbelly of Neo-Tokyo.",
    "A tactical operative specialist in high-risk data retrieval.",
    "An enigmatic wanderer roaming the digital wastelands.",
    "A legendary hacker who breached the Fortress of Solitude.",
    "A prototype unit from the Great Silicon Uprising.",
    "A rare biological anomaly in a world of circuits and code."
];
