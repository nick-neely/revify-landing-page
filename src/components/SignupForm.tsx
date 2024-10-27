"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (_data: FormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: "Thanks for signing up!",
      description: "We'll notify you when we launch.",
      duration: 5000,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative z-20 w-full max-w-md"
      >
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <div className="relative mb-4 sm:mb-0">
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="w-full rounded-lg border-2 border-transparent bg-gray-800 bg-opacity-50 px-4 py-2 text-white placeholder-gray-400 backdrop-blur-sm focus:border-indigo-500 focus:outline-none"
                      aria-label="Email address"
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-6 left-0 text-sm text-red-500" />
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-lg bg-indigo-600 px-6 py-2 text-lg font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:mt-0 sm:w-auto"
          >
            {isLoading ? (
              <LoaderIcon className="h-6 w-6 animate-spin text-white" />
            ) : (
              "Get Notified"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
