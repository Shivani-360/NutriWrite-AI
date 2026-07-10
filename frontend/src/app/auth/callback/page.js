"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui";

function CallbackHandler() {
  const { loginWithToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.replace("/login?error=oauth_failed");
      return;
    }
    loginWithToken(token).then(() => router.replace("/dashboard"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <Loader text="Finishing sign in..." />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-24">
          <Loader text="Finishing sign in..." />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
