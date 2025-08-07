
'use client';

import { motion } from 'framer-motion';
import { LogOut, HelpCircle, MessageSquareWarning } from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface SettingsMenuProps {
  onClose: () => void;
}

export default function SettingsMenu({ onClose }: SettingsMenuProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    onClose();
  };

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
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={menuVariants}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute bottom-20 left-4 w-64 bg-background-light rounded-lg shadow-2xl border border-border-medium z-50 overflow-hidden"
    >
      <div className="p-2">
        <motion.div variants={itemVariants} transition={{ delay: 0.1 }}>
          <Link href="/report" onClick={onClose} className="flex items-center w-full px-3 py-2 text-sm text-text-light hover:bg-background-dark rounded-md transition-colors">
            <MessageSquareWarning className="w-4 h-4 mr-3" />
            <span>Report a Problem</span>
          </Link>
        </motion.div>
        <motion.div variants={itemVariants} transition={{ delay: 0.15 }}>
          <Link href="/help" onClick={onClose} className="flex items-center w-full px-3 py-2 text-sm text-text-light hover:bg-background-dark rounded-md transition-colors">
            <HelpCircle className="w-4 h-4 mr-3" />
            <span>Help Center</span>
          </Link>
        </motion.div>
        <div className="my-2 border-t border-border-subtle" />
        <motion.div variants={itemVariants} transition={{ delay: 0.2 }}>
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
