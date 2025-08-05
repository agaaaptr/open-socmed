'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import MobileNavbar from '../components/MobileNavbar';

export default function ClientLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNav = pathname === '/home';

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-text-light">
      {showNav && <Sidebar />}
      <main className={`flex-grow flex flex-col pb-16 md:pb-0 ${showNav ? 'md:ml-64' : ''}`}>
        {children}
      </main>
      {showNav && <MobileNavbar />}
    </div>
  );
}
