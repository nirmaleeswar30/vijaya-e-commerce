// components/Preloader.tsx
'use client';

import { motion, type Variants } from 'framer-motion';
import NextImage from 'next/image';

// Animation for the logo container (fade in/out)
const logoContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4 },
  },
};

// Animation for the pulsing logo image itself
const logoImageVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Animation for the curtain panels
const curtainVariants: Variants = {
  initial: { y: 0 },
  exit: {
    y: '-100%', // Both curtains will slide UP
    transition: { duration: 1.2, ease: [0.85, 0, 0.15, 1] },
  },
};

export default function Preloader() {
  return (
    // A single container that holds everything
    // We use z-50 here and on the children to ensure it's on top
    <div className="fixed inset-0 z-50">
      
      {/* The Logo - positioned in the center, on top of the curtains */}
      <motion.div
        variants={logoContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="absolute inset-0 flex items-center justify-center z-[51]"
      >
        <motion.div variants={logoImageVariants} animate="animate">
          <NextImage
            src="/logo.png"
            alt="Vijaya Logo"
            width={600}
            height={600}
            priority
          />
        </motion.div>
      </motion.div>
      
      {/* The Curtain Panels - they now act as a background */}
      {/* We can use one div for simplicity that slides up */}
      <motion.div
        variants={curtainVariants}
        initial="initial"
        exit="exit"
        className="h-full w-full bg-stone-100 z-50"
      />
    </div>
  );
}