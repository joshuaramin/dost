const SENDLIB_URL = "https://sendliberty.com/api/send";

const SENDLIB_KEY = process.env.SENDLIB_KEY;
const SENDLIB_FROM_EMAIL = process.env.SENDLIB_FROM_EMAIL;

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SendEmailResponse {
  success?: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<SendEmailResponse> {
  if (!SENDLIB_KEY || !SENDLIB_FROM_EMAIL) {
    throw new Error("Sendliberty environment variables are missing.");
  }

  if (!to || !subject || !html) {
    throw new Error("Recipient, subject, and HTML are required.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(SENDLIB_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDLIB_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        from: SENDLIB_FROM_EMAIL,
        to,
        subject,
        html,
        ...(text ? { text } : {}),
      }),
      signal: controller.signal,
    });

    const responseBody = await response.text();

    let result: SendEmailResponse;

    try {
      result = responseBody ? JSON.parse(responseBody) : {};
    } catch {
      result = {};
    }

    if (!response.ok) {
      console.error("Sendliberty API error:", {
        status: response.status,
        response: result,
      });

      throw new Error(`Email delivery request failed: HTTP ${response.status}`);
    }

    return result;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Sendliberty request timed out.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
