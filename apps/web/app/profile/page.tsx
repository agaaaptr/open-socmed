
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LoadingState from '../../components/LoadingState';

export default function ProfileRedirectPage() {
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

      // Fetch the profile to get the username
      try {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) throw new Error('No access token found.');

        router.replace('/profile/my-profile');
      } catch (err) {
        console.error('Error fetching user profile for redirect:', err);
        router.replace('/home'); // Redirect to home on error
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

  return null; // Should not render anything if redirecting
}
