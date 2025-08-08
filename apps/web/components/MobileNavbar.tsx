'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, MessageSquare, PlusSquare, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import MoreMenu from './MoreMenu';

interface MobileNavbarProps {
  onOpenCreatePost: () => void;
  isVisible: boolean;
}

const MobileNavbar = ({ onOpenCreatePost, isVisible }: MobileNavbarProps) => {
  const pathname = usePathname();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const navItemsLeft = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
  ];

  const navItemsRight = [
    { name: 'Messages', href: '/messages', icon: MessageSquare },
  ];

  return (
    <motion.nav
      initial={false} // Control visibility via animate prop
      animate={isVisible ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 bg-background-dark/80 backdrop-blur-lg border-t border-border-subtle p-3 flex justify-between items-center shadow-lg z-50 md:hidden"
    >
      <div className="flex-1 flex justify-around items-center">
        {navItemsLeft.map((item) => (
          <Link key={item.name} href={item.href} className="flex-1 flex flex-col items-center text-text-light hover:text-accent-main transition-colors duration-300">
            <item.icon className={`w-6 h-6 ${pathname === item.href ? 'text-accent-main' : 'text-text-muted'}`} />
          </Link>
        ))}
      </div>

      {/* Central Post Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onOpenCreatePost}
        className="p-4 rounded-full bg-accent-main text-text-light shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-main focus:ring-offset-2 focus:ring-offset-background-dark -mt-8 mx-2"
      >
        <PlusSquare size={32} />
      </motion.button>

      <div className="flex-1 flex justify-around items-center">
        {navItemsRight.map((item) => (
          <Link key={item.name} href={item.href} className="flex-1 flex flex-col items-center text-text-light hover:text-accent-main transition-colors duration-300">
            <item.icon className={`w-6 h-6 ${pathname === item.href ? 'text-accent-main' : 'text-text-muted'}`} />
          </Link>
        ))}

        {/* More Menu Toggle */}
        <div className="relative flex-1 flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from propagating to the document
              setIsMoreMenuOpen(!isMoreMenuOpen);
            }}
            className="p-3 rounded-full text-text-light hover:text-accent-main transition-colors duration-300"
          >
            <Menu size={24} />
          </motion.button>
          <AnimatePresence>
            {isMoreMenuOpen && <MoreMenu onClose={() => setIsMoreMenuOpen(false)} />}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default MobileNavbar;