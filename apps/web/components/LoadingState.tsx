import { motion } from "framer-motion";
import { CircleDashed } from "lucide-react";

// Adjusted sizes for better visual consistency
const sizeClasses = {
  // For use in small buttons
  sm: {
    container: "gap-2", // Increased gap
    spinner: "h-5 w-5", // Increased size
    dots: "h-5 w-5",
    dot: "w-1.5 h-1.5", // Made dots bigger
    text: "text-sm font-medium", // Matched to button text size
  },
  // For general purpose loading text
  md: {
    container: "gap-2.5",
    spinner: "h-6 w-6",
    dots: "h-6 w-6",
    dot: "w-2 h-2",
    text: "text-base font-medium",
  },
  // For full-page loading states
  lg: {
    container: "gap-3",
    spinner: "h-9 w-9",
    dots: "h-9 w-9",
    dot: "w-2.5 w-2.5",
    text: "text-lg font-semibold",
  },
};

interface LoadingStateProps {
  text?: string;
  type?: 'spinner' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  text,
  type = 'spinner',
  size = 'md',
  className = '',
}) => {
  const s = sizeClasses[size];

  const dotsContainerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Slightly slower stagger for a smoother wave
      },
    },
    exit: { opacity: 0 },
  };

  // Gentler "bob" animation
  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -4, 0], // Reduced travel distance
      transition: {
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className={`flex items-center justify-center ${s.container} ${className}`}>
      {type === 'spinner' ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <CircleDashed className={`${s.spinner} text-accent-main`} />
        </motion.div>
      ) : (
        <motion.div
          variants={dotsContainerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`flex items-center justify-center gap-1.5 ${s.dots}`}>
          <motion.span variants={dotVariants} className={`${s.dot} bg-text-light rounded-full`} />
          <motion.span variants={dotVariants} className={`${s.dot} bg-text-light rounded-full`} />
          <motion.span variants={dotVariants} className={`${s.dot} bg-text-light rounded-full`} />
        </motion.div>
      )}
      {text && (
        <p className={`${s.text} text-text-muted`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingState;
