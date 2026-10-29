"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdvocaidOTP;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
function AdvocaidOTP({ fullname, code }) {
    const normalizedCode = (code ?? "").slice(0, 6).padEnd(6, " ");
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsxs)(components_1.Head, { children: [(0, jsx_runtime_1.jsx)(components_1.Font, { fontFamily: "Alegreya", webFont: {
                            url: "https://fonts.googleapis.com/css2?family=Alegreya",
                            format: "embedded-opentype",
                        }, fontWeight: 400, fallbackFontFamily: "Arial" }), (0, jsx_runtime_1.jsx)(components_1.Font, { fontFamily: "Poppins", webFont: {
                            url: "https://fonts.googleapis.com/css2?family=Poppins",
                            format: "embedded-opentype",
                        }, fontWeight: 400, fallbackFontFamily: "Arial" })] }), (0, jsx_runtime_1.jsx)(components_1.Preview, { children: "Advocaid PH \u2014 Your one-time verification code" }), (0, jsx_runtime_1.jsxs)(components_1.Body, { style: main, children: [(0, jsx_runtime_1.jsx)(components_1.Section, { style: headerWrapper, children: (0, jsx_runtime_1.jsx)(components_1.Container, { style: content, children: (0, jsx_runtime_1.jsxs)(components_1.Row, { children: [(0, jsx_runtime_1.jsx)(components_1.Column, { style: logoCol, children: (0, jsx_runtime_1.jsx)(components_1.Img, { src: "https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png", alt: "Advocaid PH", height: 80, width: 80 }) }), (0, jsx_runtime_1.jsxs)(components_1.Column, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: headerTitle, children: "HIV GEOSPATIAL SURVEILLANCE" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: headerSub, children: "ADVOCACY PROGRAM" })] })] }) }) }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: divider }), (0, jsx_runtime_1.jsx)(components_1.Container, { children: (0, jsx_runtime_1.jsxs)(components_1.Section, { children: [(0, jsx_runtime_1.jsxs)(components_1.Row, { children: [(0, jsx_runtime_1.jsx)(components_1.Column, { width: "50", children: (0, jsx_runtime_1.jsx)(components_1.Section, { style: {
                                                    borderTop: "2px solid #000",
                                                    width: "100%",
                                                    top: "40px",
                                                } }) }), (0, jsx_runtime_1.jsx)(components_1.Column, { width: "20", children: (0, jsx_runtime_1.jsx)(components_1.Text, { children: "\u00A0" }) }), (0, jsx_runtime_1.jsx)(components_1.Column, { children: (0, jsx_runtime_1.jsx)(components_1.Text, { style: sectionLabel, children: "Verification" }) })] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: titleStyle, children: "Sign-In Verification," }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: name, children: fullname }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: text, children: "We received a sign-in request for your Advocaid account. Use the one-time verification code below to verify your identity and continue signing in." }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: text, children: ["This code is valid for ", (0, jsx_runtime_1.jsx)("b", { children: "10 minutes" }), " and can only be used once."] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: otpBox, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: otpLabel, children: "VERIFICATION CODE" }), (0, jsx_runtime_1.jsx)(components_1.Row, { style: otpRow, children: Array.from({ length: 6 }, (_, index) => ((0, jsx_runtime_1.jsx)(components_1.Column, { style: otpCell, children: (0, jsx_runtime_1.jsx)(components_1.Section, { style: otpSquare, children: (0, jsx_runtime_1.jsx)(components_1.Text, { style: otpText, children: normalizedCode[index] }) }) }, index))) })] }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: warningBox, children: (0, jsx_runtime_1.jsx)(components_1.Text, { style: warningText, children: "For your security, do not share this code with anyone. Advocaid PH will never ask for your verification code through phone, chat, or email." }) }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: text, children: "If you did not request this code, you can safely ignore this email. If you believe your account may be at risk, please contact your team administrator." })] }) }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: footerWrapper, children: (0, jsx_runtime_1.jsxs)(components_1.Container, { style: content, children: [(0, jsx_runtime_1.jsxs)(components_1.Row, { children: [(0, jsx_runtime_1.jsx)(components_1.Column, { style: logoCol, children: (0, jsx_runtime_1.jsx)(components_1.Img, { src: "https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png", alt: "Advocaid PH", height: 80, width: 80 }) }), (0, jsx_runtime_1.jsxs)(components_1.Column, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: footerTitle, children: "ADVOCAID" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: footerSub, children: "SECURITY NOTIFICATION" })] })] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: footerText, children: "This is an automated security message from Advocaid PH. Please do not reply to this email." }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: divider2 }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: footerText, children: "RA 10173 - Data Privacy Act Compliant" })] }) })] })] }));
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
