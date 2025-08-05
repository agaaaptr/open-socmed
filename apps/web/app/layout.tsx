
'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from '../components/Sidebar';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = !['/', '/auth/signin', '/auth/signup'].includes(pathname);

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background-dark`}>
        <div className="min-h-screen flex text-text-light">
          {showSidebar && <Sidebar />}
          <main className="flex-grow flex flex-col">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
