'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import LoadingState from './LoadingState';

interface FollowButtonProps {
  userIdToFollow: string;
  initialIsFollowing: boolean;
  onToggleFollow?: (userId: string, newStatus: boolean) => void;
}

const FollowButton = ({ userIdToFollow, initialIsFollowing, onToggleFollow }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollowToggle = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Not authenticated');
      setIsLoading(false);
      return;
    }

    const endpoint = '/api/follow';
    const method = isFollowing ? 'DELETE' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ following_id: userIdToFollow }),
      });

      if (!response.ok) {
        throw new Error('Failed to update follow status');
      }

      setIsFollowing(!isFollowing);
      if (onToggleFollow) {
        onToggleFollow(userIdToFollow, !isFollowing);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleFollowToggle}
      disabled={isLoading}
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      whileTap={{ scale: isLoading ? 1 : 0.95 }}
      className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 w-28 ${isFollowing
          ? 'bg-transparent border border-accent-main text-accent-main'
          : 'bg-accent-main text-text-light'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {isLoading ? <LoadingState type="dots" /> : (isFollowing ? 'Following' : 'Follow')}
    </motion.button>
  );
};

export default FollowButton;
