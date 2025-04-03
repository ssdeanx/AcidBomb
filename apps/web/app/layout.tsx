import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import { ThemeProvider } from '@repo/ui/ThemeProvider';
import { AppBar } from '@repo/ui/Appbar';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '700'],
  display: 'swap'
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  weight: ['400', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'DeanMachines',
  description: 'A modern web application built with Next.js, React, TypeScript, MUI, and Supabase.  Build for AI Agents and LLMs with Mastra',
  keywords: ['Next.js', 'React', 'TypeScript', 'MUI', 'Supabase', 'AI Agents', 'LLMs', 'Mastra', 'Web Development', 'TurboRepo', 'RL Agents', 'Reinforcement Learning', 'AI', 'Machine Learning', 'Deep Learning', 'Robotics', 'Automation'],
  authors: [{ name: 'DeanMachines' }],
  icons: {
    icon: '/favicon.ico',

  },
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable}`}>
        <ThemeProvider>
          <AppBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
