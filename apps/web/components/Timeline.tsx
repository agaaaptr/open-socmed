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
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const Timeline = ({ posts, setPosts }: TimelineProps) => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // State for modals
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      setError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // No need to throw error, just won't fetch posts
          setCurrentUserId(null);
          setPosts([]);
          return;
        }
        setCurrentUserId(session.user.id);

        const token = session.access_token;
        const response = await fetch('/api/timeline', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch posts.');
        }

        const data: Post[] = await response.json();
        setPosts(data || []); // Handle null response
      } catch (err: any) {
        console.error('Error fetching posts:', err);
        setError(err.message || 'Failed to load posts.');
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, [supabase, setPosts]);

  const openDeleteModal = (post: Post) => {
    setSelectedPost(post);
    setDeleteModalOpen(true);
  };

  const openEditModal = (post: Post) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleReport = () => {
    // Navigate to a dedicated report page or show a report modal
    router.push('/settings'); // Example: navigating to settings page
    toast.success('You will be redirected to report a problem.');
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPost) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading('Deleting post...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('User not authenticated.');

      const response = await fetch(`/api/posts?id=${selectedPost.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post.');
      }

      setPosts(prev => prev.filter(p => p.id !== selectedPost.id));
      toast.success('Post deleted successfully!', { id: loadingToast });
      setDeleteModalOpen(false);
      setSelectedPost(null);
    } catch (err: any) {
      console.error('Error deleting post:', err);
      toast.error(err.message || 'Failed to delete post.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    toast.success('Post updated successfully!');
  };

  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return <LoadingState text="Loading timeline..." />;
  }

  if (error) {
    return <p className="text-center text-red-400 py-10">Error: {error}</p>;
  }

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
                className="bg-background-medium/30 p-4 md:p-5 rounded-xl border border-border-subtle"
              >
                <div className="flex items-start justify-between mb-3">
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
                    onDelete={() => openDeleteModal(post)}
                    onReport={handleReport}
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        description="Are you sure you want to permanently delete this post? This action cannot be undone."
        confirmText="Yes, Delete"
        isLoading={isSubmitting}
      />
    </>
  );
};

export default Timeline;
