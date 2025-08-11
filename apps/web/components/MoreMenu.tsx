'use client';

import { motion } from 'framer-motion';
import { LogOut, HelpCircle, Settings2, Bell, UserCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { useQuery } from '@tanstack/react-query'; // Added import

interface MoreMenuProps {
  onClose: () => void;
}

export default function MoreMenu({ onClose }: MoreMenuProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<{ full_name: string; username: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // Added state for current user ID

  useOnClickOutside(menuRef, onClose);

  useEffect(() => {
    async function fetchUserProfileAndUserId() { // Combined function
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id); // Set current user ID
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
    fetchUserProfileAndUserId(); // Call combined function
  }, [supabase]);

  // Fetch unread notifications count
  const { data: unreadNotifications } = useQuery<any[]>({ // Use 'any[]' for simplicity, or define a more specific type if needed
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return []; // Return empty array if no session

      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch notifications for unread count');
        return [];
      }
      const data = await response.json();
      return data.filter((n: any) => !n.is_read); // Filter for unread
    },
    enabled: !!currentUserId, // Only fetch if currentUserId is available
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCount = unreadNotifications?.length || 0;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    onClose();
  };

  const menuItems = [
    { label: 'Notifications', icon: <Bell className="w-5 h-5 text-text-muted" />, href: '/notifications', unreadCount: unreadCount }, // Added unreadCount
    { label: 'Profile', icon: <UserCircle className="w-5 h-5 text-text-muted" />, href: userProfile ? `/profile/${userProfile.username}` : '/profile' },
    { label: 'Settings', icon: <Settings2 className="w-5 h-5 text-text-muted" />, href: '/settings' },
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
              {item.label === 'Notifications' && item.unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="ml-auto w-2.5 h-2.5 bg-red-500 rounded-full" // Adjust positioning as needed
                />
              )}
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
