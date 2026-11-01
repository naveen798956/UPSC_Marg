import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UPSC CSE Master Planner (GS + PSIR)',
  description: 'Production Preparation Operating System for UPSC 2026-2027',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}