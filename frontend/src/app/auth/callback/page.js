"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sprout from "@/components/Sprout";

function CallbackHandler() {
  const { completeOAuthLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If GitHub/passport failed before ever setting the cookie, an
    // error query param may still be present — check for that first.
    const oauthError = searchParams.get("error");
    if (oauthError) {
      router.replace("/login?error=oauth_failed");
      return;
    }

    // No token to read anymore — the httpOnly cookie is already set by
    // the backend redirect. Just ask "who am I" and go to the dashboard.
    completeOAuthLogin().then(() => router.replace("/dashboard"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center">
      <Sprout pose="thinking" size={100} />
      <p className="text-ink-dim dark:text-gray-400 text-sm mt-4">Finishing sign in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center">
          <Sprout pose="thinking" size={100} />
          <p className="text-ink-dim dark:text-gray-400 text-sm mt-4">Finishing sign in...</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}