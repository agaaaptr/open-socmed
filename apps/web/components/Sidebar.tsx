'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, MessageSquare, Bell, UserCircle, Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: UserCircle }, // Changed to /profile
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [userProfile, setUserProfile] = useState<{ full_name: string; username: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const token = (await supabase.auth.getSession()).data.session?.access_token;
          if (!token) {
            throw new Error('No access token found.');
          }

          const response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch profile.');
          }

          const data = await response.json();
          setUserProfile(data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    }
    fetchUserProfile();
  }, [supabase]);

  return (
    <>
      {/* --- HAMBURGER MENU & OVERLAY --- */}
      {/* Hamburger menu button, only visible on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full bg-background-medium text-text-light shadow-lg"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </motion.button>
      </div>

      {/* Overlay for mobile, appears when sidebar is open */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* --- SIDEBAR NAVIGATION --- */}
      <motion.nav
        initial={false}
        animate={{ x: isSidebarOpen ? '0%' : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full w-64 bg-background-dark/80 backdrop-blur-lg border-r border-border-subtle p-6 flex flex-col shadow-xl z-50 
                   md:translate-x-0 md:sticky md:h-screen"
      >
        {/* --- Header with Logo and Close Button --- */}
        <div className="flex justify-between items-center mb-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-extrabold text-text-light tracking-tight"
          >
            Cirqle
          </motion.div>
          {/* Close button, only visible on mobile inside the sidebar */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full text-text-light"
              aria-label="Close sidebar"
            >
              <X size={24} />
            </motion.button>
          </div>
        </div>

        {/* --- Navigation Links --- */}
        <ul className="space-y-4 flex-grow">
          {navItems.map((item) => (
            <motion.li
              key={item.name}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Link href={item.href} className="block" onClick={() => setIsSidebarOpen(false)}>
                <div
                  className={`flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out
                    ${pathname === item.href
                      ? 'bg-accent-main text-text-light shadow-lg transform translate-x-1'
                      : 'text-text-light hover:bg-background-medium/50 hover:text-accent-main'
                    }`}
                >
                  <item.icon className="w-6 h-6 mr-4" />
                  <span className="text-lg font-semibold">{item.name}</span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* --- User Profile Section --- */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-auto pt-6 border-t border-border-subtle flex items-center text-text-light"
        >
          <UserCircle className="w-10 h-10 mr-3 text-accent-main" />
          <div>
            <p className="font-semibold text-text-light">{userProfile?.full_name || 'Current User'}</p>
            <p className="text-sm text-text-muted">@{userProfile?.username || 'username'}</p>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
};

export default Sidebar;