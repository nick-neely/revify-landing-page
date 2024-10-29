"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function SignupForm() {
  const { toast } = useToast();
  const { openSignUp } = useClerk();
  const { isSignedIn, user, isLoaded } = useUser();
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (isLoaded) {
      setShowSignUp(!isSignedIn);
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    const sendWelcomeEmail = async () => {
      if (isSignedIn && user) {
        const email = user.primaryEmailAddress?.emailAddress;
        const username = user.username || user.id;
        const firstName = user.firstName;

        // Check if the user was created in the last 5 minutes
        const isNewUser =
          user.createdAt &&
          Date.now() - new Date(user.createdAt).getTime() < 5 * 60 * 1000;

        // Check if welcome email has been sent before
        const welcomeEmailSent = localStorage.getItem(
          `welcomeEmailSent_${user.id}`
        );

        if (isNewUser && !welcomeEmailSent) {
          try {
            const response = await fetch("/api/email/welcome", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, username, firstName }),
            });

            if (!response.ok) {
              throw new Error("Failed to send welcome email");
            }

            // Mark welcome email as sent
            localStorage.setItem(`welcomeEmailSent_${user.id}`, "true");
          } catch (err) {
            console.error("Error sending welcome email:", err);
          }
        }
      }
    };

    sendWelcomeEmail();
  }, [isSignedIn, user]);

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      await openSignUp({
        afterSignUpUrl: window.location.href,
        redirectUrl: window.location.href,
      });
      sessionStorage.setItem("signUpComplete", "true");
    } catch (err) {
      console.error("Error during sign up:", err);
    } finally {
      setIsLoading(false);
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
        disabled={isLoading}
      >
        {isLoading ? (
          <LoaderIcon className="h-6 w-6 animate-spin text-white" />
        ) : (
          "Get Notified"
        )}
      </Button>
    </SignedOut>
  );
}
