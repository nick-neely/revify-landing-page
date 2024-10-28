import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface LaunchEmailProps {
  username: string;
}

export const LaunchEmail = ({ username }: LaunchEmailProps) => {
  const previewText = `Welcome to Revify, ${username}!`;

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-900 font-sans">
          <Container className="mx-auto my-10 max-w-2xl rounded-lg bg-gray-800 p-8">
            <Img
              src={`${baseUrl}/static/RevifyLogo.png`}
              width="80"
              height="80"
              alt="Revify Logo"
              className="mx-auto mb-6"
            />
            <Heading className="mb-6 text-center text-3xl font-bold text-white">
              Welcome to Revify, {username}!
            </Heading>
            <Text className="mb-6 text-center text-lg text-gray-300">
              We're thrilled to have you on board. Get ready to empower your
              SaaS growth with AI-driven revenue projections.
            </Text>
            <Section className="mb-8 text-center">
              <Button
                className="rounded-md bg-indigo-600 px-20 py-6 font-semibold text-white"
                href={baseUrl}
              >
                Get Started
              </Button>
            </Section>
            <Hr className="mb-6 border-gray-600" />
            <Section className="mb-8 text-center">
              <Heading className="mb-4 text-xl font-bold text-white">
                What's next?
              </Heading>
              <Text className="mb-4 text-gray-300">
                1. Complete your profile
              </Text>
              <Text className="mb-4 text-gray-300">
                2. Input your data or use our sample datasets
              </Text>
              <Text className="mb-4 text-gray-300">
                3. Generate your first revenue projection!
              </Text>
            </Section>
            <Hr className="mb-6 border-gray-600" />
            <Text className="mb-4 text-center text-sm text-gray-400">
              If you have any questions, feel free to{" "}
              <Link
                href="mailto:support@tryrevify.io"
                className="text-indigo-400 underline"
              >
                reach out to our support team
              </Link>
              .
            </Text>
            <Text className="text-center text-sm text-gray-400">
              © 2024 Revify. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default LaunchEmail;
