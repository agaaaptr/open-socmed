'use client';

import { motion } from 'framer-motion';
import { LogOut, HelpCircle, MessageSquareWarning, Bell, UserCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface MoreMenuProps {
  onClose: () => void;
}

export default function MoreMenu({ onClose }: MoreMenuProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<{ full_name: string; username: string } | null>(null);

  useOnClickOutside(menuRef, onClose);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    onClose();
  };

  const menuItems = [
    { label: 'Notifications', icon: <Bell className="w-5 h-5 text-text-muted" />, href: '/notifications' },
    { label: 'Profile', icon: <UserCircle className="w-5 h-5 text-text-muted" />, href: userProfile ? `/profile/${userProfile.username}` : '/profile' },
    { label: 'Settings', icon: <MessageSquareWarning className="w-5 h-5 text-text-muted" />, href: '/settings' },
  ];

  const menuVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      ref={menuRef}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={menuVariants}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute bottom-full right-0 mb-4 w-64 bg-background-light rounded-lg shadow-2xl border border-border-medium z-50 overflow-hidden"
    >
      <div className="p-2">
        {menuItems.map((item, index) => (
          <motion.div key={index} variants={itemVariants} transition={{ delay: 0.1 + index * 0.05 }}>
            <Link href={item.href} onClick={onClose} className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors ${pathname === item.href ? 'bg-accent-main text-text-light' : 'text-text-light hover:bg-background-dark'}`}>
              <div className="flex items-center">
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </Link>
          </motion.div>
        ))}
        <div className="my-2 border-t border-border-subtle" />
        <motion.div variants={itemVariants} transition={{ delay: 0.1 + menuItems.length * 0.05 }}>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-text-light rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span>Sign Out</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
