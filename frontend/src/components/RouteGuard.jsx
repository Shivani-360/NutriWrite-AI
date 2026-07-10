"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui";

// Wrap any page with <RouteGuard> to require a logged-in user.
// Unauthenticated visitors are redirected to /login.
export default function RouteGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24">
        <Loader text="Checking your session..." />
      </div>
    );
  }

  return children;
}
