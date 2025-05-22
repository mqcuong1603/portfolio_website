import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "William Ma - Full Stack Developer",
  description:
    "A passionate full-stack developer creating amazing digital experiences. Specialized in React, Next.js, and modern web technologies.",
  keywords: ["developer", "react", "nextjs", "typescript", "web development"],
  authors: [{ name: "William Ma" }],
  creator: "William Ma",
  metadataBase: new URL("https://yourwebsite.com"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://yourwebsite.com",
    title: "William Ma - Full Stack Developer",
    description:
      "A passionate full-stack developer creating amazing digital experiences.",
    siteName: "Your Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Name - Full Stack Developer",
    description:
      "A passionate full-stack developer creating amazing digital experiences.",
    creator: "@yourusername",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
