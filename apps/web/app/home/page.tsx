'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

import Timeline from '../../components/Timeline';
import MobileSuggestedFeatures from '../../components/MobileSuggestedFeatures';
import PullToRefresh from '../../components/PullToRefresh';
import SuggestedFeatures from '../../components/SuggestedFeatures';

// Loading Spinner Component
const LoadingSpinner = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-screen w-full absolute inset-0"
    >
        <Loader className="w-12 h-12 text-accent-main animate-spin" />
        <p className="mt-4 text-text-muted">Loading your home feed...</p>
    </motion.div>
);

export default function HomePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      console.log('Checking user...');
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.log('No user found, redirecting to signin.');
        router.push('/auth/signin');
        return; // Stop execution if no user
      }

      console.log('User found:', user);
      setLoading(false); // Set loading to false once user is confirmed

      // Prevent going back to landing page if already logged in
      const handlePopState = () => {
        console.log('Popstate event triggered. Current path:', window.location.pathname);
        if (window.location.pathname === '/') {
          console.log('Attempting to go back to landing page, redirecting to home.');
          router.replace('/home');
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        console.log('Removing popstate listener.');
        window.removeEventListener('popstate', handlePopState);
      };
    };

    checkUser();
  }, [supabase, router]);

  return (
    <div className="w-full p-4 md:p-8">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-screen-xl mx-auto">
          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col space-y-6 md:space-y-8">
            <PullToRefresh>
              <Timeline />
            </PullToRefresh>
          </div>
          {/* Right Sidebar for Suggested Features (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <SuggestedFeatures />
          </div>
          {/* Floating Suggested Features (Mobile) */}
          <MobileSuggestedFeatures />
        </div>
      )}
    </div>
  );
}
