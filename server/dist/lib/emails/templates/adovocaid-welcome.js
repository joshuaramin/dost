const escapeHtml = (value) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
export const renderWelcomeTemplate = async (fullname, activationUrl) => {
    const safeFullname = escapeHtml(fullname ?? "");
    const safeActivationUrl = escapeHtml(activationUrl ?? "");
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Welcome to ADVOC-AID</title>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap');

    body {
      margin: 0;
      padding: 0;
      background-color: #f2f2f2;
      font-family: Poppins, Arial, sans-serif;
    }

    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    img {
      border: 0;
      display: block;
      outline: none;
    }

    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }

      .email-content {
        padding: 20px !important;
      }

      .header-title {
        font-size: 15px !important;
      }
    }
  </style>
</head>

<body>
  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color: #f2f2f2;"
  >
    <tr>
      <td align="center">

        <!-- Header -->
        <table
          role="presentation"
          class="email-container"
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="width: 100%; max-width: 600px;"
        >
          <tr>
            <td style="background-color: #234a6b; padding: 20px;">
              <table role="presentation" width="100%">
                <tr>
                  <td width="90" valign="middle">
                    <img
                      src="https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png"
                      alt="Advocaid PH"
                      width="80"
                      height="80"
                    />
                  </td>

                  <td valign="middle">
                    <p
                      class="header-title"
                      style="
                        color: #ffffff;
                        font-family: Alegreya, Georgia, serif;
                        font-size: 18px;
                        font-weight: bold;
                        margin: 0;
                      "
                    >
                      HIV GEOSPATIAL SURVEILLANCE
                    </p>

                    <p
                      style="
                        color: #ffffff;
                        font-family: Poppins, Arial, sans-serif;
                        font-size: 12px;
                        margin: 5px 0 0;
                      "
                    >
                      ADVOCACY PROGRAM
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent Divider -->
          <tr>
            <td style="background-color: #f59e0b; height: 5px;"></td>
          </tr>

          <!-- Email Content -->
          <tr>
            <td
              class="email-content"
              style="background-color: #ffffff; padding: 35px 40px;"
            >

              <table role="presentation" width="100%">
                <tr>
                  <td width="50%" valign="middle">
                    <div style="border-top: 2px solid #000000;"></div>
                  </td>

                  <td width="20"></td>

                  <td valign="middle">
                    <p
                      style="
                        font-family: Poppins, Arial, sans-serif;
                        font-size: 12px;
                        font-weight: bold;
                        margin: 0;
                      "
                    >
                      You're In
                    </p>
                  </td>
                </tr>
              </table>

              <h1
                style="
                  color: #222222;
                  font-family: Alegreya, Georgia, serif;
                  font-size: 25px;
                  font-weight: normal;
                  margin: 25px 0 0;
                "
              >
                Welcome Aboard,
              </h1>

              <p
                style="
                  color: #222222;
                  font-family: Alegreya, Georgia, serif;
                  font-size: 18px;
                  font-weight: bold;
                  margin: 5px 0 15px;
                "
              >
                ${safeFullname}
              </p>

              <p style="${bodyTextStyle}">
                Your Advocaid account has been created and is ready to use.
                We’re glad to have you as part of the team working toward
                <strong>data-driven HIV advocacy</strong> across the Philippines.
              </p>

              <p style="${bodyTextStyle}">
                Before you can access your account, please activate your email
                address by clicking the button below.
              </p>

              <!-- Activation Button -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin: 30px 0;"
              >
                <tr>
                  <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td
                          align="center"
                          bgcolor="#f59e0b"
                          style="border-radius: 6px;"
                        >
                          <a
                            href="${safeActivationUrl}"
                            target="_blank"
                            style="
                              background-color: #f59e0b;
                              border: 1px solid #f59e0b;
                              border-radius: 6px;
                              color: #ffffff;
                              display: inline-block;
                              font-family: Poppins, Arial, sans-serif;
                              font-size: 14px;
                              font-weight: bold;
                              padding: 14px 28px;
                              text-decoration: none;
                            "
                          >
                            Activate Email Address
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p
                style="
                  color: #555555;
                  font-family: Poppins, Arial, sans-serif;
                  font-size: 12px;
                  line-height: 1.6;
                  margin: 0 0 25px;
                  text-align: center;
                "
              >
                Clicking this link will verify and activate your email address
                for your Advocaid account.
              </p>

              <p style="${bodyTextStyle}">
                Once your email has been activated, you can sign in using your
                email address. We’ll send you a one-time code each time you
                sign in. No password needed, ever.
              </p>

              <p style="${bodyTextStyle}">
                If you have any questions or need assistance getting started,
                don’t hesitate to reach out to your team administrator.
              </p>

              <p
                style="
                  color: #555555;
                  font-family: Poppins, Arial, sans-serif;
                  font-size: 12px;
                  line-height: 1.6;
                  margin: 25px 0 5px;
                "
              >
                If the button above does not work, copy and paste the following
                link into your browser:
              </p>

              <p
                style="
                  color: #234a6b;
                  font-family: Arial, sans-serif;
                  font-size: 11px;
                  line-height: 1.5;
                  word-break: break-all;
                  overflow-wrap: anywhere;
                  margin: 5px 0 25px;
                "
              >
                <a
                  href="${safeActivationUrl}"
                  target="_blank"
                  style="color: #234a6b;"
                >
                  ${safeActivationUrl}
                </a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #234a6b; padding: 25px 20px;">
              <table role="presentation" width="100%">
                <tr>
                  <td width="90" valign="middle">
                    <img
                      src="https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png"
                      alt="Advocaid PH"
                      width="80"
                      height="80"
                    />
                  </td>

                  <td valign="middle">
                    <p
                      style="
                        color: #ffffff;
                        font-family: Alegreya, Georgia, serif;
                        font-size: 18px;
                        font-weight: bold;
                        margin: 0;
                      "
                    >
                      ADVOCAID
                    </p>

                    <p
                      style="
                        color: #ffffff;
                        font-family: Poppins, Arial, sans-serif;
                        font-size: 13px;
                        margin: 5px 0 0;
                      "
                    >
                      SECURITY NOTIFICATION
                    </p>
                  </td>
                </tr>
              </table>

              <p
                style="
                  color: #ffffff;
                  font-family: Poppins, Arial, sans-serif;
                  font-size: 11px;
                  line-height: 1.6;
                  margin: 15px 0 10px;
                "
              >
                This is an automated security message from Advocaid PH.
                Please do not reply to this email.
              </p>

              <div style="height: 1px; background-color: #ffffff;"></div>

              <p
                style="
                  color: #ffffff;
                  font-family: Poppins, Arial, sans-serif;
                  font-size: 11px;
                  margin: 10px 0 0;
                "
              >
                RA 10173 - Data Privacy Act Compliant
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};
const bodyTextStyle = `
  color: #222222;
  font-family: Poppins, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.7;
  margin: 20px 0;
`;
