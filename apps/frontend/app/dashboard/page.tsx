'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

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
        router.push('/auth/login');
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
        // Handle case where profile might not exist yet (e.g., if trigger failed)
        setProfile({ full_name: user.email, username: user.email }); // Fallback to email
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to your Dashboard!</h2>
        {user && profile && (
          <p className="text-xl text-gray-300 mb-6">
            Hello, {profile.full_name || profile.username || user.email}!
          </p>
        )}
        <button
          onClick={handleSignOut}
          className="py-3 px-6 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition duration-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
