'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import MobileNavbar from '../components/MobileNavbar';
import { useState } from 'react';
import CreatePost from '../components/CreatePost';
import { AnimatePresence, motion } from 'framer-motion';

export default function ClientLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNav = pathname === '/home';
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handlePostCreated = (newPost: any) => {
    // This function will be passed down to CreatePost and can be used
    // to update the global state or re-fetch posts in the Timeline.
    // For now, we'll just close the modal.
    console.log('New post created:', newPost);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-text-light">
      {showNav && <Sidebar />}
      <main className={`flex-grow flex flex-col pb-16 md:pb-0 ${showNav ? 'md:ml-64' : ''}`}>
        {children}
      </main>
      {showNav && <MobileNavbar onOpenCreatePost={() => setIsCreatePostOpen(true)} />}

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
            <CreatePost onPostCreated={handlePostCreated} onClose={() => setIsCreatePostOpen(false)} isMobile={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
