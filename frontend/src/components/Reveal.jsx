"use client";
import { motion } from "framer-motion";

/**
 * Wraps a section so it fades/slides up once scrolled into view.
 * `once: true` means it plays on first scroll into view only, not every time.
 */
export default function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}