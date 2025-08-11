import { motion } from "framer-motion";
import { CircleDashed } from "lucide-react";

// Define a set of sizes for the loader for better reusability
const sizeClasses = {
  sm: {
    container: "gap-1.5",
    spinner: "h-4 w-4",
    dots: "h-4 w-4",
    dot: "w-1 h-1",
    text: "text-xs",
  },
  md: {
    container: "gap-2",
    spinner: "h-5 w-5",
    dots: "h-5 w-5",
    dot: "w-1.5 h-1.5",
    text: "text-sm",
  },
  lg: {
    container: "gap-3",
    spinner: "h-8 w-8",
    dots: "h-8 w-8",
    dot: "w-2 w-2",
    text: "text-base",
  },
};

interface LoadingStateProps {
  text?: string;
  type?: 'spinner' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  className?: string; // Allow custom classes to be passed
}

const LoadingState: React.FC<LoadingStateProps> = ({
  text,
  type = 'spinner',
  size = 'md',
  className = '',
}) => {
  const s = sizeClasses[size];

  // A more fluid and continuous animation for the dots
  const dotsContainerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // This creates the "wave" effect
      },
    },
    exit: { opacity: 0 },
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -6, 0],
      transition: {
        duration: 0.8,
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
        <p className={`${s.text} font-medium text-text-muted`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingState;