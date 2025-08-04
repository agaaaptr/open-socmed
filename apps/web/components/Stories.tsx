'use client';

import { motion } from 'framer-motion';
import { UserCircle } from 'lucide-react';

const Stories = () => {
  const storyVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const stories = [
    { id: 1, user: 'User 1', avatar: <UserCircle className="w-12 h-12 text-accent-main" /> },
    { id: 2, user: 'User 2', avatar: <UserCircle className="w-12 h-12 text-accent-main" /> },
    { id: 3, user: 'User 3', avatar: <UserCircle className="w-12 h-12 text-accent-main" /> },
    { id: 4, user: 'User 4', avatar: <UserCircle className="w-12 h-12 text-accent-main" /> },
    { id: 5, user: 'User 5', avatar: <UserCircle className="w-12 h-12 text-accent-main" /> },
    { id: 6, user: 'User 6', avatar: <UserCircle className="w-12 h-12 text-accent-main" /> },
    { id: 7, user: 'User 7', avatar: <UserCircle className="w-12 h-12 text-accent-main" /> },
    { id: 8, user: 'User 8', avatar: <UserCircle className="w-12 h-12 text-accent-main" /> },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="w-full p-4 bg-background-medium/50 backdrop-blur-md border border-border-medium shadow-lg rounded-2xl overflow-hidden"
    >
      <h2 className="text-2xl font-bold text-text-light mb-4">Stories</h2>
      <motion.div
        className="flex space-x-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-accent-500 scrollbar-track-primary-800"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        {stories.map((story) => (
          <motion.div
            key={story.id}
            variants={storyVariants}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full bg-background-medium flex items-center justify-center border-2 border-accent-main overflow-hidden">
              {story.avatar}
            </div>
            <p className="text-sm text-text-light mt-2 truncate w-20 text-center">{story.user}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Stories;
