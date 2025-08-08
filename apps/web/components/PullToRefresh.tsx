'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PullToRefreshProps {}

const PullToRefresh: React.FC<PullToRefreshProps> = () => {
  const router = useRouter();
  const controls = useAnimation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const pullDistanceRef = useRef(pullDistance);

  const startY = useRef(0); // Initial touch Y position
  const isPulling = useRef(false); // Flag to track if a pull gesture is active

  const REFRESH_THRESHOLD = 80; // Distance in pixels to trigger refresh
  const MAX_PULL_DISTANCE = 150; // Max distance to allow pulling

  // Update ref when pullDistance changes
  useEffect(() => {
    pullDistanceRef.current = pullDistance;
  }, [pullDistance]);

  const onTouchStart = useCallback((e: TouchEvent) => {
    // Only consider starting a pull gesture if at the very top of the page
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true; // Potentially starting a pull gesture
    } else {
      startY.current = 0; // Reset if not at the top
      isPulling.current = false;
    }
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    // Only proceed if a pull gesture was initiated and we are at the top of the page
    if (isPulling.current && window.scrollY === 0) {
      const currentY = e.touches[0].clientY;
      let distance = currentY - startY.current;

      if (distance > 0) { // User is pulling down
        e.preventDefault(); // Prevent native scrolling only when pulling down from the top
        distance = Math.min(distance, MAX_PULL_DISTANCE);
        setPullDistance(distance);
        controls.start({ y: distance });
      } else {
        // If scrolling up or no movement, stop the pull gesture
        isPulling.current = false;
        startY.current = 0;
        setPullDistance(0); // Reset visual pull
        controls.start({ y: 0 });
      }
    } else {
      // If not at the top or not pulling, ensure flags are reset
      isPulling.current = false;
      startY.current = 0;
      setPullDistance(0); // Reset visual pull
      controls.start({ y: 0 });
    }
  }, [controls]);

  const onTouchEnd = useCallback(async () => {
    isPulling.current = false; // End of touch, so end the pull gesture
    startY.current = 0; // Reset startY for next gesture

    if (pullDistanceRef.current >= REFRESH_THRESHOLD) {
      setIsRefreshing(true);
      await controls.start({ y: REFRESH_THRESHOLD / 2, transition: { duration: 0.2 } });
      router.refresh();
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
        controls.start({ y: 0, transition: { duration: 0.3 } });
      }, 1000);
    } else {
      setPullDistance(0);
      controls.start({ y: 0, transition: { duration: 0.3 } });
    }
  }, [controls, router]);

  useEffect(() => {
    // Attach listeners to window for main page scroll
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]); // Dependencies for useCallback functions

  return (
    <motion.div
      animate={controls}
      className="fixed top-0 left-0 right-0 flex justify-center items-start z-50 bg-transparent pointer-events-none overflow-hidden"
      style={{ height: pullDistance > 0 ? pullDistance : 0, willChange: 'transform' }}
    >
      {isRefreshing || pullDistance > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: pullDistance > 0 ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex justify-center items-center mt-4"
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : pullDistance * 2 }}
            transition={{ duration: isRefreshing ? 0.5 : 0.1, ease: "linear", repeat: isRefreshing ? Infinity : 0 }}
          >
            <RefreshCw className="text-accent-main" size={24} />
          </motion.div>
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default PullToRefresh;
