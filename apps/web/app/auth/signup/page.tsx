'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

// Reusable Accent-colored Button for form submission
const AccentSubmitButton = ({ children, className = '' }) => (
  <button
    type="submit"
    className={`w-full inline-flex items-center justify-center text-text-light font-bold py-3 px-4 rounded-lg bg-accent-main hover:bg-accent-hover transition-all duration-300 ease-in-out shadow-lg hover:shadow-accent-main/40 ${className}`}>
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

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordCriteriaStatus, setPasswordCriteriaStatus] = useState(() =>
    passwordCriteria.map(c => ({ ...c, met: false }))
  );
  const supabase = createClientComponentClient();

  const validateFullName = (name: string) => {
    if (name.trim().length < 3) {
      setFullNameError('Full Name must be at least 3 characters long.');
      return false;
    }
    setFullNameError(null);
    return true;
  };

  const validateUsername = (username: string) => {
    if (username.length === 0) {
      setUsernameError('Username cannot be empty.');
      return false;
    }
    if (username.length === 1) {
      const alphaRegex = /^[a-zA-Z]$/;
      if (!alphaRegex.test(username)) {
        setUsernameError('Single character username must be an alphabet letter.');
        return false;
      }
    } else {
      const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
      if (!usernameRegex.test(username)) {
        setUsernameError('Username can only contain alphanumeric, _, -, or .');
        return false;
      }
    }
    if (username.length > 20) {
      setUsernameError('Username cannot exceed 20 characters.');
      return false;
    }

    setUsernameError(null);
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePassword = (password: string) => {
    let allCriteriaMet = true;
    const updatedCriteriaStatus = passwordCriteria.map(criterion => {
      const met = criterion.regex.test(password);
      if (!met) {
        allCriteriaMet = false;
      }
      return { ...criterion, met };
    });
    setPasswordCriteriaStatus(updatedCriteriaStatus);

    if (!allCriteriaMet) {
      setPasswordError('Password does not meet all requirements.'); // Generic error message
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setFullNameError(null);
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);

    const isFullNameValid = validateFullName(fullName);
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isFullNameValid || !isUsernameValid || !isEmailValid || !isPasswordValid) {
      return; // Stop if client-side validation fails
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          username,
          full_name: fullName,
        },
      },
    });
    if (error) {
      let userFriendlyMessage = 'An unexpected error occurred during sign-up. Please try again.';
      if (error.message.includes('User already registered')) {
        userFriendlyMessage = 'This email address is already registered. Please try signing in or use a different email.';
      } else if (error.message.includes('Password should be at least 6 characters')) {
        userFriendlyMessage = 'Password is too short. Please ensure it meets the requirements.';
      } else if (error.message.includes('invalid_grant')) {
        userFriendlyMessage = 'Invalid credentials. Please check your email and password.';
      }
      setError(userFriendlyMessage);
    } else {
      setMessage('Check your email for a verification link!');
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
        className="w-full max-w-sm p-6 md:p-8 space-y-4 bg-background-medium/50 backdrop-blur-md border border-border-medium shadow-lg rounded-2xl"
      >
        <div className="text-center">
          <Link href="/" className="text-3xl md:text-4xl font-bold inline-block mb-2 text-text-light">
            Cirqle
          </Link>
          <h2 className="text-xl md:text-2xl font-bold text-text-light">Create Your Account</h2>
          <p className="text-sm text-text-muted">Join the community and start sharing.</p>
        </div>

        {message ? (
          <p className="text-accent-main bg-accent-subtle border border-accent-subtle p-3 rounded-lg text-sm text-center">{message}</p>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-text-light block mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => {
                  const cleanedName = e.target.value.replace(/\s+/g, ' ').trim();
                  setFullName(cleanedName);
                }}
                onBlur={(e) => validateFullName(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-background-medium/50 border border-primary-700 text-text-light placeholder-neutral-muted focus:outline-none focus:ring-2 focus:ring-accent-main transition-all duration-300"
              />
              {fullNameError && <p className="text-red-400 text-xs mt-1">{fullNameError}</p>}
            </div>
            <div>
              <label className="text-sm font-bold text-text-light block mb-2">Username</label>
              <input
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                onBlur={(e) => validateUsername(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-background-medium/50 border border-primary-700 text-text-light placeholder-neutral-muted focus:outline-none focus:ring-2 focus:ring-accent-main transition-all duration-300"
              />
              {usernameError && <p className="text-red-400 text-xs mt-1">{usernameError}</p>}
            </div>
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value); // Call validation on change
                }}
                onBlur={(e) => validatePassword(e.target.value)} // Keep onBlur for final check
                required
                className="w-full p-3 rounded-lg bg-background-medium/50 border border-primary-700 text-text-light placeholder-neutral-muted focus:outline-none focus:ring-2 focus:ring-accent-main transition-all duration-300"
              />
              <ul className="text-xs mt-1 space-y-1 list-disc list-inside">
                {passwordCriteriaStatus.map(criterion => (
                  <li key={criterion.id} className={criterion.met ? 'text-green-500' : 'text-text-muted'}>
                    {criterion.text}
                  </li>
                ))}
              </ul>
              {passwordError && <p className="text-red-400 text-xs mt-1">{passwordError}</p>}
            </div>

            <AccentSubmitButton>
              <UserPlus className="mr-2 h-5 w-5" />
              <span>Sign Up</span>
            </AccentSubmitButton>

            {error && <p className="text-red-400 bg-red-900/50 border border-red-400/50 p-3 rounded-lg text-sm text-center">{error}</p>}
          </form>
        )}

        <p className="text-center text-sm text-text-muted">
          Already have an account? {' '}
          <Link href="/auth/signin" className="font-semibold text-accent-main hover:text-accent-hover transition-colors duration-300">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}