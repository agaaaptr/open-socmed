'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, PlusCircle } from 'lucide-react';

import Timeline from '../../components/Timeline';
import MobileSuggestedFeatures from '../../components/MobileSuggestedFeatures';
import PullToRefresh from '../../components/PullToRefresh';
import SuggestedFeatures from '../../components/SuggestedFeatures';
import CreatePost from '../../components/CreatePost';

// Loading Spinner Component
const LoadingSpinner = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-screen w-full absolute inset-0"
    >
        <Loader className="w-12 h-12 text-accent-main animate-spin" />
        <p className="mt-4 text-text-muted">Loading your home feed...</p>
    </motion.div>
);

export default function HomePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]); // State to hold posts

  useEffect(() => {
    const checkUser = async () => {
      console.log('Checking user...');
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.log('No user found, redirecting to signin.');
        router.push('/auth/signin');
        return; // Stop execution if no user
      }

      console.log('User found:', user);
      setLoading(false); // Set loading to false once user is confirmed

      // Prevent going back to landing page if already logged in
      const handlePopState = () => {
        console.log('Popstate event triggered. Current path:', window.location.pathname);
        if (window.location.pathname === '/') {
          console.log('Attempting to go back to landing page, redirecting to home.');
          router.replace('/home');
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        console.log('Removing popstate listener.');
        window.removeEventListener('popstate', handlePopState);
      };
    };

    checkUser();
  }, [supabase, router]);

  const handlePostCreated = (newPost: any) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post to the top of the list
  };

  return (
    <div className="w-full p-4 md:p-8">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-screen-xl mx-auto">
          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col space-y-6 md:space-y-8">
            <PullToRefresh>
              <Timeline posts={posts} setPosts={setPosts} /> {/* Pass posts and setPosts to Timeline */}
            </PullToRefresh>
          </div>
          {/* Right Sidebar for Suggested Features (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <SuggestedFeatures />
          </div>
          {/* Floating Suggested Features (Mobile) */}
          <MobileSuggestedFeatures />

          {/* Floating Action Button for Create Post (Desktop) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCreatePostOpen(true)}
            className="hidden md:flex fixed bottom-8 right-8 p-4 rounded-full bg-accent-main text-text-light shadow-lg z-40 focus:outline-none focus:ring-2 focus:ring-accent-main focus:ring-offset-2 focus:ring-offset-background-dark"
          >
            <PlusCircle size={28} />
          </motion.button>

          {/* Create Post Modal/Bottom Sheet */}
          <AnimatePresence>
            {isCreatePostOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <CreatePost onPostCreated={handlePostCreated} onClose={() => setIsCreatePostOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
