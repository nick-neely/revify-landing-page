import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const title = "Revify";
const url = "https://tryrevify.io/";
const description =
  "Empower your SaaS growth with AI-driven revenue projections. Forecast churn, profitability, and scale with confidence.";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: "Revify | SaaS Revenue Projection Tool",
    template: "%s | Revify",
  },
  applicationName: title,
  description:
    "Revify is a powerful tool designed to help SaaS founders and teams forecast revenue, growth, and profitability with ease.",
  category: "Technology",
  keywords: [
    "Revify",
    "SaaS growth",
    "revenue forecasting",
    "churn analysis",
    "profitability",
    "AI-powered projections",
    "SaaS revenue calculator",
    "business growth",
    "subscription forecasting",
    "financial projections",
    "startup growth tool",
    "SaaS analytics",
  ],
  authors: [{ name: "Nick Neely" }, { url: "https://nickneely.dev/" }],
  creator: "Nick Neely",
  publisher: "Nick Neely",
  openGraph: {
    title: title,
    description: description,
    url: url,
    siteName: title,
    images: [
      {
        url: `${url}api/og`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Revify - SaaS Revenue Projection Tool",
    description:
      "Effortlessly forecast revenue, growth, and churn with Revify. Sign up to stay updated on our launch!",
    siteId: "4745196188", // @nickneely00 account
    creator: "@TryRevify",
    creatorId: "1850319161299279872", // @TryRevify account
    images: [`${url}api/og`],
  },
  manifest: `${url}manifest.json`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
