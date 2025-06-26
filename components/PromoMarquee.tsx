// components/PromoMarquee.tsx
'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { AnimatePresence, motion } from 'framer-motion';

export default function PromoMarquee() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasClosed = localStorage.getItem('promoMarqueeClosed');
    if (!hasClosed) {
      // Use a timeout to make it appear after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('promoMarqueeClosed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="bg-amber-400 text-stone-900 px-4 py-3 flex items-center justify-between shadow-t-lg">
            <div className="flex-1 text-center">
                <p className="text-sm font-medium">
                Use Code "<span className="font-bold">VIJAYAFS</span>" - Free shipping for orders over 
                <span className="font-bold ml-1">INR 1500</span>
                </p>
            </div>
            <button
              onClick={handleClose}
              className="ml-4 p-1 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Dismiss promotional message"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}