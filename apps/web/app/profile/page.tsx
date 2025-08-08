'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileRedirectPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchUserAndRedirect() {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace('/auth/signin');
        return;
      }

      // Directly redirect to my-profile, the loading state will be handled there.
      router.replace('/profile/my-profile');
    }

    fetchUserAndRedirect();
  }, [supabase, router]);

  return null; // This page should not render anything, just redirect
}