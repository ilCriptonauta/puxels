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
                downloadLink.download = `cyber-puxel-${image.id.toString().padStart(6, '0')}.png`;
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
        const text = `Ehy, guarda cosa ho appena generato #PUNXEL`;
        const shareUrl = `${window.location.origin}/?id=${image.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Cyber Punxel',
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
                    className="relative w-full max-w-4xl bg-white overflow-hidden flex flex-col md:flex-row border-4 border-cyber-black shadow-[10px_10px_0_rgba(0,0,0,1)]"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-cyber-black text-white hover:bg-cyber-pink transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    {/* Left: Image */}
                    <div
                        className="w-full md:w-1/2 aspect-square bg-[#f8f9fa] flex items-center justify-center p-12 cursor-pointer group relative overflow-hidden"
                    >
                        <div
                            id={`modal-svg-${image.id}`}
                            className="w-full h-full drop-shadow-2xl transition-transform group-hover:scale-105"
                            dangerouslySetInnerHTML={{ __html: image.svg }}
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-cyber-pink/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                    </div>

                    {/* Right: Details */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col gap-6 bg-white border-l-4 border-cyber-black overflow-y-auto max-h-[90vh]">
                        <div className="pr-12">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-pixel-heading text-xl text-cyber-black">
                                    PUNXEL #{image.id.toString().padStart(3, '0')}
                                </h3>
                                <button
                                    onClick={handleShare}
                                    className="p-2 border-2 border-cyber-black hover:bg-cyber-pink text-cyber-black transition-colors"
                                    title="Share"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>
                            <p className="font-pixel-body text-lg text-gray-500 italic">
                                "{textMap[image.id % textMap.length]}"
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {image.traits.map(trait => (
                                <div key={trait.label} className="border-2 border-slate-100 p-3 hover:border-cyber-pink/30 transition-colors bg-slate-50/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Tag size={12} className="text-cyber-pink" />
                                        <span className="font-pixel-heading text-[9px] text-gray-400 uppercase tracking-tighter">
                                            {trait.label}
                                        </span>
                                    </div>
                                    <div className="font-pixel-body text-lg text-cyber-black uppercase tracking-wide">
                                        {trait.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3 mt-auto">
                            <button
                                onClick={() => onSave(image)}
                                className="pixel-button flex items-center justify-center gap-3 w-full !bg-cyber-pink !text-black"
                            >
                                <Download size={18} /> DOWNLOAD SVG
                            </button>

                            <button
                                onClick={downloadPng}
                                className="pixel-button flex items-center justify-center gap-3 w-full !bg-white !text-black border-2 border-cyber-black"
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
