'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Loader, LogOut, Edit } from 'lucide-react';
import Link from 'next/link';

export default function ProfileViewPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [profile, setProfile] = useState<{ full_name: string; username: string; avatar_url?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/signin');
        return;
      }

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
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile.');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background-dark text-text-light"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background-gradient-start via-background-gradient-end to-background-gradient-end animate-background-pan -z-10" />
        <div className="flex flex-col items-center justify-center">
          <Loader className="w-12 h-12 text-accent-main animate-spin" />
          <p className="mt-4 text-text-muted">Loading profile data...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background-dark text-text-light"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background-gradient-start via-background-gradient-end to-background-gradient-end animate-background-pan -z-10" />
        <p className="text-red-400 text-lg">Error: {error}</p>
        <Link href="/home" className="mt-4 text-accent-main hover:underline">Go back to Home</Link>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background-dark text-text-light">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background-gradient-start via-background-gradient-end to-background-gradient-end animate-background-pan -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="w-full max-w-2xl p-8 space-y-6 bg-background-medium/50 backdrop-blur-md border border-border-medium shadow-lg rounded-2xl z-10"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-text-light">Your Profile</h1>
          <Link href="/settings/profile" className="flex items-center text-text-light hover:text-accent-main transition-colors duration-300">
            <Edit className="mr-2 h-5 w-5" />
            Edit Profile
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <UserCircle className="w-24 h-24 text-accent-main" />
            <div>
              <p className="text-2xl font-semibold text-text-light">{profile?.full_name}</p>
              <p className="text-lg text-text-muted">@{profile?.username}</p>
            </div>
          </div>
          {/* Add more profile fields here if needed */}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleSignOut}
            className="flex items-center py-3 px-6 bg-red-600 hover:bg-red-700 rounded-full font-semibold text-text-light transition-colors duration-300 shadow-lg"
          >
            <LogOut className="mr-2 h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
