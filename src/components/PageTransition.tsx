"use client";

import { motion, useReducedMotion } from "framer-motion";

// initial must be a static object (same on server + client) to avoid hydration mismatch.
// useReducedMotion only affects transition duration, not the initial state.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduce ? 0 : 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
