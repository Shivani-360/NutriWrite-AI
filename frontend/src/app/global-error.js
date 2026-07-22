"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Unhandled root layout error:", error);
  }, [error]);

  // global-error must render its own <html> and <body> —
  // it replaces the entire root layout when triggered, so it can't rely
  // on ThemeProvider/AuthProvider/Navbar from layout.js (they may be what crashed).
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <p className="text-5xl mb-4">⚠️</p>
          <h1 className="text-2xl font-bold mb-2">
            NutriWrite AI hit a critical error
          </h1>
          <p className="text-gray-500 mb-8">
            Please reload the page. If this keeps happening, check that the
            backend is running and reachable.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
