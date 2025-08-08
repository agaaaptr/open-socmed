'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LoadingState from '../../../components/LoadingState';

export default function MyProfileRedirectPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndRedirect() {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace('/auth/signin');
        return;
      }

      try {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) throw new Error('No access token found.');

        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile.');
        }

        const data = await response.json();
        if (data.username) {
          router.replace(`/profile/${data.username}`);
        } else {
          console.warn('Username not found in profile data, redirecting to home.');
          router.replace('/home');
        }
      } catch (err) {
        console.error('Error fetching user profile for redirect:', err);
        router.replace('/home');
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndRedirect();
  }, [supabase, router]);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center bg-background-dark text-text-light">
        <LoadingState text="Loading your profile..." />
      </motion.div>
    );
  }

  return null;
}
