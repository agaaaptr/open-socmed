import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingStateProps {
  text?: string;
  type?: 'spinner' | 'dots';
}

const LoadingState: React.FC<LoadingStateProps> = ({ text, type = 'spinner' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center text-text-muted"
    >
      {type === 'spinner' ? (
        <Loader2 className="h-5 w-5 animate-spin text-accent-main" />
      ) : (
        <div className="flex space-x-1">
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-accent-main rounded-full"
          />
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="w-1.5 h-1.5 bg-accent-main rounded-full"
          />
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="w-1.5 h-1.5 bg-accent-main rounded-full"
          />
        </div>
      )}
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className=""
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingState;
