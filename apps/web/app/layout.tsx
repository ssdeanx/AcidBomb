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
  title: 'DeanMachines - AI Agent Platform',
  description: 'A modern platform for building diverse AI applications and agents (Conversational, Autonomous, Reinforcement Learning) using Next.js, NestJS, Mastra, Supabase, and Pinecone.',
  keywords: ['AI Agents', 'Reinforcement Learning', 'RL Agents', 'Autonomous Agents', 'Conversational AI', 'LLMs', 'Mastra', 'Next.js', 'NestJS', 'TypeScript', 'MUI', 'Supabase', 'Pinecone', 'Vector Database', 'Web Development', 'TurboRepo', 'Machine Learning', 'Deep Learning', 'Robotics', 'Automation'],
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
