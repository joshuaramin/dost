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

  
  const response = await fetch(SENDLIB_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDLIB_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Advocaid PH <${SENDLIB_FROM_EMAIL}>`,
      to,
      subject,
      html,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    console.error("Sendliberty API request failed:", {
      status: response.status,
      response: error,
    });

    throw new Error(`Sendliberty API returned HTTP ${response.status}`);
  }

  const result: unknown = await response.json();

  console.log(`Email request accepted for ${to}.`);

  return result;
}
