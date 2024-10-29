import { sendWelcomeEmail } from "@/lib/email";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const { type, data } = evt;

  if (type === "user.created") {
    const { id, email_addresses, username, first_name } = data;
    const email = email_addresses[0]?.email_address;

    if (email) {
      try {
        await sendWelcomeEmail(email, username || id, first_name);
        return NextResponse.json(
          { message: "Welcome email sent successfully" },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error sending welcome email:", error);
        return NextResponse.json(
          { error: "Failed to send welcome email" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
