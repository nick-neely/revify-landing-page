"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function SignupForm() {
  const { toast } = useToast();
  const { openSignUp } = useClerk();
  const { isSignedIn, user } = useUser();
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const showToastIfSignedUp = () => {
      const signUpComplete = sessionStorage.getItem("signUpComplete");
      if (signUpComplete) {
        toast({
          title: "Thanks for signing up!",
          description: "We'll notify you when we launch.",
          duration: 5000,
        });
        sessionStorage.removeItem("signUpComplete");
      }
    };

    showToastIfSignedUp();
  }, [toast]);

  useEffect(() => {
    if (!isSignedIn) {
      setShowSignUp(true);
    } else {
      setShowSignUp(false);
    }
  }, [isSignedIn]);

  const handleSignUp = async () => {
    try {
      await openSignUp({
        afterSignUpUrl: window.location.href,
        redirectUrl: window.location.href,
      });
      sessionStorage.setItem("signUpComplete", "true");

      // Get user information after sign up
      if (user) {
        const email = user.primaryEmailAddress?.emailAddress;
        const username = user.username || user.id; // Fallback to user ID if username is not available
        const firstName = user.firstName;

        // Call API endpoint to send welcome email
        const response = await fetch("/api/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, firstName }),
        });

        if (!response.ok) {
          throw new Error("Failed to send welcome email");
        }
      }
    } catch (err) {
      console.error("Error during sign up:", err);
    }
  };

  if (!showSignUp) {
    return null;
  }

  return (
    <SignedOut>
      <Button
        onClick={handleSignUp}
        className="mt-4 w-full rounded-lg bg-indigo-600 px-6 py-2 text-lg font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:mt-0 sm:w-auto"
      >
        Get Notified
      </Button>
    </SignedOut>
  );
}
