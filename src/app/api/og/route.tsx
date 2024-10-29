import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Revify";

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-gray-900">
        <div tw="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-3xl p-12 flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6366f1"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 3v18h18" />
            <path d="m3 12 4-4 6 6 4-4 4 4" />
          </svg>
          <h1 tw="text-7xl font-extrabold text-white mt-8 mb-4 text-center">
            {title}
          </h1>
          <p tw="text-2xl text-gray-300 mb-8 text-center max-w-3xl">
            Empower your SaaS{" "}
            <span tw="inline-block font-bold text-indigo-400 px-1">
              {" "}
              growth
            </span>{" "}
            with AI-driven revenue projections
          </p>
          <div tw="flex space-x-6">
            <div tw="flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 mr-6 text-lg font-semibold text-white">
              Get Notified
            </div>
            <div tw="flex items-center justify-center rounded-md border border-gray-600 px-6 py-3 text-lg font-semibold text-white">
              Learn More
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
