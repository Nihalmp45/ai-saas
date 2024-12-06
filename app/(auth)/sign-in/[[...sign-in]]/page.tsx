"use client";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen flex items-center justify-center bg-background text-foreground">
      <SignIn fallbackRedirectUrl="/home" />
    </div>
  );
}

