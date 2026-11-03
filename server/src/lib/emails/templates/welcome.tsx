import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Button,
  Font,
} from "@react-email/components";

interface Props {
  fullname: string;
  activationUrl: string;
}

export default function AdvocaidWelcome({ fullname, activationUrl }: Props) {
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

      <Preview>Welcome to ADVOC-AID — Activate your email address</Preview>

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
                <Text style={sectionLabel}>You're In</Text>
              </Column>
            </Row>

            <Text style={titleStyle}>Welcome Aboard,</Text>

            <Text style={name}>{fullname}</Text>

            <Text style={text}>
              Your Advocaid account has been created and is ready to use. We’re
              glad to have you as part of the team working toward{" "}
              <b>data-driven HIV advocacy</b> across the Philippines.
            </Text>

            <Text style={text}>
              Before you can access your account, please activate your email
              address by clicking the button below.
            </Text>

            <Section style={buttonSection}>
              <Button href={activationUrl} style={activationButton}>
                Activate Email Address
              </Button>
            </Section>

            <Text style={activationText}>
              Clicking this link will verify and activate your email address for
              your Advocaid account.
            </Text>

            <Text style={text}>
              Once your email has been activated, you can sign in using your
              email address. We’ll send you a one-time code each time you sign
              in. No password needed, ever.
            </Text>

            <Text style={text}>
              If you have any questions or need assistance getting started,
              don’t hesitate to reach out to your team administrator.
            </Text>

            <Text style={fallbackText}>
              If the button above does not work, copy and paste the following
              link into your browser:
            </Text>

            <Text style={activationUrlText}>{activationUrl}</Text>
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

const buttonSection = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const activationButton = {
  backgroundColor: "#f59e0b",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontFamily: "Poppins, Arial, sans-serif",
  fontSize: "14px",
  fontWeight: "bold",
  lineHeight: "100%",
  padding: "14px 28px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const activationText = {
  fontSize: "12px",
  color: "#555555",
  textAlign: "center" as const,
  fontFamily: "Poppins",
  lineHeight: "1.6",
  margin: "0 0 25px",
};

const fallbackText = {
  fontSize: "12px",
  color: "#555555",
  fontFamily: "Poppins",
  lineHeight: "1.6",
  margin: "25px 0 5px",
};

const activationUrlText = {
  fontSize: "11px",
  color: "#234a6b",
  fontFamily: "Arial",
  lineHeight: "1.5",
  wordBreak: "break-all" as const,
  margin: "5px 0 25px",
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
