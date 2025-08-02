'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Loader, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditProfilePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    website: '',
    avatar_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
          website: data.website || '',
          avatar_url: data.avatar_url || '',
        });
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
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        throw new Error(errorData.message || 'Failed to update profile.');
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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-900 text-white"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-900 via-slate-900 to-blue-900/50 animate-background-pan -z-10" />
        <div className="flex flex-col items-center justify-center">
          <Loader className="w-12 h-12 text-accent-500 animate-spin" />
          <p className="mt-4 text-primary-300">Loading profile data...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-900 text-white">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-900 via-slate-900 to-blue-900/50 animate-background-pan -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="w-full max-w-2xl p-8 space-y-6 bg-primary-900/50 backdrop-blur-md border border-primary-700/50 shadow-2xl rounded-2xl z-10"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-white">Edit Profile</h1>
          <Link href="/home" className="flex items-center text-primary-200 hover:text-accent-500 transition-colors duration-300">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
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
            className="text-green-400 bg-green-900/30 p-3 rounded-md border border-green-700"
          >
            {success}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-primary-300 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              className="shadow appearance-none border border-primary-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-primary-800/50 placeholder-primary-400 transition-all duration-300 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-primary-300 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="shadow appearance-none border border-primary-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-primary-800/50 placeholder-primary-400 transition-all duration-300 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
              placeholder="Your unique username"
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-primary-300 text-sm font-bold mb-2">
              Website
            </label>
            <input
              type="text"
              id="website"
              name="website"
              value={profile.website}
              onChange={handleChange}
              className="shadow appearance-none border border-primary-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-primary-800/50 placeholder-primary-400 transition-all duration-300 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
              placeholder="Your website URL"
            />
          </div>
          <div>
            <label htmlFor="avatar_url" className="block text-primary-300 text-sm font-bold mb-2">
              Avatar URL
            </label>
            <input
              type="text"
              id="avatar_url"
              name="avatar_url"
              value={profile.avatar_url}
              onChange={handleChange}
              className="shadow appearance-none border border-primary-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-primary-800/50 placeholder-primary-400 transition-all duration-300 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
              placeholder="URL to your avatar image"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center bg-accent-600 hover:bg-accent-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {submitting ? 'Saving...' : 'Save Profile'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
