import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel-heading",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel-body",
});

export const metadata: Metadata = {
  title: "Cyber Pixel Generator",
  description: "Minimalist Cyberpunk Pixel Art Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${vt323.variable}`}>
      <body className="font-pixel-body">
        {children}
      </body>
    </html>
  );
}
