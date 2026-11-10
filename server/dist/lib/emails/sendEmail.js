const SENDLIB_URL = "https://sendliberty.com/api/send";
const SENDLIB_KEY = process.env.SENDLIB_KEY;
const SENDLIB_FROM_EMAIL = process.env.SENDLIB_FROM_EMAIL;
export async function sendEmail({ to, subject, html, }) {
    if (!SENDLIB_KEY || !SENDLIB_FROM_EMAIL) {
        throw new Error("Sendliberty environment variables are missing.");
    }
    return await fetch(SENDLIB_URL, {
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
}
//# sourceMappingURL=sendEmail.js.map