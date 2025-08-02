'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { LogOut, UserCircle, Loader } from 'lucide-react';
import Link from 'next/link';

// Header Component for Home
const Header = ({ onSignOut }) => (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 p-4 bg-slate-900/80 backdrop-blur-lg shadow-md flex justify-between items-center border-b border-primary-800/50"
    >
      <Link href="/" className="text-3xl font-bold text-white">
        Cirqle
      </Link>
      <button
        onClick={onSignOut}
        className="flex items-center text-primary-200 hover:text-accent-500 transition-colors duration-300 font-semibold py-2 px-4 rounded-lg bg-primary-800/50 hover:bg-primary-700/50"
      >
        <LogOut className="mr-2 h-5 w-5" />
        <span>Sign Out</span>
      </button>
    </motion.header>
  );

// Loading Spinner Component
const LoadingSpinner = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center"
    >
        <Loader className="w-12 h-12 text-accent-500 animate-spin" />
        <p className="mt-4 text-primary-300">Loading your home feed...</p>
    </motion.div>
);

// Profile Card Component
// Placeholder Components for Dashboard
const TimelinePlaceholder = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-2xl p-8 space-y-6 bg-primary-900/50 backdrop-blur-md border border-primary-700/50 shadow-2xl rounded-2xl text-center"
    >
        <h2 className="text-3xl font-bold text-white mb-4">Your Timeline</h2>
        <p className="text-primary-300 mb-6">This is where your personalized feed will appear. Stay tuned for updates!</p>
        
        <div className="space-y-4">
            {/* Placeholder Post 1 */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-primary-800/30 p-4 rounded-lg text-left border border-primary-700/50"
            >
                <div className="flex items-center mb-2">
                    <UserCircle className="w-8 h-8 text-accent-500 mr-3" />
                    <div>
                        <p className="font-semibold text-white">User Name</p>
                        <p className="text-sm text-primary-400">@username • 2h ago</p>
                    </div>
                </div>
                <p className="text-primary-200">This is a placeholder for a social media post. Imagine engaging content, images, and more!</p>
            </motion.div>

            {/* Placeholder Post 2 */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="bg-primary-800/30 p-4 rounded-lg text-left border border-primary-700/50"
            >
                <div className="flex items-center mb-2">
                    <UserCircle className="w-8 h-8 text-accent-500 mr-3" />
                    <div>
                        <p className="font-semibold text-white">Another User</p>
                        <p className="text-sm text-primary-400">@anotheruser • 5h ago</p>
                    </div>
                </div>
                <p className="text-primary-200">Excited to share new features soon! #Cirqle #SocialMedia</p>
            </motion.div>
        </div>
    </motion.div>
);

const StoriesPlaceholder = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-2xl p-8 space-y-6 bg-primary-900/50 backdrop-blur-md border border-primary-700/50 shadow-2xl rounded-2xl text-center"
    >
        <h2 className="text-3xl font-bold text-white mb-4">Stories</h2>
        <p className="text-primary-300 mb-6">Catch up on ephemeral moments from your friends.</p>
        <div className="flex justify-center space-x-4">
            {/* Placeholder Story 1 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="w-24 h-36 bg-primary-800/30 rounded-lg flex flex-col items-center justify-center text-primary-500 border border-primary-700/50 p-2"
            >
                <UserCircle className="w-12 h-12 text-accent-500 mb-2" />
                <p className="text-sm text-white">User 1</p>
            </motion.div>
            {/* Placeholder Story 2 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="w-24 h-36 bg-primary-800/30 rounded-lg flex flex-col items-center justify-center text-primary-500 border border-primary-700/50 p-2"
            >
                <UserCircle className="w-12 h-12 text-accent-500 mb-2" />
                <p className="text-sm text-white">User 2</p>
            </motion.div>
            {/* Placeholder Story 3 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="w-24 h-36 bg-primary-800/30 rounded-lg flex flex-col items-center justify-center text-primary-500 border border-primary-700/50 p-2"
            >
                <UserCircle className="w-12 h-12 text-accent-500 mb-2" />
                <p className="text-sm text-white">User 3</p>
            </motion.div>
        </div>
    </motion.div>
);

const MessagesPlaceholder = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="w-full max-w-2xl p-8 space-y-6 bg-primary-900/50 backdrop-blur-md border border-primary-700/50 shadow-2xl rounded-2xl text-center"
    >
        <h2 className="text-3xl font-bold text-white mb-4">Messages</h2>
        <p className="text-primary-300 mb-6">Connect privately with your friends.</p>
        <div className="space-y-3">
            {/* Placeholder Message 1 */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="flex items-center bg-primary-800/30 p-3 rounded-lg border border-primary-700/50"
            >
                <UserCircle className="w-6 h-6 text-accent-500 mr-3" />
                <div>
                    <p className="font-semibold text-white">Friend A</p>
                    <p className="text-sm text-primary-200">Hey, how are you?</p>
                </div>
            </motion.div>
            {/* Placeholder Message 2 */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="flex items-center justify-end bg-primary-800/30 p-3 rounded-lg border border-primary-700/50"
            >
                <div>
                    <p className="font-semibold text-white text-right">You</p>
                    <p className="text-sm text-primary-200 text-right">I&apos;m doing great, thanks!</p>
                </div>
                <UserCircle className="w-6 h-6 text-accent-500 ml-3" />
            </motion.div>
        </div>
    </motion.div>
);

export default function HomePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
      }
      setLoading(false);
    }
    checkUser();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-900 text-white">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-900 via-slate-900 to-blue-900/50 animate-background-pan -z-10" />
      
      <Header onSignOut={handleSignOut} />

      <main className="flex-grow flex flex-col items-center justify-center w-full space-y-8 mt-20">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Link href="/settings/profile" className="flex items-center text-primary-200 hover:text-accent-500 transition-colors duration-300 font-semibold py-2 px-4 rounded-lg bg-primary-800/50 hover:bg-primary-700/50">
              <UserCircle className="mr-2 h-5 w-5" />
              Edit Profile
            </Link>
            <TimelinePlaceholder />
            <StoriesPlaceholder />
            <MessagesPlaceholder />
          </>
        )}
      </main>
    </div>
  );
}