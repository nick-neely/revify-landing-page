import WelcomeEmail from "@/emails/WelcomeEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, username, firstName } = await request.json();
  try {
    const { data, error } = await resend.emails.send({
      from: "Revify <noreply@updates.tryrevify.io>",
      to: [email],
      subject: `Welcome to Revify, ${username}!`,
      react: <WelcomeEmail username={username} firstName={firstName} />,
    });

    if (error) {
      console.log("Error sending email: ", error);
      return Response.json({ error }, { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("Error in POST /api/emails:", err);

    if (err instanceof Error) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }

    // Fallback for unknown error types
    return new Response(
      JSON.stringify({ error: "An unknown error occurred" }),
      { status: 500 }
    );
  }
}
