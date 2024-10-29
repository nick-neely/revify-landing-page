import WelcomeEmail from "@/emails/WelcomeEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(
  email: string,
  username: string,
  firstName: string | null
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Revify <noreply@updates.tryrevify.io>",
      to: [email],
      subject: `Welcome to Revify, ${username}!`,
      react: WelcomeEmail({ username, firstName: firstName || undefined }),
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send welcome email");
    }

    return data;
  } catch (error) {
    console.error("Error in sendWelcomeEmail:", error);
    throw error;
  }
}
