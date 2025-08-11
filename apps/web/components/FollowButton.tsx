'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import LoadingState from './LoadingState';

interface FollowButtonProps {
  targetUserId: string; // Renamed from userIdToFollow
  currentUserId: string; // Added
  initialIsFollowing: boolean;
  onFollowSuccess?: () => void; // Added
  onUnfollowSuccess?: () => void; // Added
}

const FollowButton = ({ targetUserId, currentUserId, initialIsFollowing, onFollowSuccess, onUnfollowSuccess }: FollowButtonProps) => {
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

    // Prevent self-follow
    if (targetUserId === currentUserId) {
      console.warn('Cannot follow/unfollow yourself.');
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
        body: JSON.stringify({ following_id: targetUserId }), // Use targetUserId
      });

      if (!response.ok) {
        throw new Error('Failed to update follow status');
      }

      setIsFollowing(!isFollowing);
      // Call appropriate success callback
      if (!isFollowing && onFollowSuccess) { // If was not following and now is
        onFollowSuccess();
      } else if (isFollowing && onUnfollowSuccess) { // If was following and now is not
        onUnfollowSuccess();
      }
      // Removed onToggleFollow as it's replaced by specific callbacks
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
      className={`relative px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 w-28 flex items-center justify-center ${isFollowing
          ? 'bg-transparent border border-accent-main text-accent-main'
          : 'bg-accent-main text-text-light'
        } ${isLoading ? 'cursor-not-allowed' : ''}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingState type="dots" size="sm" />
        </div>
      )}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {isFollowing ? 'Following' : 'Follow'}
      </span>
    </motion.button>
  );
};

export default FollowButton;
