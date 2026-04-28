import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Text,
    Section,
    Row,
    Column,
    Img,
    Font
} from "@react-email/components";


interface Props {
    fullname: string
    code: string
}


export default function AdvocaidOTP({ fullname, code }: Props) {

    const normalizedCode = (code ?? "").slice(0, 6).padEnd(6, "");

    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Alegreya"
                    webFont={{ url: "https://fonts.googleapis.com/css2?family=Alegreya", format: "embedded-opentype" }}
                    fontWeight={400}
                    fallbackFontFamily={"Arial"}
                />
                <Font
                    fontFamily="Poppins"
                    webFont={{ url: "https://fonts.googleapis.com/css2?family=Poppins", format: "embedded-opentype" }}
                    fontWeight={400}
                    fallbackFontFamily={"Arial"}
                />
            </Head>
            <Preview>OTP Verification Code</Preview>

            <Body style={main}>
                <Section style={headerWrapper}>
                    <Container style={content}>
                        <Row >
                            <Column style={logoCol}>
                                <Img src={`https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png`} alt="" height={80} width={80} />
                            </Column>

                            <Column>
                                <Text style={headerTitle}>
                                    HIV GEOSPATIAL SURVEILLANCE
                                </Text>
                                <Text style={headerSub}>ADVOCACY PROGRAM</Text>
                            </Column>
                        </Row>
                    </Container>
                </Section>
                <Section style={divider} />
                <Container style={content}>
                    <Section>
                        <Text style={sectionLabel}>VERIFICATION CODE</Text>

                        <Text style={text}>Hello,</Text>
                        <Text style={name}>{fullname}</Text>

                        <Text style={text}>
                            We received a sign-in request for your account. Use the code below
                            to verify your identity. This code is valid for 10 minutes and can
                            only be used once.
                        </Text>
                    </Section>
                    <Section style={otpBox}>
                        <Text style={otpLabel}>VERIFICATION CODE</Text>

                        <Row style={{ marginTop: "10px" }}>
                            {Array.from({ length: 6 }, (_, i) => (
                                <Column key={i} style={otpCell}>
                                    <Section style={otpSquare}>
                                        <Text style={otpText}>{normalizedCode[i]}</Text>
                                    </Section>
                                </Column>
                            ))}
                        </Row>

                    </Section>
                    {/* WARNING */}
                    <Section style={warningBox}>
                        <Text style={warningText}>
                            For your security, do not share this code with anyone. We will never ask for it through phone, chat, or email. If you didn’t request this code, please ignore this message or contact support.
                        </Text>
                    </Section>
                </Container>
                <Section style={footerWrapper}>
                    <Container style={content}>
                        <Row>
                            <Column style={logoCol}>
                                <Img src={`https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png`} alt="" height={80} width={80} />
                            </Column>

                            <Column>
                                <Text style={footerTitle}>ADVOCAID</Text>
                                <Text style={footerSub}>SECURITY NOTIFICATION</Text>
                            </Column>
                        </Row>

                        <Text style={footerText}>
                            This is an automated security message from Advocaid PH. Please do not reply to this email.
                        </Text>
                    </Container>
                </Section>
            </Body>
        </Html>
    );
}

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

const headerWrapper = {
    backgroundColor: "#234a6b",
    padding: "10px 0",
};

const divider = {
    backgroundColor: "#f59e0b",
    paddingTop: "5px"
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


const headerTitle = {
    color: "#fff",
    fontSize: "18px",
    margin: 0,
    fontFamily: "Alegreya",
    fontWeight: "bolder"
};

const headerSub = {
    color: "#fff",
    fontSize: "12px",
    margin: 0,
    fontFamily: "Poppins"
};

const sectionLabel = {
    fontWeight: "bold",
    fontSize: "12px",
    marginBottom: "20px",
};

const text = {
    fontSize: "14px",
    margin: "5px 0",
    fontFamily: "Poppins"
};

const name = {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "5px 0 15px",
    fontFamily: "Alegreya"
};

const otpBox = {
    backgroundColor: "#234a6b",
    padding: "1rem",
    marginTop: "20px",
};

const otpLabel = {
    color: "#fff",
    fontSize: "12px",
};

const otpCell = {
    width: "16.66%",
    padding: "5px"
};

const otpSquare = {
    width: "100%",
    height: "80px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    textAlign: "center" as const,
};

const otpText = {
    fontSize: "40px",
    fontWeight: "600",
    lineHeight: "80px", // 👈 THIS centers vertically
    margin: 0,
};
const warningBox = {
    backgroundColor: "#f5e6cc",
    padding: "15px",
    marginTop: "20px",
};

const warningText = {
    fontSize: "14px",
    fontFamily: "Poppins"
};

const footerTitle = {
    color: "#fff",
    fontSize: "18px",
    margin: 0,
    fontFamily: "Alegreya",
    fontWeight: "bolder"
};

const footerSub = {
    color: "#fff",
    fontSize: "13px",
    margin: 0,
    fontFamily: "Poppins"
};

const footerText = {
    color: "#fff",
    fontSize: "11px",
    marginTop: "10px",
    fontFamily: "Poppins"
};