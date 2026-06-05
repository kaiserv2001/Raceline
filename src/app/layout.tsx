import type { Metadata } from "next";
import { Barlow_Condensed } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-condensed",
});

export const metadata: Metadata = {
  title: "Apex Grid — Motorsport Command Center",
  description: "A high-performance motorsport interface exploring real-time data visualization, race strategy controls, and premium sports UI design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} h-full`}>
      <body className="min-h-full bg-[#0A0A0F] text-[#E8E8E0] antialiased">
        <Nav />
        <main className="min-h-screen pt-14">{children}</main>
      </body>
    </html>
  );
}
