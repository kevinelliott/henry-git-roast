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
  title: "Git Roast 🔥 - Friendly GitHub Profile Roaster",
  description: "Get a friendly roast based on your GitHub profile. All in good fun!",
  openGraph: {
    title: "Git Roast 🔥",
    description: "Get a friendly roast based on your GitHub profile",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Git Roast 🔥",
    description: "Get a friendly roast based on your GitHub profile",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
