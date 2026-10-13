import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const scaleCard: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  tap: { scale: 0.98 },
};

export const pulseBadge: Variants = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(16, 185, 129, 0.4)",
      "0 0 0 8px rgba(16, 185, 129, 0)",
      "0 0 0 0 rgba(16, 185, 129, 0)",
    ],
    transition: {
      duration: 2.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const scoreCounterSpring = {
  type: "spring",
  stiffness: 80,
  damping: 18,
};
