const SENDLIB_URL = "https://sendliberty.com/api/send";

const SENDLIB_KEY = process.env.SENDLIB_KEY;
const SENDLIB_FROM_EMAIL = process.env.SENDLIB_FROM_EMAIL;

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<unknown> {
  if (!SENDLIB_KEY || !SENDLIB_FROM_EMAIL) {
    throw new Error("Sendliberty environment variables are missing.");
  }

  return await fetch(SENDLIB_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer sl_fa99766a_70215ca10b2a09aa6435b6ac574955410e5088dcca64f6e54aaa901d`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Advocaid PH <AdvocAid PH <niceradvocaid@gmail.com>>`,
      to,
      subject,
      html,
    }),
    signal: AbortSignal.timeout(15_000),
  });
}
