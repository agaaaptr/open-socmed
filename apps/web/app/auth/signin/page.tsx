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
      className={`w-full inline-flex items-center justify-center text-text-light font-bold py-3 px-4 rounded-lg bg-accent-main hover:bg-accent-hover transition-all duration-300 ease-in-out shadow-lg hover:shadow-accent-main/40 transform hover:scale-105 ${className}`}>
      {children}
    </button>
  );

const passwordCriteria = [
  { id: 'length', text: 'Password must be at least 6 characters long.', regex: /.{6,}/ },
  { id: 'uppercase', text: 'Password must contain at least one uppercase letter.', regex: /[A-Z]/ },
  { id: 'lowercase', text: 'Password must contain at least one lowercase letter.', regex: /[a-z]/ },
  { id: 'number', text: 'Password must contain at least one number.', regex: /[0-9]/ },
  { id: 'specialChar', text: 'Password must contain at least one special character.', regex: /[^A-Za-z0-9]/ },
];

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const validateEmail = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(input)) {
      setEmailError(null);
      return true;
    }
    setEmailError('Please enter a valid email address.');
    return false;
  };

  const validatePassword = (password: string) => {
    let errors: string[] = [];
    passwordCriteria.forEach(criterion => {
      if (!criterion.regex.test(password)) {
        errors.push(criterion.text);
      }
    });

    if (errors.length > 0) {
      setPasswordError(errors.join(' ')); // Still join for a general error message
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    setPasswordError(null);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return; // Stop if client-side validation fails
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        let userFriendlyMessage = 'An unexpected error occurred. Please try again.';
        if (signInError.message.includes('Invalid login credentials')) {
          userFriendlyMessage = 'Email or password incorrect. Please check your credentials.';
        } else if (signInError.message.includes('Email not confirmed')) {
          userFriendlyMessage = 'Please confirm your email address to sign in.';
        }
        setError(userFriendlyMessage);
        return;
      }

      if (data.user) {
        router.replace('/home');
        router.refresh();
      } else {
        setError('Sign-in failed: No user data returned.');
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background-dark">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background-gradient-start via-background-gradient-end to-background-gradient-end animate-background-pan -z-10" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="w-full max-w-sm p-6 md:p-8 space-y-6 bg-background-medium/50 backdrop-blur-md border border-border-medium shadow-lg rounded-2xl"
      >
        <div className="text-center">
          <Link href="/" className="text-3xl md:text-4xl font-bold inline-block mb-2 text-text-light">
            Cirqle
          </Link>
          <h2 className="text-xl md:text-2xl font-bold text-text-light">Welcome Back</h2>
          <p className="text-sm text-text-muted">Sign in to continue your journey.</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-text-light block mb-2">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => validateEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-background-medium/50 border border-primary-700 text-text-light placeholder-neutral-muted focus:outline-none focus:ring-2 focus:ring-accent-main transition-all duration-300"
            />
            {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
          </div>
          <div>
            <label className="text-sm font-bold text-text-light block mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => validatePassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-background-medium/50 border border-primary-700 text-text-light placeholder-neutral-muted focus:outline-none focus:ring-2 focus:ring-accent-main transition-all duration-300"
            />
            {passwordError && (
              <ul className="text-red-400 text-xs mt-1 space-y-1">
                {passwordError.split(' ').map((errorItem, index) => (
                  <li key={index}>{errorItem}</li>
                ))}
              </ul>
            )}
          </div>

          <AccentSubmitButton>
            <LogIn className="mr-2 h-5 w-5" />
            <span>Sign In</span>
          </AccentSubmitButton>

          {error && <p className="text-red-400 bg-red-900/50 border border-red-400/50 p-3 rounded-lg text-sm text-center">{error}</p>}
        </form>

        <p className="text-center text-sm text-text-muted">
          Don&apos;t have an account? {' '}
          <Link href="/auth/signup" className="font-semibold text-accent-main hover:text-accent-hover transition-colors duration-300">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
