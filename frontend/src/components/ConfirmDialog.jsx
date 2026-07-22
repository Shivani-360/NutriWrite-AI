"use client";
import { Button } from "@/components/ui";

export default function ConfirmDialog({
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <div
        className="card w-full max-w-sm animate-fade-in text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-4xl mb-3">⚠️</p>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        {message && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {message}
          </p>
        )}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onCancel} fullWidth>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
            fullWidth
          >
            {loading ? "Deleting..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
