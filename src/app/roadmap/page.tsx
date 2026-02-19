import Image from "next/image";
import Link from "next/link";
import RainEffect from "@/components/RainEffect";

export default function RoadmapPage() {
    return (
        <main className="min-h-screen pb-20 overflow-x-hidden relative">
            <RainEffect />

            {/* Header (Minimal) */}
            <nav className="p-6 flex justify-between items-center border-b-2 border-cyber-black bg-[#0f172a] sticky top-0 z-40">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyber-pink animate-pulse" />
                    <h1 className="font-pixel-heading text-lg tracking-tighter text-white">
                        CYBERPUNXELS <span className="text-cyber-pink">GEN</span>
                    </h1>
                </Link>
                <Link href="/" className="pixel-button !py-2 !px-4 font-pixel-heading text-[10px]">
                    BACK TO GENERATOR
                </Link>
            </nav>

            <div className="max-w-6xl mx-auto pt-16 px-4 relative z-10">
                <section className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-pixel-heading mb-6 uppercase tracking-tight text-foreground">
                        Punxel <span className="text-cyber-pink drop-shadow-[4px_4px_0_var(--accent-shadow)]">Roadmap</span>
                    </h2>
                    <p className="font-pixel-heading text-lg max-w-2xl mx-auto text-cyber-pink bg-black/40 py-2 border-y-2 border-cyber-pink/20">
                        "YOUR KEY TO PUNXELTOWN"
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left: Image */}
                    <div className="pixel-border p-2 bg-white/5 backdrop-blur-sm relative group overflow-hidden">
                        <div className="relative aspect-video w-full overflow-hidden pixel-border-inner">
                            <Image
                                src="/images/punxeltown.png"
                                alt="Punxeltown"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Aesthetic corner accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-pink" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-pink" />
                    </div>

                    {/* Right: Text */}
                    <div className="flex flex-col gap-8">
                        <div className="space-y-6">
                            <div className="inline-block px-3 py-1 bg-cyber-pink/10 border border-cyber-pink text-cyber-pink font-pixel-heading text-[10px]">
                                COMMING SOON
                            </div>

                            <h3 className="font-pixel-heading text-2xl text-foreground">
                                THE NEXT CHAPTER <span className="text-cyber-pink animate-pulse">_</span>
                            </h3>

                            <div className="font-pixel-body text-xl space-y-4 opacity-90 leading-relaxed text-muted">
                                <p>
                                    Soon, your unique Punxels will be ready to be minted on the <span className="text-cyan-400 font-bold">MultiversX</span> blockchain.
                                </p>
                                <p>
                                    Exclusively available on the <span className="text-cyber-pink font-bold">OOX Marketplace</span>,
                                    these digital street warriors are more than just collectibles.
                                </p>
                                <p>
                                    Every Punxel you generate and mint will become your official
                                    <span className="text-white border-b-2 border-cyber-pink pb-1 mx-1">access key</span>
                                    to an expanding ecosystem of cyberpunk pixel experiences.
                                </p>
                                <p className="pt-4 border-t border-white/10 italic text-cyber-pink">
                                    Punxeltown is waiting. Secure your identity. Prepare for the drop.
                                </p>
                            </div>
                        </div>

                        <Link href="/" className="pixel-button w-full md:w-fit !px-12 !py-4 font-pixel-heading text-sm text-center">
                            GENERATE YOUR PUNXEL
                        </Link>
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="my-24 py-12 px-8 border-2 border-cyber-pink/30 bg-cyber-pink/5 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-2 bg-cyber-pink" />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-cyber-pink" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyber-pink" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyber-pink" />

                    <div className="flex flex-col items-center text-center gap-8 relative z-10">
                        <div className="space-y-2">
                            <h4 className="font-pixel-heading text-cyber-pink text-xs tracking-[0.2em] animate-pulse">
                                INCOMING_PROTOCOL
                            </h4>
                            <div className="h-1 w-12 bg-cyber-pink mx-auto" />
                        </div>

                        <button className="pixel-button !px-16 !py-6 font-pixel-heading text-2xl group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,46,136,0.3)]">
                            PUNXEL MINT
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mt-4">
                            <div className="flex flex-col gap-2 p-4 border border-white/10 bg-black/40">
                                <span className="text-[10px] font-pixel-heading text-slate-500 uppercase">Release Date</span>
                                <span className="font-pixel-heading text-sm text-white font-bold">DATE TO BE DETERMINED</span>
                            </div>
                            <div className="flex flex-col gap-2 p-4 border border-white/10 bg-black/40">
                                <span className="text-[10px] font-pixel-heading text-slate-500 uppercase">Platform</span>
                                <span className="font-pixel-heading text-sm text-cyan-400 font-bold">EXCLUSIVELY ON OOX</span>
                            </div>
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none font-pixel-heading text-[120px] whitespace-nowrap overflow-hidden select-none">
                        MINT MINT MINT MINT MINT
                    </div>
                </div>

                {/* Second Section: Swapped layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-24">
                    {/* Left: Text */}
                    <div className="flex flex-col gap-8 order-2 md:order-1">
                        <div className="space-y-6">
                            <h3 className="font-pixel-heading text-2xl text-foreground">
                                EVERY LITTLE PUNXEL <br />
                                <span className="text-cyber-pink">HAS A BIG TOOL</span>
                            </h3>

                            <div className="font-pixel-body text-xl space-y-4 opacity-90 leading-relaxed text-muted">
                                <p>
                                    Your Punxels are not just static images; they are your passport to the expansion of Punxeltown.
                                </p>
                                <p>
                                    Through the <span className="text-cyan-400 font-bold">OOX Marketplace</span>, Punxel NFT holders will gain the exclusive ability to
                                    <span className="text-white border-b-2 border-cyber-pink pb-1 mx-1">unlock new character types</span> as they are released.
                                </p>
                                <p>
                                    Own a Punxel, and you'll be the first to pilot massive Mechas and discover hidden pixel warriors that will join our growing cyberpunk ecosystem over time.
                                </p>
                                <p className="pt-4 border-t border-white/10 italic text-cyber-pink">
                                    Stay holding, stay active. The evolution starts with you.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Image (Mecha from local file) */}
                    <div className="order-1 md:order-2 pixel-border p-2 bg-white/5 backdrop-blur-sm relative group overflow-hidden">
                        <div className="relative aspect-square w-full bg-cyber-black flex items-center justify-center overflow-hidden pixel-border-inner">
                            <Image
                                src="/images/mecha.png"
                                alt="Classified Mecha"
                                fill
                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-cyber-pink/20 to-transparent flex items-end justify-center pb-8">
                                <span className="font-pixel-heading text-[10px] tracking-widest text-cyber-pink animate-pulse">
                                    CLASSIFIED_MECHA_V1
                                </span>
                            </div>
                        </div>
                        {/* Aesthetic corner accents */}
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-pink" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-pink" />
                    </div>
                </div>
            </div>

            {/* Footer Decoration */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-pink to-transparent opacity-30" />
        </main>
    );
}
