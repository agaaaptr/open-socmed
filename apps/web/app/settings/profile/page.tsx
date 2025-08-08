'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Save, ArrowLeft } from 'lucide-react';
import LoadingState from '../../../components/LoadingState';
import Link from 'next/link';

export default function EditProfilePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [initialUsername, setInitialUsername] = useState('');
  const [initialFullName, setInitialFullName] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      setSuccess('');
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/signin');
        return;
      }

      try {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) {
          throw new Error('No access token found.');
        }

        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile.');
        }

        const data = await response.json();
        setProfile({
          full_name: data.full_name || '',
          username: data.username || '',
        });
        setInitialUsername(data.username || '');
        setInitialFullName(data.full_name || '');
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [supabase, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'full_name') {
      processedValue = value.replace(/\s+/g, ' ').trim();
    } else if (name === 'username') {
      processedValue = value.toLowerCase();
    }
    setProfile((prev) => ({ ...prev, [name]: processedValue }));
    if (name === 'username') {
      setUsernameAvailable(null); // Reset availability on change
      setUsernameError(null); // Clear username error on change
      validateUsername(processedValue); // Use processedValue
    }
    if (name === 'full_name') {
      validateFullName(processedValue); // Use processedValue
    }
  };

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

  const checkUsernameAvailability = async () => {
    if (!validateUsername(profile.username)) return;
    setCheckingUsername(true);
    setUsernameError(null);
    setUsernameAvailable(null);
    try {
      const response = await fetch(`/api/check-username?username=${profile.username}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error checking username');
      }
      setUsernameAvailable(data.available);
      if (!data.available) {
        setUsernameError('Username is already taken.');
      }
    } catch (err: any) {
      setUsernameError(err.message || 'Failed to check username availability. Please try again.');
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isFullNameValid = validateFullName(profile.full_name);
    const isUsernameValid = validateUsername(profile.username);

    if (!isFullNameValid || !isUsernameValid) {
      setError('Please fix the errors before submitting.');
      return;
    }

    // Only check username availability if the username has changed
    if (profile.username !== initialUsername && usernameAvailable !== true) {
      setError('Please check the availability of your chosen username.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        throw new Error('No access token found.');
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let userFriendlyMessage = 'Failed to update profile. Please try again.';

        if (errorData.message) {
          if (errorData.message.includes('username already taken')) {
            userFriendlyMessage = 'The username you entered is already taken. Please choose a different one.';
          } else if (errorData.message.includes('invalid full name')) {
            userFriendlyMessage = 'Full name is invalid. It must be at least 3 characters long.';
          } else if (errorData.message.includes('Unauthorized')) {
            userFriendlyMessage = 'You are not authorized to perform this action. Please sign in again.';
          } else {
            userFriendlyMessage = errorData.message; // Fallback to backend message if not specific
          }
        }
        throw new Error(userFriendlyMessage);
      }

      setSuccess('Profile updated successfully!');
      // Optionally, refetch profile or update local state from response if needed
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasChanges = profile.full_name !== initialFullName || profile.username !== initialUsername;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background-dark text-text-light"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background-gradient-start via-background-gradient-end to-background-gradient-end animate-background-pan -z-10" />
        <LoadingState text="Loading profile data..." />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background-dark text-text-light">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background-gradient-start via-background-gradient-end to-background-gradient-end animate-background-pan -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="w-full max-w-xl md:max-w-2xl p-6 md:p-8 space-y-4 md:space-y-6 bg-background-medium/50 backdrop-blur-md border border-border-medium shadow-lg rounded-2xl z-10"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-text-light">Edit Profile</h1>
          <Link href="/profile" className="flex items-center text-text-light hover:text-accent-main transition-colors duration-300">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Profile Detail
          </Link>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 bg-red-900/30 p-3 rounded-md border border-red-700"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-400 bg-green-900/30 p-3 rounded-md"
          >
            {success}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-text-muted text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              onBlur={() => validateFullName(profile.full_name)}
              className="shadow appearance-none border border-border-medium rounded w-full py-2 px-3 text-text-light leading-tight focus:outline-none focus:shadow-outline bg-background-medium/50 placeholder-text-muted transition-all duration-300 focus:border-accent-main focus:ring-1 focus:ring-accent-main"
              placeholder="Your full name"
            />
            {fullNameError && <p className="text-red-400 text-xs mt-1">{fullNameError}</p>}
          </div>
          <div>
            <label htmlFor="username" className="block text-text-muted text-sm font-bold mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                value={profile.username}
                onChange={handleChange}
                onBlur={() => validateUsername(profile.username)}
                className="shadow appearance-none border border-border-medium rounded w-full py-2 px-3 text-text-light leading-tight focus:outline-none focus:shadow-outline bg-background-medium/50 placeholder-text-muted transition-all duration-300 focus:border-accent-main focus:ring-1 focus:ring-accent-main pr-24"
                placeholder="Your unique username"
              />
              <button
                type="button"
                onClick={checkUsernameAvailability}
                disabled={checkingUsername || !profile.username || !!usernameError || profile.username === initialUsername}
                className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-sm font-semibold text-accent-main hover:text-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkingUsername ? <LoadingState type="dots" /> : <span>Check</span>}
              </button>
            </div>
            <p className="text-text-muted text-xs mt-1">Username must be unique.</p>
            {usernameError && <p className="text-red-400 text-xs mt-1">{usernameError}</p>}
            {usernameAvailable === true && <p className="text-green-400 text-xs mt-1">Username is available!</p>}
            {usernameAvailable === false && !usernameError && <p className="text-red-400 text-xs mt-1">Username is already taken.</p>}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting || !hasChanges}
            className="w-full flex items-center justify-center bg-accent-main hover:bg-accent-hover text-text-light font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <LoadingState type="dots" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {submitting ? 'Saving...' : <span>Save Profile</span>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
