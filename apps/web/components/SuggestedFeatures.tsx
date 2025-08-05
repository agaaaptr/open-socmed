'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, Compass } from 'lucide-react';

const SuggestedFeatures = () => {
  const featureVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const features = [
    { id: 1, name: 'Find Friends', icon: Users, description: 'Connect with people you know.' },
    { id: 2, name: 'Trending Topics', icon: TrendingUp, description: `See what's hot right now.` },
    { id: 3, name: 'Explore Communities', icon: Compass, description: 'Discover new interests.' },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="w-full p-4 md:p-6 bg-background-medium/50 backdrop-blur-md border border-border-medium shadow-lg rounded-2xl"
    >
      <h2 className="text-xl md:text-2xl font-bold text-text-light mb-4">Suggested Features</h2>
      <div className="space-y-4">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            variants={featureVariants}
            className="flex items-center bg-background-medium/30 p-3 md:p-4 rounded-xl border border-border-subtle cursor-pointer hover:bg-primary-700/50 transition-colors duration-200"
          >
            <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-accent-main mr-3 md:mr-4" />
            <div>
              <p className="font-semibold text-text-light text-base md:text-lg">{feature.name}</p>
              <p className="text-sm text-text-muted">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SuggestedFeatures;
