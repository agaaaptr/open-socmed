'use client';

import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import MobileNavbar from '../components/MobileNavbar';
import { useState } from 'react';
import CreatePost from '../components/CreatePost';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

export default function ClientLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname.startsWith('/auth');
  const isLandingPage = pathname === '/';
  const isProfilePage = pathname.startsWith('/profile');

  const showMobileNav = pathname === '/home' || pathname === '/search' || pathname === '/messages';
  const showSidebar = !isAuthPage && !isLandingPage && !isProfilePage;
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handlePostCreated = (newPost: any) => {
    console.log('New post created:', newPost);
    // This function is called by CreatePost.
    // The actual redirection will be handled by the onClose callback passed to CreatePost.
  };

  const handleCloseCreatePost = () => {
    setIsCreatePostOpen(false);
    // Only redirect if not on the home page and it's a mobile post creation
    if (pathname !== '/home') {
      // Delay the redirect slightly to allow modal closing animation and toast to be seen
      setTimeout(() => {
        router.push('/home');
      }, 500); // Adjust delay as needed (e.g., toast duration + modal close animation)
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-text-light">
      <Sidebar isVisible={showSidebar} />
      <main className={`flex-grow flex flex-col pb-16 md:pb-0 ${showSidebar ? 'md:ml-64' : ''}`}>
        {children}
      </main>
      <MobileNavbar isVisible={showMobileNav} onOpenCreatePost={() => setIsCreatePostOpen(true)} />

      {/* Mobile Create Post Bottom Sheet */}
      <AnimatePresence>
        {isCreatePostOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 bg-background-dark/90 backdrop-blur-lg p-4 rounded-t-2xl shadow-lg z-50 md:hidden"
          >
            <CreatePost
              onPostCreated={handlePostCreated}
              onClose={handleCloseCreatePost} // Pass the modified handler directly
              isMobile={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#1A1A2E', // bg-medium
            color: '#E0E0EB', // text-light
            border: '1px solid #28283A', // border-medium
            borderRadius: '12px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#8B5CF6', // accent-main
              secondary: '#E0E0EB', // text-light
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#F87171', // A suitable red color
              secondary: '#E0E0EB', // text-light
            },
          },
        }}
      />
    </div>
  );
}
