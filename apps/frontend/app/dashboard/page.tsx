'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { LogOut, UserCircle, Loader } from 'lucide-react';
import Link from 'next/link';

// Header Component for Dashboard
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
    <div className="flex flex-col items-center justify-center">
        <Loader className="w-12 h-12 text-accent-500 animate-spin" />
        <p className="mt-4 text-primary-300">Loading your dashboard...</p>
    </div>
);

// Profile Card Component
const ProfileCard = ({ profile, user }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="w-full max-w-2xl p-8 space-y-6 bg-primary-900/50 backdrop-blur-md border border-primary-700/50 shadow-2xl rounded-2xl"
    >
        <div className="flex flex-col items-center md:flex-row md:items-start text-center md:text-left space-y-4 md:space-y-0 md:space-x-6">
            <UserCircle className="w-24 h-24 text-accent-500" strokeWidth={1.5} />
            <div className="flex-grow">
                <h2 className="text-3xl md:text-4xl font-bold text-white">{profile.full_name || 'User'}</h2>
                <p className="text-lg text-accent-400">@{profile.username || user.email}</p>
                <p className="mt-4 text-primary-300">Welcome to your personal space. Here you can manage your posts, view your stats, and connect with your community.</p>
            </div>
        </div>
    </motion.div>
);

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserAndProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }
      setUser(user);

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile({ full_name: 'Welcome', username: user.email }); // Fallback
      } else {
        setProfile(profileData);
      }
      setLoading(false);
    }

    getUserAndProfile();
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

      <main className="flex-grow flex items-center justify-center w-full">
        {loading ? (
          <LoadingSpinner />
        ) : user && profile ? (
          <ProfileCard profile={profile} user={user} />
        ) : (
            <p className="text-red-400">Could not load user profile. Please try again later.</p>
        )}
      </main>
    </div>
  );
}