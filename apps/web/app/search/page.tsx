
'use client';

import { motion } from 'framer-motion';
import { Search as SearchIcon, UserCircle, ArrowLeft } from 'lucide-react';
import LoadingState from '../../components/LoadingState';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@uidotdev/usehooks';
import FollowButton from '@/components/FollowButton';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SearchResultUser {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  is_following: boolean;
}

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResultUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, [supabase]);

  const searchUsers = useCallback(async (query: string) => {
    // Ensure currentUserId and supabase are available before proceeding
    if (!currentUserId) {
      return;
    }
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search-users?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results.');
      }
      const data = await response.json();

      // Fetch current user's following list
      const followingResponse = await fetch(`/api/following?user_id=${currentUserId}`, {
        headers: { 'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` },
      });
      let followingIds: Set<string> = new Set();
      if (followingResponse.ok) {
        const followingData = await followingResponse.json();
        if (Array.isArray(followingData)) {
          followingData.forEach((f: any) => followingIds.add(f.id));
        }
      }

      const usersWithFollowStatus = data.map((user: any) => ({
        ...user,
        is_following: followingIds.has(user.id),
      }));
      setResults(usersWithFollowStatus);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, supabase]);

  useEffect(() => {
    searchUsers(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchUsers]);

  const handleToggleFollow = useCallback((userId: string, newStatus: boolean) => {
    setResults(prevResults =>
      prevResults.map(user =>
        user.id === userId ? { ...user, is_following: newStatus } : user
      )
    );
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-text-light p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center mb-8"
        >
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search for users by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 bg-background-medium rounded-full border border-border-medium text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-main transition-all duration-300 pl-12 pr-4"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          </div>
        </motion.div>

        <div className="space-y-4">
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <LoadingState text="Searching users..." />
            </div>
          )}
          {error && <p className="text-center text-red-400">{error}</p>}
          {!isLoading && !error && results.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, ease: 'easeOut' }}
              className="bg-background-light p-4 rounded-lg flex items-center justify-between shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Link href={`/profile/${user.username}`} className="flex items-center space-x-4">
                <div className="relative w-12 h-12 rounded-full bg-background-medium flex items-center justify-center overflow-hidden">
                  {user.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.full_name} layout="fill" objectFit="cover" />
                  ) : (
                    <UserCircle className="w-8 h-8 text-accent-main" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-text-light">{user.full_name}</p>
                  <p className="text-sm text-text-muted">@{user.username}</p>
                </div>
              </Link>
              {user.id !== currentUserId && (
                <FollowButton userIdToFollow={user.id} initialIsFollowing={user.is_following} onToggleFollow={handleToggleFollow} />
              )}
            </motion.div>
          ))}
          {!isLoading && !error && debouncedSearchTerm && results.length === 0 && (
             <p className="text-center text-text-muted">No users found for &quot;{debouncedSearchTerm}&quot;.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
