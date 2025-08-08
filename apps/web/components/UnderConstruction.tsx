'use client';

import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';

interface UnderConstructionProps {
  featureName?: string;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({ featureName = "This feature" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-text-light p-4 text-center"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <Wrench size={80} className="text-accent-main mb-6" />
      </motion.div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Under Construction!</h1>
      <p className="text-lg md:text-xl text-text-muted max-w-md">
        {featureName} is currently being developed. Please check back later for updates!
      </p>
      <p className="text-sm text-text-muted mt-2">
        Thank you for your patience.
      </p>
    </motion.div>
  );
};

export default UnderConstruction;
