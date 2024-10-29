import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  username: string;
  firstName?: string;
}

export const WelcomeEmail = ({ username, firstName }: WelcomeEmailProps) => {
  const previewText = `Thank you for signing up for Revify${firstName ? ", " + firstName : ""}!`;

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
              {previewText}
            </Heading>
            <Text className="mb-6 text-center text-lg text-gray-300">
              We're excited to have you on board. Revify is currently in
              development, and we can't wait to bring you powerful AI-driven
              revenue projections for your SaaS business.
            </Text>
            <Section className="mb-8 text-center">
              <Button
                className="rounded-lg bg-indigo-600 px-20 py-6 font-semibold text-white"
                href={baseUrl}
              >
                Visit Our Website
              </Button>
            </Section>
            <Hr className="mb-6 border-gray-600" />
            <Section className="my-8">
              <Text className="mb-4 text-center text-2xl font-semibold text-white">
                Features Coming at Launch
              </Text>
              <Row>
                <Column className="w-1/2 pr-4">
                  <Img
                    src={`${baseUrl}/static/chart-column-increasing.png`}
                    width="24"
                    height="24"
                    alt="Bar Chart Icon"
                    className="mb-4"
                  />
                  <Text className="mb-2 text-lg font-semibold text-white">
                    Accurate Revenue Forecasting
                  </Text>
                  <Text className="text-gray-300">
                    Project MRR, ARR, and churn rates with ease.
                  </Text>
                </Column>
                <Column className="w-1/2 pl-4">
                  <Img
                    src={`${baseUrl}/static/git-compare.png`}
                    width="24"
                    height="24"
                    alt="Git Compare Icon"
                    className="mb-4"
                  />
                  <Text className="mb-2 text-lg font-semibold text-white">
                    Scenario Comparisons
                  </Text>
                  <Text className="text-gray-300">
                    Compare multiple growth strategies side-by-side.
                  </Text>
                </Column>
              </Row>
              <Row className="mt-8">
                <Column className="w-1/2 pr-4">
                  <Img
                    src={`${baseUrl}/static/chart-pie.png`}
                    width="24"
                    height="24"
                    alt="Pie Chart Icon"
                    className="mb-4"
                  />
                  <Text className="mb-2 text-lg font-semibold text-white">
                    Advanced Analytics
                  </Text>
                  <Text className="text-gray-300">
                    Unlock insights to optimize pricing and profitability.
                  </Text>
                </Column>
                <Column className="w-1/2 pl-4">
                  <Img
                    src={`${baseUrl}/static/sparkles.png`}
                    width="24"
                    height="24"
                    alt="Sparkles Icon"
                    className="mb-4"
                  />
                  <Text className="mb-2 text-lg font-semibold text-white">
                    AI-Powered Predictions
                  </Text>
                  <Text className="text-gray-300">
                    Auto-generate scenarios based on your inputs.
                  </Text>
                </Column>
              </Row>
            </Section>
            <Hr className="mb-6 border-gray-600" />
            <Text className="mb-4 text-center text-sm text-gray-400">
              We'll keep you updated on our progress. If you have any questions,
              feel free to{" "}
              <Link
                href="mailto:support@tryrevify.io"
                className="text-indigo-400 underline"
              >
                reach out to our team
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

export default WelcomeEmail;
