"use client";
import { SignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { isSignedIn } = useUser(); // Clerk hook to check user session

  useEffect(() => {
    if (isSignedIn) {
      router.push("/sign-in"); // Redirect already signed-in users to the sign-in page
    }
  }, [isSignedIn, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-background text-foreground">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        forceRedirectUrl={isSignedIn ? "/sign-in" : "/home"} // Redirects to /home for first-time sign-up, /sign-in if already signed in
      />
    </div>
  );
}
