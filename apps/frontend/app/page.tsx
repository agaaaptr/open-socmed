'use client';

import { createClientComponentClient, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function Home() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('sign-in'); // 'sign-in' or 'sign-up'

  useEffect(() => {
    const supabaseClient = createClientComponentClient();
    setSupabase(supabaseClient);

    async function getUser() {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error(error.message);
    else {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) console.error(error.message);
    else {
      alert('Check your email for a verification link!');
      setView('sign-in');
    }
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="z-10 w-full max-w-md p-8 bg-white rounded-lg shadow-xl text-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">
          {user ? `Welcome, ${user.email}` : 'Open Socmed'}
        </h1>

        {user ? (
          <div className="text-center">
            <p className="mb-4">You are logged in!</p>
            <button
              onClick={handleSignOut}
              className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 rounded-md text-white font-semibold transition duration-200"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {view === 'sign-in' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold transition duration-200"
                >
                  Sign In
                </button>
                <p className="text-center text-sm">
                  Don&apos;t have an account? {' '}
                  <button type="button" onClick={() => setView('sign-up')} className="text-blue-500 hover:underline">
                    Sign Up
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 rounded-md text-white font-semibold transition duration-200"
                >
                  Sign Up
                </button>
                <p className="text-center text-sm">
                  Already have an account? {' '}
                  <button type="button" onClick={() => setView('sign-in')} className="text-green-500 hover:underline">
                    Sign In
                  </button>
                </p>
              </form>
            )}

            <div className="relative flex items-center justify-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 rounded-md text-white font-semibold transition duration-200 flex items-center justify-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12.0003 4.75C14.0503 4.75 15.8303 5.45 17.2403 6.76L20.0403 3.96C18.0303 2.15 15.2303 1 12.0003 1C7.72031 1 4.00031 3.47 2.32031 7.02L5.62031 9.62C6.48031 7.41 9.02031 4.75 12.0003 4.75Z"
                />
                <path
                  d="M23.0003 12.0003C23.0003 11.3403 22.9403 10.6903 22.8203 10.0603H12.0003V14.0003H18.4803C18.1803 15.6703 17.2303 17.0603 15.9003 17.9903L19.2903 20.6903C21.2103 18.9303 23.0003 16.0403 23.0003 12.0003Z"
                />
                <path
                  d="M5.62031 9.62001L2.32031 7.02001C2.07031 7.62001 1.89031 8.26001 1.89031 8.91001C1.89031 9.56001 2.07031 10.2003 2.32031 10.8003L5.62031 13.4003C4.92031 11.6903 4.92031 10.3303 5.62031 9.62001Z"
                />
                <path
                  d="M12.0003 19.25C9.02031 19.25 6.48031 16.59 5.62031 13.4003L2.32031 16.0003C4.00031 19.5503 7.72031 22.0003 12.0003 22.0003C14.7703 22.0003 17.2303 21.1303 19.2903 20.6903L15.9003 17.9903C14.5703 17.0603 13.6203 15.6703 12.0003 19.25Z"
                />
              </svg>
              <span>Sign In with Google</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}