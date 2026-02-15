"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import RainEffect from "@/components/RainEffect";
import Image from "next/image";

export default function PunxeltownPage() {
    useEffect(() => {
        const savedTheme = localStorage.getItem("app_theme");
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    return (
        <main className="min-h-screen pb-20 overflow-x-hidden relative transition-colors duration-500">
            <RainEffect />

            <div className="max-w-4xl mx-auto px-6 pt-12">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-cyber-pink hover:gap-4 transition-all font-pixel-body text-xl mb-12"
                >
                    <ArrowLeft size={20} /> BACK TO GENERATOR
                </Link>

                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-pixel-heading mb-6 uppercase tracking-tight text-foreground"
                    >
                        Punxel<span className="text-cyber-pink drop-shadow-[4px_4px_0_var(--accent-shadow)]">town</span>
                    </motion.h1>
                    <p className="font-pixel-body text-2xl text-muted">The Bastion of Silicon Hope</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full aspect-square mb-16 pixel-border overflow-hidden bg-cyber-black flex items-center justify-center p-2"
                >
                    <Image
                        src="/images/punxeltown.png"
                        alt="Punxeltown Pixel Art"
                        fill
                        className="object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/20 to-transparent pointer-events-none" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-8 font-pixel-body text-xl md:text-2xl leading-relaxed text-foreground opacity-90"
                >
                    <p>
                        In the year 2184, after the Great Reset scorched the old world, the Punxels emerged from the wreckage of the deep servers.
                        They found themselves in a reality that was neither fully digital nor entirely organic—a glitch in the tapestry of time.
                    </p>

                    <p>
                        Punxeltown was built on top of the <span className="text-cyber-pink">'Motherboard Plains'</span>, a city forged from neon-dreams and salvaged titanium.
                        It is a place where the air smells of ozone and the rain tastes like liquid data.
                    </p>

                    <p>
                        The Punxels are a lost people, once just strings of code in a forgotten mainframe, now seeking to rebuild a world where technology serves the spirit.
                        Slowly, they are gathering the fragments of the past to construct a better future—a haven for the disconnected and the brave.
                    </p>

                    <div className="pt-12 border-t-4 border-cyber-black/20 text-center italic text-muted">
                        "Every Punxel generated is a new citizen of this growing haven, each carrying a fragment of the data needed to restore the global network."
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
