'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

import Sidebar from '../../components/Sidebar';

import Timeline from '../../components/Timeline';
import SuggestedFeatures from '../../components/SuggestedFeatures';

// Loading Spinner Component
const LoadingSpinner = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-screen w-full"
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
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
      } else {
        // Prevent going back to landing page if already logged in
        const handlePopState = () => {
          if (window.location.pathname === '/') {
            router.replace('/home');
          }
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
          window.removeEventListener('popstate', handlePopState);
        };
      }
      setLoading(false);
    }
    checkUser();
  }, [supabase, router]);

  return (
    <div className="min-h-screen flex text-text-light">
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-900 via-primary-900 to-blue-900/50 animate-background-pan -z-10" />
      
      <Sidebar />

      <main className="flex-grow flex flex-col md:ml-64 p-8">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-screen-xl mx-auto">
            {/* Main Content Area */}
            <div className="lg:col-span-2 flex flex-col space-y-8">
              <Timeline />
            </div>

            {/* Right Sidebar for Suggested Features */}
            <div className="lg:col-span-1">
              <SuggestedFeatures />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
