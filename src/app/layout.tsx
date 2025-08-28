import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My App",
  description: "Generated with Next.js & Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-light-text 
          bg-gradient-to-b from-dark-blue to-light-dark-blue min-h-screen`}
      >
        <Navbar />

        {/* 🔴 Tailwind Test */}
        <div className="bg-red-500 text-white p-4 text-center">
          Tailwind Test — Kalau kotak merah ini muncul, Tailwind aktif ✅
        </div>

        <main className="pt-20">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
