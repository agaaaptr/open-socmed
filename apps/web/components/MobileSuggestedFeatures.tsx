'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';
import SuggestedFeatures from './SuggestedFeatures';

export default function MobileSuggestedFeatures() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <div className="fixed bottom-20 left-4 z-50 lg:hidden">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleOpen}
        className="p-3 rounded-full bg-accent-main text-text-light shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-main focus:ring-offset-2 focus:ring-offset-background-dark"
      >
        {isOpen ? <X size={24} /> : <Lightbulb size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="absolute bottom-full left-0 mb-4 w-64 bg-background-medium/80 backdrop-blur-md border border-border-medium shadow-xl rounded-2xl overflow-hidden"
          >
            <SuggestedFeatures limit={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
