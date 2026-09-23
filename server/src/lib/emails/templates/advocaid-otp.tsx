import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  fullname: string;
  code: string;
}

export default function AdvocaidOTP({ fullname, code }: Props) {
  const normalizedCode = (code ?? "").slice(0, 6).padEnd(6, " ");

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Alegreya"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Alegreya",
            format: "embedded-opentype",
          }}
          fontWeight={400}
          fallbackFontFamily={"Arial"}
        />

        <Font
          fontFamily="Poppins"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Poppins",
            format: "embedded-opentype",
          }}
          fontWeight={400}
          fallbackFontFamily={"Arial"}
        />
      </Head>

      <Preview>Advocaid PH — Your one-time verification code</Preview>

      <Body style={main}>
        <Section style={headerWrapper}>
          <Container style={content}>
            <Row>
              <Column style={logoCol}>
                <Img
                  src="https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png"
                  alt="Advocaid PH"
                  height={80}
                  width={80}
                />
              </Column>

              <Column>
                <Text style={headerTitle}>HIV GEOSPATIAL SURVEILLANCE</Text>

                <Text style={headerSub}>ADVOCACY PROGRAM</Text>
              </Column>
            </Row>
          </Container>
        </Section>

        <Section style={divider} />

        <Container>
          <Section>
            <Row>
              <Column width="50">
                <Section
                  style={{
                    borderTop: "2px solid #000",
                    width: "100%",
                    top: "40px",
                  }}
                />
              </Column>

              <Column width="20">
                <Text>&nbsp;</Text>
              </Column>

              <Column>
                <Text style={sectionLabel}>Verification</Text>
              </Column>
            </Row>

            <Text style={titleStyle}>Sign-In Verification,</Text>

            <Text style={name}>{fullname}</Text>

            <Text style={text}>
              We received a sign-in request for your Advocaid account. Use the
              one-time verification code below to verify your identity and
              continue signing in.
            </Text>

            <Text style={text}>
              This code is valid for <b>10 minutes</b> and can only be used
              once.
            </Text>

            <Section style={otpBox}>
              <Text style={otpLabel}>VERIFICATION CODE</Text>

              <Row style={otpRow}>
                {Array.from({ length: 6 }, (_, index) => (
                  <Column key={index} style={otpCell}>
                    <Section style={otpSquare}>
                      <Text style={otpText}>{normalizedCode[index]}</Text>
                    </Section>
                  </Column>
                ))}
              </Row>
            </Section>

            <Section style={warningBox}>
              <Text style={warningText}>
                For your security, do not share this code with anyone. Advocaid
                PH will never ask for your verification code through phone,
                chat, or email.
              </Text>
            </Section>

            <Text style={text}>
              If you did not request this code, you can safely ignore this
              email. If you believe your account may be at risk, please contact
              your team administrator.
            </Text>
          </Section>
        </Container>

        <Section style={footerWrapper}>
          <Container style={content}>
            <Row>
              <Column style={logoCol}>
                <Img
                  src="https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png"
                  alt="Advocaid PH"
                  height={80}
                  width={80}
                />
              </Column>

              <Column>
                <Text style={footerTitle}>ADVOCAID</Text>

                <Text style={footerSub}>SECURITY NOTIFICATION</Text>
              </Column>
            </Row>

            <Text style={footerText}>
              This is an automated security message from Advocaid PH. Please do
              not reply to this email.
            </Text>

            <Section style={divider2} />

            <Text style={footerText}>
              RA 10173 - Data Privacy Act Compliant
            </Text>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

const titleStyle = {
  fontSize: "25px",
  fontFamily: "Alegreya",
  margin: "10px 0 0",
};

const divider2 = {
  padding: "0.1px",
  backgroundColor: "#ffffff",
};

const headerWrapper = {
  backgroundColor: "#234a6b",
  padding: "10px 0",
};

const sectionLabel = {
  fontWeight: "bold",
  fontSize: "12px",
  marginBottom: "20px",
  fontFamily: "Poppins",
};

const text = {
  fontSize: "14px",
  margin: "20px 0",
  fontFamily: "Poppins",
  lineHeight: "1.7",
};

const name = {
  fontSize: "18px",
  fontWeight: "bold",
  margin: "5px 0 15px",
  fontFamily: "Alegreya",
};

const headerTitle = {
  color: "#fff",
  fontSize: "18px",
  margin: 0,
  fontFamily: "Alegreya",
  fontWeight: "bolder",
};

const headerSub = {
  color: "#fff",
  fontSize: "12px",
  margin: 0,
  fontFamily: "Poppins",
};

const main = {
  backgroundColor: "#f2f2f2",
  margin: 0,
  padding: 0,
};

const content = {
  width: "100%",
  maxWidth: "600px",
  padding: "10px",
};

const divider = {
  backgroundColor: "#f59e0b",
  paddingTop: "5px",
};

const otpBox = {
  backgroundColor: "#234a6b",
  padding: "16px",
  margin: "30px 0",
};

const otpLabel = {
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "bold",
  fontFamily: "Poppins",
  margin: "0 0 10px",
};

const otpRow = {
  width: "100%",
};

const otpCell = {
  width: "16.66%",
  padding: "5px",
};

const otpSquare = {
  width: "100%",
  height: "70px",
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "4px",
  textAlign: "center" as const,
};

const otpText = {
  fontSize: "36px",
  fontWeight: "600",
  lineHeight: "70px",
  margin: 0,
  fontFamily: "Alegreya",
  color: "#234a6b",
};

const warningBox = {
  backgroundColor: "#f5e6cc",
  padding: "15px",
  margin: "20px 0",
};

const warningText = {
  fontSize: "12px",
  color: "#555555",
  fontFamily: "Poppins",
  lineHeight: "1.6",
  margin: 0,
};

const footerWrapper = {
  backgroundColor: "#234a6b",
  padding: "20px 0",
  marginTop: "30px",
};

const logoCol = {
  width: "60px",
  padding: "0 10px 0 0",
};

const footerTitle = {
  color: "#fff",
  fontSize: "18px",
  margin: 0,
  fontFamily: "Alegreya",
  fontWeight: "bolder",
};

const footerSub = {
  color: "#fff",
  fontSize: "13px",
  margin: 0,
  fontFamily: "Poppins",
};

const footerText = {
  color: "#fff",
  fontSize: "11px",
  marginTop: "10px",
  fontFamily: "Poppins",
};
