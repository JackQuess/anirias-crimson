
import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Cinzel, Inter, Playfair_Display } from 'next/font/google';
import { RootProvider } from '../components/providers/RootProvider';
import './globals.css';

// Font Setup
const cinzel = Cinzel({ 
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

// Global Metadata
export const metadata: Metadata = {
  title: {
    default: 'Anirias - Crimson Stream',
    template: '%s | Watch Free on Anirias',
  },
  description: 'A premium, gothic-futurism inspired anime streaming platform.',
  keywords: ['Anime', 'Streaming', 'Free', 'High Quality', 'High School DxD'],
};

export const viewport: Viewport = {
  themeColor: '#990011',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable} ${playfair.variable} dark`}>
      <body className="bg-[#050505] text-white font-inter overflow-x-hidden selection:bg-[#990011] selection:text-white">
        <RootProvider>
           {children}
        </RootProvider>
      </body>
    </html>
  );
}
