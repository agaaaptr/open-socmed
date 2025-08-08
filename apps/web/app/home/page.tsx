'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusSquare } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

import Timeline from '../../components/Timeline';
import MobileSuggestedFeatures from '../../components/MobileSuggestedFeatures';
import PullToRefresh from '../../components/PullToRefresh';
import SuggestedFeatures from '../../components/SuggestedFeatures';
import CreatePost from '../../components/CreatePost';
import LoadingState from '../../components/LoadingState';
import ConfirmationModal from '../../components/ConfirmationModal';

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

export default function HomePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // State for modals, now managed here
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = useCallback(async (session: any) => {
    const token = session.access_token;
    const response = await fetch('/api/timeline', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch posts.');
    }

    const data: Post[] = await response.json();
    setPosts(data || []);
  }, []);

  useEffect(() => {
    const initializePage = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        router.push('/auth/signin');
        return;
      }

      setCurrentUserId(session.user.id);
      await fetchPosts(session);
      setLoading(false);

      const handlePopState = () => {
        if (window.location.pathname === '/') {
          router.replace('/home');
        }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    };

    initializePage();
  }, [supabase, router, fetchPosts]);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    toast.success('Post created successfully!');
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const openDeleteModal = (post: Post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading('Deleting post...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('User not authenticated.');

      const response = await fetch(`/api/posts?id=${postToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post.');
      }

      setPosts(prev => prev.filter(p => p.id !== postToDelete.id));
      toast.success('Post deleted successfully!', { id: loadingToast });
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err: any) {
      console.error('Error deleting post:', err);
      toast.error(err.message || 'Failed to delete post.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportPost = () => {
    router.push('/settings');
    toast('You are being redirected to the report page.');
  };

  return (
    <>
      <PullToRefresh />
      <div className="w-full p-4 md:p-8">
        {loading ? (
          <LoadingState text="Loading your home feed..." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-screen-xl mx-auto">
            <div className="lg:col-span-2 flex flex-col space-y-6 md:space-y-8 relative">
              <Timeline 
                posts={posts} 
                currentUserId={currentUserId}
                onUpdatePost={handlePostUpdated}
                onDeletePost={openDeleteModal}
                onReportPost={handleReportPost}
              />
            </div>
            <div className="hidden lg:block lg:col-span-1">
              <SuggestedFeatures />
            </div>
            <MobileSuggestedFeatures />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCreatePostOpen(true)}
              className="hidden md:flex fixed bottom-8 right-8 p-5 rounded-xl bg-accent-main text-text-light shadow-lg z-40 focus:outline-none focus:ring-2 focus:ring-accent-main focus:ring-offset-2 focus:ring-offset-background-dark"
            >
              <PlusSquare size={32} />
            </motion.button>
            <AnimatePresence>
              {isCreatePostOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
                >
                  <CreatePost onPostCreated={handlePostCreated} onClose={() => setIsCreatePostOpen(false)} isMobile={false} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
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
}
