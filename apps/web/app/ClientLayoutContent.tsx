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
  const isEditProfilePage = pathname.startsWith('/settings/profile');

  const showMobileNav = pathname === '/home' || pathname === '/search' || pathname === '/messages';
  const showSidebar = !isAuthPage && !isLandingPage && !isProfilePage && !isEditProfilePage;
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handlePostCreated = (newPost: any) => {
    console.log('New post created:', newPost);
    setIsCreatePostOpen(false); // Close modal on success

    // Only redirect if the user was not on the home page.
    if (pathname !== '/home') {
      // Delay the redirect slightly to allow modal closing animation and toast to be seen
      setTimeout(() => {
        router.push('/home');
      }, 2000); // Shorter delay, just for animations
    }
  };

  const handleCloseCreatePost = () => {
    setIsCreatePostOpen(false); // This function now *only* closes the modal.
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:hidden"
            onClick={handleCloseCreatePost}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-full max-w-sm bg-background-dark rounded-2xl shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <CreatePost
                onPostCreated={handlePostCreated}
                onClose={handleCloseCreatePost}
                isMobile={true}
              />
            </motion.div>
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
