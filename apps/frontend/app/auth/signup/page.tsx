'use client';

// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  // const supabase = createClientComponentClient();
  // const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // const { error } = await supabase.auth.signUp({ email, password });
    // if (error) {
    //   setError(error.message);
    // } else {
    //   alert('Check your email for a verification link!');
    //   router.push('/auth/login'); // Redirect to login after successful signup
    // }
    setError('Sign-up is temporarily disabled. Backend integration pending.');
  };

  const handleGoogleSignIn = async () => {
    // await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: {
    //     redirectTo: `${window.location.origin}/auth/callback`,
    //   },
    // });
    setError('Google Sign-up is temporarily disabled. Backend integration pending.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-md font-semibold transition duration-200"
          >
            Sign Up
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition duration-200 flex items-center justify-center space-x-2"
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
          <span>Sign Up with Google</span>
        </button>

        <p className="text-center text-sm mt-6">
          Already have an account? {' '}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}