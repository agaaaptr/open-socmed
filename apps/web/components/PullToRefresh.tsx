'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PullToRefreshProps {
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ children }) => {
  const router = useRouter();
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const pullDistanceRef = useRef(pullDistance);

  useEffect(() => {
    pullDistanceRef.current = pullDistance;
  }, [pullDistance]);
  const startY = useRef(0);

  const REFRESH_THRESHOLD = 80; // Distance in pixels to trigger refresh
  const MAX_PULL_DISTANCE = 150; // Max distance to allow pulling

  const onTouchStart = (e: TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0 && startY.current !== 0) {
      const currentY = e.touches[0].clientY;
      let distance = currentY - startY.current;

      if (distance > 0) { // Only pull down
        e.preventDefault(); // Prevent scrolling
        distance = Math.min(distance, MAX_PULL_DISTANCE);
        setPullDistance(distance);
        pullDistanceRef.current = distance;
        controls.start({ y: distance });
      }
    }
  }, [controls]);

  const onTouchEnd = useCallback(async () => {
    startY.current = 0;
    if (pullDistanceRef.current >= REFRESH_THRESHOLD) {
      setIsRefreshing(true);
      await controls.start({ y: REFRESH_THRESHOLD / 2, transition: { duration: 0.2 } });
      router.refresh();
      // In a real app, you'd fetch new data here.
      // For now, we'll just simulate a delay and then reset.
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
        controls.start({ y: 0, transition: { duration: 0.3 } });
      }, 1000); // Simulate data fetch time
    } else {
      setPullDistance(0);
      controls.start({ y: 0, transition: { duration: 0.3 } });
    }
  }, [controls, router]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', onTouchStart);
      container.addEventListener('touchmove', onTouchMove, { passive: false });
      container.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', onTouchStart);
        container.removeEventListener('touchmove', onTouchMove);
        container.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [pullDistance, controls, router, onTouchEnd, onTouchMove]);

  return (
    <motion.div ref={containerRef} className="relative h-full overflow-y-auto">
      <motion.div
        animate={controls}
        className="relative"
        style={{ willChange: 'transform' }}
      >
        {isRefreshing || pullDistance > 0 ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: pullDistance > 0 ? pullDistance : REFRESH_THRESHOLD / 2, opacity: pullDistance > 0 ? 1 : 0 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 flex justify-center items-center z-10 bg-gradient-to-b from-transparent to-background-medium/70 backdrop-blur-sm rounded-b-3xl"
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : pullDistance * 2 }}
              transition={{ duration: isRefreshing ? 0.5 : 0.1, ease: "linear", repeat: isRefreshing ? Infinity : 0 }}
            >
              <RefreshCw className="text-accent-main" size={24} />
            </motion.div>
          </motion.div>
        ) : null}
        {children}
      </motion.div>
    </motion.div>
  );
};

export default PullToRefresh;
