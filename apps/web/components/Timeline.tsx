'use client';

import { motion } from 'framer-motion';
import { UserCircle, Heart, MessageCircle, Share2 } from 'lucide-react';

const Timeline = () => {
  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const posts = [
    {
      id: 1,
      user: 'User Name',
      username: 'username',
      time: '2h ago',
      content: 'This is a placeholder for a social media post. Imagine engaging content, images, and more!',
    },
    {
      id: 2,
      user: 'Another User',
      username: 'anotheruser',
      time: '5h ago',
      content: 'Excited to share new features soon! #Cirqle #SocialMedia',
    },
    {
      id: 3,
      user: 'Cirqle Team',
      username: 'cirqle_official',
      time: '1d ago',
      content: 'Welcome to Cirqle! We are building the next generation social media platform.',
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="w-full p-4 bg-background-medium/50 backdrop-blur-md border border-border-medium shadow-lg rounded-2xl"
    >
      <h2 className="text-2xl font-bold text-text-light mb-4">Your Timeline</h2>
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            variants={postVariants}
            className="bg-background-medium/30 p-5 rounded-xl border border-border-subtle"
          >
            <div className="flex items-center mb-3">
              <UserCircle className="w-10 h-10 text-accent-main mr-4" />
              <div>
                <p className="font-semibold text-text-light text-lg">{post.user}</p>
                <p className="text-sm text-text-muted">@{post.username} • {post.time}</p>
              </div>
            </div>
            <p className="text-text-light text-base leading-relaxed mb-4">{post.content}</p>
            <div className="flex space-x-6 text-text-muted">
              <button className="flex items-center hover:text-accent-main transition-colors duration-200">
                <Heart className="w-5 h-5 mr-1" />
                <span>Like</span>
              </button>
              <button className="flex items-center hover:text-accent-main transition-colors duration-200">
                <MessageCircle className="w-5 h-5 mr-1" />
                <span>Comment</span>
              </button>
              <button className="flex items-center hover:text-accent-main transition-colors duration-200">
                <Share2 className="w-5 h-5 mr-1" />
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
