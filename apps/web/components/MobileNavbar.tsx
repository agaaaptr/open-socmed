'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, MessageSquare, Bell, UserCircle, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: UserCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const MobileNavbar = () => {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 bg-background-dark/80 backdrop-blur-lg border-t border-border-subtle p-3 flex justify-around items-center shadow-lg z-50 md:hidden"
    >
      {navItems.map((item) => (
        <Link key={item.name} href={item.href} className="flex flex-col items-center text-text-light hover:text-accent-main transition-colors duration-300">
          <item.icon className={`w-6 h-6 ${pathname === item.href ? 'text-accent-main' : 'text-text-muted'}`} />
        </Link>
      ))}
    </motion.nav>
  );
};

export default MobileNavbar;