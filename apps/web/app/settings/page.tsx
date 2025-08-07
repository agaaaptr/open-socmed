
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, HelpCircle, MessageSquareWarning, ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const menuItems = [
    {
      label: 'Report a Problem',
      icon: <MessageSquareWarning className="w-5 h-5 text-text-muted" />,
      href: '/report',
    },
    {
      label: 'Help Center',
      icon: <HelpCircle className="w-5 h-5 text-text-muted" />,
      href: '/help',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-background-dark text-text-light">
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8"
      >
        <header className="flex items-center mb-8">
          <Link href="/home" className="p-2 rounded-full hover:bg-background-light transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold ml-4">Settings</h1>
        </header>

        <div className="bg-background-light rounded-lg shadow-lg">
          <ul className="divide-y divide-border-subtle">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>
                  <div className="flex items-center justify-between p-4 hover:bg-background-dark transition-colors cursor-pointer">
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-4 text-text-light">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center p-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-text-light transition-colors duration-300 shadow-md"
          >
            <LogOut className="mr-2 h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
