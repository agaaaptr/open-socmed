'use client';

import { motion } from 'framer-motion';
import { UserCircle, Heart, MessageCircle, Share2 } from 'lucide-react';
import LoadingState from './LoadingState';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PostOptionsMenu from './PostOptionsMenu';
import ConfirmationModal from './ConfirmationModal';
import EditPostModal from './EditPostModal';

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
  currentUserId: string | null;
  onUpdatePost: (updatedPost: Post) => void;
  onDeletePost: (post: Post) => void;
  onReportPost: () => void;
}

const Timeline = ({ posts, currentUserId, onUpdatePost, onDeletePost, onReportPost }: TimelineProps) => {
  // All state and data fetching logic is moved to the parent (home/page.tsx)
  // This component is now only responsible for rendering the UI.

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const openEditModal = (post: Post) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    onUpdatePost(updatedPost);
    toast.success('Post updated successfully!');
  };

  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        className="w-full p-4 md:p-6 bg-background-medium/50 backdrop-blur-md border border-border-medium shadow-lg rounded-2xl"
      >
        <h2 className="text-xl md:text-2xl font-bold text-text-light mb-4">Your Timeline</h2>
        {posts.length === 0 ? (
          <div className="text-center text-text-muted py-10">
            <p className="text-lg font-semibold">It&apos;s quiet here...</p>
            <p>Follow people or create your first post to see some action!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                variants={postVariants}
                className="bg-background-medium/30 p-4 md:p-5 rounded-xl border border-border-subtle relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
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
                  <PostOptionsMenu
                    isOwner={currentUserId === post.user_id}
                    onEdit={() => openEditModal(post)}
                    onDelete={() => onDeletePost(post)}
                    onReport={onReportPost}
                  />
                </div>
                <p className="text-text-light text-sm md:text-base leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
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
        )}
      </motion.div>

      {/* Modals */} 
      {selectedPost && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          post={selectedPost}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </>
  );
};

export default Timeline;
