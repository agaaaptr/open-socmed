'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

// Reusable Accent-colored Button for form submission
const AccentSubmitButton = ({ children, className = '' }) => (
    <button
      type="submit"
      className={`w-full inline-flex items-center justify-center text-primary-900 font-bold py-3 px-4 rounded-lg bg-accent-500 hover:bg-accent-400 transition-all duration-300 ease-in-out shadow-lg hover:shadow-accent-500/40 transform hover:scale-105 ${className}`}>
      {children}
    </button>
  );

export default function SignInPage() {
  const [identifier, setIdentifier] = useState(''); // Can be email or username
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const validateIdentifier = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_.-]{3,20}$/;

    if (emailRegex.test(input) || usernameRegex.test(input)) {
      setIdentifierError(null);
      return true;
    }
    setIdentifierError('Please enter a valid email address or username.');
    return false;
  };

  const validatePassword = (password: string) => {
    let errors: string[] = [];
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number.');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character.');
    }

    if (errors.length > 0) {
      setPasswordError(errors.join(' '));
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIdentifierError(null);
    setPasswordError(null);

    const isIdentifierValid = validateIdentifier(identifier);
    const isPasswordValid = validatePassword(password);

    if (!isIdentifierValid || !isPasswordValid) {
      return; // Stop if client-side validation fails
    }

    // --- Placeholder for new backend API call ---
    // This part will be replaced with an actual API call to your Go backend
    // For now, it will simulate a successful login or an error.
    console.log('Attempting sign-in with:', { identifier, password });

    // Simulate API call
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      setError('Received an invalid response from the server. Please try again.');
      return;
    }

    if (!response.ok) {
      setError(data.message || 'An unexpected error occurred. Please check your credentials.');
    } else {
      // Assuming successful login returns a session or redirects
      // For now, we'll just redirect to home
      router.push('/home');
      router.refresh();
    }
    // --- End Placeholder ---
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-primary-900">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-900 via-slate-900 to-primary-800/50 animate-background-pan -z-10" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="w-full max-w-md p-8 space-y-6 bg-primary-900/50 backdrop-blur-md border border-primary-700/50 shadow-2xl rounded-2xl"
      >
        <div className="text-center">
          <Link href="/" className="text-4xl font-bold inline-block mb-2 text-white">
            Cirqle
          </Link>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-primary-300">Sign in to continue your journey.</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-primary-200 block mb-2">Username or Email</label>
            <input
              type="text"
              placeholder="yourusername or you@example.com"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                validateIdentifier(e.target.value); // Validate on change
              }}
              required
              className="w-full p-3 rounded-lg bg-slate-800/50 border border-primary-700 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all duration-300"
            />
            {identifierError && <p className="text-red-400 text-xs mt-1">{identifierError}</p>}
          </div>
          <div>
            <label className="text-sm font-bold text-primary-200 block mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value); // Validate on change
              }}
              required
              className="w-full p-3 rounded-lg bg-slate-800/50 border border-primary-700 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all duration-300"
            />
            <p className="text-primary-400 text-xs mt-1">
              Password must be at least 6 characters, include uppercase, lowercase, number, and special character.
            </p>
            {passwordError && <p className="text-red-400 text-xs mt-1">{passwordError}</p>}
          </div>

          <AccentSubmitButton>
            <LogIn className="mr-2 h-5 w-5" />
            <span>Sign In</span>
          </AccentSubmitButton>

          {error && <p className="text-red-400 bg-red-900/50 border border-red-400/50 p-3 rounded-lg text-sm text-center">{error}</p>}
        </form>

        <p className="text-center text-sm text-primary-300">
          Don&apos;t have an account? {' '}
          <Link href="/auth/signup" className="font-semibold text-accent-500 hover:text-accent-400 transition-colors duration-300">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
