'use client';

import { motion } from 'framer-motion';
import { Code } from 'lucide-react'; // Changed icon import
import Link from 'next/link'; // Added Link import

interface UnderDevelopmentProps {
  featureName?: string;
}

const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({ featureName = "This feature" }) => {
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
        <Code size={80} className="text-accent-main mb-6" /> {/* Changed icon */} 
      </motion.div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Under Development!</h1> {/* Changed title */} 
      <p className="text-lg md:text-xl text-text-muted max-w-md">
        {featureName} is currently being built with passion and precision. We&apos;re working hard to bring you exciting new functionalities!
      </p>
      <p className="text-sm text-text-muted mt-2">
        Thank you for your patience and continued support.
      </p>
      <Link href="/home" className="mt-8 px-6 py-3 bg-accent-main text-text-light rounded-lg font-semibold hover:bg-accent-hover transition-colors duration-300 shadow-lg">
        Back to Home
      </Link>
    </motion.div>
  );
};

export default UnderDevelopment;