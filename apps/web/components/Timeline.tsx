'use client';

import { motion } from 'framer-motion';
import { UserCircle, Heart, MessageCircle, Share2 } from 'lucide-react';
import LoadingState from './LoadingState';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

interface TimelineProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const Timeline = ({ posts, setPosts }: TimelineProps) => {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          throw new Error('User not authenticated. Please sign in.');
        }

        const token = session.access_token;

        const response = await fetch('/api/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch posts.');
        }

        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err: any) {
        console.error('Error fetching posts:', err);
        setError(err.message || 'Failed to load posts.');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [supabase, setPosts]);

  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingState text="Loading posts..." />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-400">Error: {error}</p>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-text-muted py-10 bg-background-light rounded-lg">
        <p className="text-lg font-semibold">No posts yet.</p>
        <p>Be the first to post something!</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="w-full p-4 md:p-6 bg-background-medium/50 backdrop-blur-md border border-border-medium shadow-lg rounded-2xl"
    >
      <h2 className="text-xl md:text-2xl font-bold text-text-light mb-4">Your Timeline</h2>
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            variants={postVariants}
            className="bg-background-medium/30 p-4 md:p-5 rounded-xl border border-border-subtle"
          >
            <div className="flex items-center mb-3">
              {post.user?.avatar_url ? (
                <Image src={post.user.avatar_url} alt={post.user.full_name} width={40} height={40} className="rounded-full mr-3 md:mr-4" />
              ) : (
                <UserCircle className="w-9 h-9 md:w-10 md:h-10 text-accent-main mr-3 md:mr-4" />
              )}
              <div>
                <p className="font-semibold text-text-light text-base md:text-lg">{post.user?.full_name || 'Unknown User'}</p>
                <p className="text-xs md:text-sm text-text-muted">@{post.user?.username || 'unknown'} • {new Date(post.created_at).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-text-light text-sm md:text-base leading-relaxed mb-4">{post.content}</p>
            <div className="flex space-x-4 md:space-x-6 text-text-muted text-sm">
              <button className="flex items-center hover:text-accent-main transition-colors duration-200">
                <Heart className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                <span>Like</span>
              </button>
              <button className="flex items-center hover:text-accent-main transition-colors duration-200">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                <span>Comment</span>
              </button>
              <button className="flex items-center hover:text-accent-main transition-colors duration-200">
                <Share2 className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                <span>Share</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Timeline;
