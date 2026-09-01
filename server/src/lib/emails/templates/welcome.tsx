import { Body, Column, Container, Head, Html, Img, Preview, Row, Section, Text, Button, Font} from "@react-email/components";


interface Props {
    fullname: string
}

export default function AdvocaidWelcome({fullname }: Props) {
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
            <Preview>Welcome to ADVOC-AID</Preview>
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
                <Container>
                    <Section>
                    <Row>
                        <Column width="50">
                            <Section
                                style={{
                                    borderTop: "2px solid #000",
                                    width: "100%",
                                    top: "40"
                                }}
                            />
                        </Column>
                        <Column width="20">
                                <Text>&nbsp;</Text>
                        </Column>

                        <Column>
                            <Text style={sectionLabel}>
                                You're In
                            </Text>
                        </Column>
                    </Row>
                        <Text style={Title}>Welcome Aboard,</Text>
                        <Text style={name}>{fullname}</Text>

                        <Text style={text}>
                            Your Advocaid account has been created and is ready to use. We’re glad to have you as part of the team working toward <b>data-driven HIV advocacy</b> across the Philippines.
                        </Text>

                        <Text style={text}>
                            Sign in anytime using your email address — we’ll send you a one-time code each time. No password needed, ever.
                        </Text>

                        <Text style={text}>
                            If you have any questions or need assistance getting started, don’t hesitate to reach out to your team administrator.
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
                        <Section style={divider2} />
                        <Text style={footerText}>RA 1073 - Data Privacy ACT Compliant</Text>
                    </Container>
                </Section>
            </Body>
        </Html>
    )
}


const Title = {
    fontSize: 25
}

const divider2 = {
    padding: "0.1px",
    backgroundColor: "#ffffff"
}
const headerWrapper = {
    backgroundColor: "#234a6b",
    padding: "10px 0",
};

const sectionLabel = {
    fontWeight: "bold",
    fontSize: "12px",
    marginBottom: "20px",
};

const text = {
    fontSize: "14px",
    margin: "20px 0",
    fontFamily: "Poppins"
};

const name = {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "5px 0 15px",
    fontFamily: "Alegreya"
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