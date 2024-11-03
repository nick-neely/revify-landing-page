"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster } from "@/components/ui/toaster";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  BarChart3,
  ChartArea,
  GitCompare,
  PieChart,
  Sparkles,
} from "lucide-react";
import { Background } from "./Background";
import CounterUpdater from "./CounterUpdater";
import { Header } from "./Header";
import { SignupForm } from "./SignupForm";
import SpotlightCards from "./SpotlightCards";
import UserCounter from "./UserCounter";

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
  isFeatured?: boolean;
}

export function LandingPage() {
  const features: Feature[] = [
    {
      icon: <BarChart3 className="h-6 w-6 text-indigo-400" />,
      title: "Accurate Revenue Forecasting",
      description: "Project MRR, ARR, and churn rates with ease.",
    },
    {
      icon: <GitCompare className="h-6 w-6 text-indigo-400" />,
      title: "Scenario Comparisons",
      description: "Compare multiple growth strategies side-by-side.",
    },
    {
      icon: <PieChart className="h-6 w-6 text-indigo-400" />,
      title: "Advanced Analytics",
      description: "Unlock insights to optimize pricing and profitability.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-indigo-400" />,
      title: "AI-Powered Predictions",
      description: "Auto-generate scenarios based on your inputs.",
      isFeatured: true,
    },
  ];

  const faqs = [
    {
      question: "What is Revify?",
      answer:
        "Revify is a SaaS revenue projection tool that helps founders and product teams forecast growth, churn, and profitability with ease.",
    },
    {
      question: "How does Revify work?",
      answer:
        "Revify allows you to input your business data and automatically generates revenue projections, compares multiple scenarios, and provides advanced insights.",
    },
    {
      question: "Is Revify free?",
      answer:
        "Revify offers a free tier with basic features, and a Pro plan with advanced features like scenario comparisons, AI-powered predictions, and more.",
    },
    {
      question: "When will Revify launch?",
      answer:
        "Sign up to be notified when Revify goes live! The MVP will be available soon.",
    },
    {
      question: "How can I get access to the Pro features?",
      answer:
        "Once Revify launches, you'll be able to upgrade to the Pro plan for advanced features such as AI-generated scenarios, in-depth analytics, and customizable reports.",
    },
  ];

  return (
    <div className="relative mt-12 min-h-screen overflow-x-hidden bg-gray-900 text-white">
      <div className="fixed inset-0 z-0">
        <Background />
      </div>
      <div className="fixed inset-0 z-10 bg-gray-900 bg-opacity-70 backdrop-blur-sm"></div>

      <Header />

      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center p-4 text-center md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-20 mb-8"
        >
          <ChartArea className="mx-auto h-48 w-48 text-indigo-500" />
        </motion.div>

        <div className="relative">
          <h1 className="relative z-20 mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Revify
          </h1>
          <UserCounter />
          <CounterUpdater />
        </div>

        <p className="relative z-20 mb-8 max-w-lg text-xl text-gray-300 sm:text-2xl">
          Empower your SaaS{" "}
          <motion.span
            className="inline-block font-bold text-indigo-400"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            {" "}
            growth
          </motion.span>{" "}
          with AI-driven revenue projections. Forecast churn, profitability, and
          scale with confidence.
        </p>
        <SignupForm />
        <p className="relative z-20 mt-6 text-sm text-gray-400">
          Join other SaaS founders eagerly awaiting our launch!
        </p>

        <div id="features" className="relative z-20 mt-8 w-full max-w-5xl">
          <h2 className="mb-8 text-3xl font-bold">Key Features</h2>
          <SpotlightCards features={features} />
        </div>

        <div id="faq" className="relative z-20 mt-16 w-full max-w-3xl">
          <h2 className="mb-8 text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
