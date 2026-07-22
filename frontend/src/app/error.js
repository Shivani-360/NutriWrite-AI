"use client";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log to console (swap for a real logging service later if you add one)
    console.error("Unhandled render error:", error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="text-5xl mb-4">💥</p>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Something went wrong
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        This page hit an unexpected error. You can try again, or head back to
        the dashboard.
      </p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => reset()} className="btn-primary">
          Try again
        </button>
        <a href="/dashboard" className="btn-secondary">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
