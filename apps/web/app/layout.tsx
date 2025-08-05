
import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from 'next';
import ClientLayoutContent from './ClientLayoutContent'; // New client component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Cirqle',
  description: 'Your New Social Universe',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-background-dark">
      <body className={`${inter.className}`}>
        <ClientLayoutContent>
          {children}
        </ClientLayoutContent>
      </body>
    </html>
  );
}
