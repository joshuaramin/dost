interface OTPEmailProps {
  fullname: string;
  code: string;
}

const escapeHtml = (value: string): string => {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
};

export const renderOTPTemplate = async (
  fullname: string,
  code: string,
): Promise<string> => {
  const normalizedCode = escapeHtml((code ?? "").slice(0, 6).padEnd(6, " "));
  const safeFullname = escapeHtml(fullname ?? "");

  const otpCells = Array.from(
    { length: 6 },
    (_, index) => `
      <td align="center" valign="middle" width="16.66%" style="padding: 5px;">
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 4px;"
        >
          <tr>
            <td align="center" valign="middle" height="70"
              style="height: 70px; font-family: Arial, sans-serif; font-size: 36px; font-weight: 600; line-height: 70px; color: #234a6b;">
              ${normalizedCode[index]}
            </td>
          </tr>
        </table>
      </td>
    `,
  ).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Advocaid PH - Verification Code</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f2f2f2; font-family: Arial, sans-serif;">

  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">
    Advocaid PH — Your one-time verification code.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color: #f2f2f2;">
    <tr>
      <td align="center" style="padding: 0;">

        <!-- HEADER -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width: 600px; background-color: #234a6b;">
          <tr>
            <td style="padding: 20px 25px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="80" valign="middle" style="padding-right: 15px;">
                    <img
                      src="https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png"
                      alt="Advocaid PH"
                      width="80"
                      height="80"
                      style="display: block; border: 0; width: 80px; height: 80px;"
                    >
                  </td>

                  <td valign="middle">
                    <p style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 0 0 5px;">
                      HIV GEOSPATIAL SURVEILLANCE
                    </p>
                    <p style="color: #ffffff; font-size: 12px; margin: 0;">
                      ADVOCACY PROGRAM
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- DIVIDER -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width: 600px;">
          <tr>
            <td height="5" style="height: 5px; background-color: #f59e0b;"></td>
          </tr>
        </table>

        <!-- MAIN CONTENT -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width: 600px; background-color: #ffffff;">
          <tr>
            <td style="padding: 35px 30px;">

              <!-- SECTION LABEL -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50%" valign="middle">
                    <div style="height: 2px; background-color: #000000;"></div>
                  </td>
                  <td width="20"></td>
                  <td align="right" valign="middle">
                    <span style="font-size: 12px; font-weight: bold;">
                      Verification
                    </span>
                  </td>
                </tr>
              </table>

              <!-- GREETING -->
              <h1 style="font-size: 25px; font-weight: normal; margin: 25px 0 0; color: #222222;">
                Sign-In Verification,
              </h1>

              <p style="font-size: 18px; font-weight: bold; margin: 5px 0 15px; color: #222222;">
                ${safeFullname}
              </p>

              <p style="font-size: 14px; line-height: 1.7; margin: 20px 0; color: #333333;">
                We received a sign-in request for your Advocaid account. Use the
                one-time verification code below to verify your identity and
                continue signing in.
              </p>

              <p style="font-size: 14px; line-height: 1.7; margin: 20px 0; color: #333333;">
                This code is valid for <strong>10 minutes</strong> and can only
                be used once.
              </p>

              <!-- OTP BOX -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color: #234a6b; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px 12px;">

                    <p style="color: #ffffff; font-size: 12px; font-weight: bold; margin: 0 0 10px;">
                      VERIFICATION CODE
                    </p>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        ${otpCells}
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- SECURITY WARNING -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color: #f5e6cc; margin: 20px 0;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="font-size: 12px; line-height: 1.6; color: #555555; margin: 0;">
                      For your security, do not share this code with anyone.
                      Advocaid PH will never ask for your verification code
                      through phone, chat, or email.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- ADDITIONAL INFORMATION -->
              <p style="font-size: 14px; line-height: 1.7; margin: 20px 0; color: #333333;">
                If you did not request this code, you can safely ignore this
                email. If you believe your account may be at risk, please
                contact your team administrator.
              </p>

            </td>
          </tr>
        </table>

        <!-- FOOTER -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width: 600px; background-color: #234a6b;">
          <tr>
            <td style="padding: 25px;">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="80" valign="middle" style="padding-right: 15px;">
                    <img
                      src="https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png"
                      alt="Advocaid PH"
                      width="80"
                      height="80"
                      style="display: block; border: 0; width: 80px; height: 80px;"
                    >
                  </td>

                  <td valign="middle">
                    <p style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 0 0 5px;">
                      ADVOCAID
                    </p>
                    <p style="color: #ffffff; font-size: 13px; margin: 0;">
                      SECURITY NOTIFICATION
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #ffffff; font-size: 11px; line-height: 1.6; margin: 15px 0 10px;">
                This is an automated security message from Advocaid PH.
                Please do not reply to this email.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td height="1" style="height: 1px; background-color: #ffffff;"></td>
                </tr>
              </table>

              <p style="color: #ffffff; font-size: 11px; margin: 12px 0 0;">
                RA 10173 - Data Privacy Act Compliant
              </p>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};
