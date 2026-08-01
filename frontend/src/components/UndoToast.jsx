"use client";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A toast with an Undo action and a shrinking progress bar.
 * `duration` must match the setTimeout delay in the caller.
 */
export default function UndoToast({ message, onUndo, duration = 4000 }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-white rounded-xl shadow-lg px-5 py-3 flex items-center gap-4 min-w-[280px] overflow-hidden"
        >
          <span className="text-sm">{message}</span>
          <button
            onClick={onUndo}
            className="text-sm font-semibold text-accent-400 hover:text-accent-300 transition-colors ml-auto shrink-0"
          >
            Undo
          </button>
          {/* Shrinking progress bar showing how long is left before it's permanent */}
          <motion.div
            key={message} // restarts the bar whenever a new toast appears
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 h-0.5 bg-brand-400 w-full origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}