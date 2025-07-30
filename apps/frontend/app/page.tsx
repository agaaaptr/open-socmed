'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/dashboard'); // Redirect to dashboard if user is logged in
      }
      setUser(user);
    }
    getUser();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="w-full p-4 bg-gray-800 shadow-md flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition duration-200">
          Cirqle
        </Link>
        <nav>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="py-2 px-4 border border-blue-400 text-blue-400 rounded-md hover:bg-blue-400 hover:text-white transition duration-200">
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition duration-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link href="/auth/login" className="py-2 px-4 border border-blue-400 text-blue-400 rounded-md hover:bg-blue-400 hover:text-white transition duration-200">
                Sign In
              </Link>
              <Link href="/auth/signup" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition duration-200">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-5xl font-extrabold mb-4 text-blue-400">
          Connect with the World
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mb-8">
          Join Cirqle to share your moments, discover new friends, and explore communities.
        </p>
        {!user && (
          <div className="space-x-4">
            <Link href="/auth/signup" className="py-3 px-8 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition duration-200">
              Get Started
            </Link>
          </div>
        )}
      </main>

      {/* Footer Content */}
      <footer className="w-full p-4 bg-gray-800 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Cirqle. All rights reserved.
      </footer>
    </div>
  );
}
