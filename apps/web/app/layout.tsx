
'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from '../components/Sidebar';
import MobileNavbar from '../components/MobileNavbar';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNav = pathname === '/home';

  return (
    <html lang="en" className="dark bg-background-dark">
      <body className={`${inter.className}`}>
        <div className="min-h-screen flex flex-col md:flex-row text-text-light">
          {showNav && <Sidebar />}
          <main className={`flex-grow flex flex-col pb-16 md:pb-0 ${showNav ? 'md:ml-64' : ''}`}>
            {children}
          </main>
          {showNav && <MobileNavbar />}
        </div>
      </body>
    </html>
  );
}
