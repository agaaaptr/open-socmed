import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, MessageSquare, Bell, UserCircle, Settings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import SettingsMenu from './SettingsMenu';

interface SidebarProps {
  isVisible: boolean;
}

const Sidebar = ({ isVisible }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [userProfile, setUserProfile] = useState<{ full_name: string; username: string } | null>(null);
  const [isSettingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Profile', href: userProfile ? `/profile/${userProfile.username}` : '/profile', icon: UserCircle },
  ];

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
    <motion.nav
      initial={false} // Control visibility via animate prop
      animate={isVisible ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-background-dark/80 backdrop-blur-lg border-r border-border-subtle p-6 shadow-xl z-50"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl font-extrabold text-text-light mb-10 tracking-tight cursor-pointer"
        onClick={() => router.refresh()}
      >
        Cirqle
      </motion.div>
      <ul className="space-y-4 flex-grow">
        {navItems.map((item) => (
          <motion.li
            key={item.name}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <Link href={item.href} className="block">
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
      <div className="mt-auto space-y-4">
        <motion.div
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          className="relative"
        >
          <button
            onClick={() => setSettingsMenuOpen(!isSettingsMenuOpen)}
            className="w-full flex items-center p-3 rounded-xl text-text-light hover:bg-background-medium/50 hover:text-accent-main transition-all duration-300 ease-in-out"
          >
            <Settings className="w-6 h-6 mr-4" />
            <span className="text-lg font-semibold">Settings</span>
          </button>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="pt-4 border-t border-border-subtle flex items-center text-text-light"
        >
          <UserCircle className="w-10 h-10 mr-3 text-accent-main" />
          <div>
            <p className="font-semibold text-text-light">{userProfile?.full_name || 'Current User'}</p>
            <p className="text-sm text-text-muted">@{userProfile?.username || 'username'}</p>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {isSettingsMenuOpen && <SettingsMenu onClose={() => setSettingsMenuOpen(false)} />}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Sidebar;