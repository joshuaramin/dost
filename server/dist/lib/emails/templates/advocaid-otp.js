import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Body, Column, Container, Font, Head, Html, Img, Preview, Row, Section, Text, } from "@react-email/components";
export default function AdvocaidOTP({ fullname, code }) {
    const normalizedCode = (code ?? "").slice(0, 6).padEnd(6, " ");
    return (_jsxs(Html, { children: [_jsxs(Head, { children: [_jsx(Font, { fontFamily: "Alegreya", webFont: {
                            url: "https://fonts.googleapis.com/css2?family=Alegreya",
                            format: "embedded-opentype",
                        }, fontWeight: 400, fallbackFontFamily: "Arial" }), _jsx(Font, { fontFamily: "Poppins", webFont: {
                            url: "https://fonts.googleapis.com/css2?family=Poppins",
                            format: "embedded-opentype",
                        }, fontWeight: 400, fallbackFontFamily: "Arial" })] }), _jsx(Preview, { children: "Advocaid PH \u2014 Your one-time verification code" }), _jsxs(Body, { style: main, children: [_jsx(Section, { style: headerWrapper, children: _jsx(Container, { style: content, children: _jsxs(Row, { children: [_jsx(Column, { style: logoCol, children: _jsx(Img, { src: "https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png", alt: "Advocaid PH", height: 80, width: 80 }) }), _jsxs(Column, { children: [_jsx(Text, { style: headerTitle, children: "HIV GEOSPATIAL SURVEILLANCE" }), _jsx(Text, { style: headerSub, children: "ADVOCACY PROGRAM" })] })] }) }) }), _jsx(Section, { style: divider }), _jsx(Container, { children: _jsxs(Section, { children: [_jsxs(Row, { children: [_jsx(Column, { width: "50", children: _jsx(Section, { style: {
                                                    borderTop: "2px solid #000",
                                                    width: "100%",
                                                    top: "40px",
                                                } }) }), _jsx(Column, { width: "20", children: _jsx(Text, { children: "\u00A0" }) }), _jsx(Column, { children: _jsx(Text, { style: sectionLabel, children: "Verification" }) })] }), _jsx(Text, { style: titleStyle, children: "Sign-In Verification," }), _jsx(Text, { style: name, children: fullname }), _jsx(Text, { style: text, children: "We received a sign-in request for your Advocaid account. Use the one-time verification code below to verify your identity and continue signing in." }), _jsxs(Text, { style: text, children: ["This code is valid for ", _jsx("b", { children: "10 minutes" }), " and can only be used once."] }), _jsxs(Section, { style: otpBox, children: [_jsx(Text, { style: otpLabel, children: "VERIFICATION CODE" }), _jsx(Row, { style: otpRow, children: Array.from({ length: 6 }, (_, index) => (_jsx(Column, { style: otpCell, children: _jsx(Section, { style: otpSquare, children: _jsx(Text, { style: otpText, children: normalizedCode[index] }) }) }, index))) })] }), _jsx(Section, { style: warningBox, children: _jsx(Text, { style: warningText, children: "For your security, do not share this code with anyone. Advocaid PH will never ask for your verification code through phone, chat, or email." }) }), _jsx(Text, { style: text, children: "If you did not request this code, you can safely ignore this email. If you believe your account may be at risk, please contact your team administrator." })] }) }), _jsx(Section, { style: footerWrapper, children: _jsxs(Container, { style: content, children: [_jsxs(Row, { children: [_jsx(Column, { style: logoCol, children: _jsx(Img, { src: "https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png", alt: "Advocaid PH", height: 80, width: 80 }) }), _jsxs(Column, { children: [_jsx(Text, { style: footerTitle, children: "ADVOCAID" }), _jsx(Text, { style: footerSub, children: "SECURITY NOTIFICATION" })] })] }), _jsx(Text, { style: footerText, children: "This is an automated security message from Advocaid PH. Please do not reply to this email." }), _jsx(Section, { style: divider2 }), _jsx(Text, { style: footerText, children: "RA 10173 - Data Privacy Act Compliant" })] }) })] })] }));
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
    textAlign: "center",
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
