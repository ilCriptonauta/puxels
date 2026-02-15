"use client";

import { useEffect, useState } from "react";

export default function RainEffect() {
    const [drops, setDrops] = useState<{ id: number; left: string; duration: string; delay: string; opacity: number }[]>([]);
    const [isSunset, setIsSunset] = useState(false);

    useEffect(() => {
        const checkTheme = () => {
            setIsSunset(document.documentElement.getAttribute('data-theme') === 'sunset');
        };

        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        const newDrops = Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            duration: `${0.5 + Math.random() * 0.5}s`,
            delay: `${Math.random() * 2}s`,
            opacity: 0.1 + Math.random() * 0.2,
        }));
        setDrops(newDrops);

        return () => observer.disconnect();
    }, []);

    if (isSunset) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ top: '80px' }}>
            {drops.map((drop) => (
                <div
                    key={drop.id}
                    className="absolute bg-cyber-pink w-[2px] h-[20px]"
                    style={{
                        left: drop.left,
                        top: '-20px',
                        opacity: drop.opacity,
                        animation: `fall ${drop.duration} linear infinite`,
                        animationDelay: drop.delay,
                        imageRendering: 'pixelated',
                    }}
                />
            ))}
            <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>
        </div>
    );
}
