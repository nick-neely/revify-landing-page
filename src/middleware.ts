import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = createRouteMatcher(["/", "/api/webhooks(.*)"]);
const adminRoutes = createRouteMatcher(["/api/counter/toggle"]);

export default clerkMiddleware(async (auth, req) => {
  // Special handling for admin routes
  if (adminRoutes(req)) {
    const authHeader = req.headers.get("authorization");
    const expectedToken = process.env.COUNTER_ADMIN_TOKEN;

    if (
      !authHeader ||
      !expectedToken ||
      authHeader !== `Bearer ${expectedToken}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Regular auth protection for non-public routes
  if (!publicRoutes(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
