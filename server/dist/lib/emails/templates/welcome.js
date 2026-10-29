"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdvocaidWelcome;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
function AdvocaidWelcome({ fullname, activationUrl }) {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsxs)(components_1.Head, { children: [(0, jsx_runtime_1.jsx)(components_1.Font, { fontFamily: "Alegreya", webFont: {
                            url: "https://fonts.googleapis.com/css2?family=Alegreya",
                            format: "embedded-opentype",
                        }, fontWeight: 400, fallbackFontFamily: "Arial" }), (0, jsx_runtime_1.jsx)(components_1.Font, { fontFamily: "Poppins", webFont: {
                            url: "https://fonts.googleapis.com/css2?family=Poppins",
                            format: "embedded-opentype",
                        }, fontWeight: 400, fallbackFontFamily: "Arial" })] }), (0, jsx_runtime_1.jsx)(components_1.Preview, { children: "Welcome to ADVOC-AID \u2014 Activate your email address" }), (0, jsx_runtime_1.jsxs)(components_1.Body, { style: main, children: [(0, jsx_runtime_1.jsx)(components_1.Section, { style: headerWrapper, children: (0, jsx_runtime_1.jsx)(components_1.Container, { style: content, children: (0, jsx_runtime_1.jsxs)(components_1.Row, { children: [(0, jsx_runtime_1.jsx)(components_1.Column, { style: logoCol, children: (0, jsx_runtime_1.jsx)(components_1.Img, { src: "https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png", alt: "Advocaid PH", height: 80, width: 80 }) }), (0, jsx_runtime_1.jsxs)(components_1.Column, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: headerTitle, children: "HIV GEOSPATIAL SURVEILLANCE" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: headerSub, children: "ADVOCACY PROGRAM" })] })] }) }) }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: divider }), (0, jsx_runtime_1.jsx)(components_1.Container, { children: (0, jsx_runtime_1.jsxs)(components_1.Section, { children: [(0, jsx_runtime_1.jsxs)(components_1.Row, { children: [(0, jsx_runtime_1.jsx)(components_1.Column, { width: "50", children: (0, jsx_runtime_1.jsx)(components_1.Section, { style: {
                                                    borderTop: "2px solid #000",
                                                    width: "100%",
                                                    top: "40px",
                                                } }) }), (0, jsx_runtime_1.jsx)(components_1.Column, { width: "20", children: (0, jsx_runtime_1.jsx)(components_1.Text, { children: "\u00A0" }) }), (0, jsx_runtime_1.jsx)(components_1.Column, { children: (0, jsx_runtime_1.jsx)(components_1.Text, { style: sectionLabel, children: "You're In" }) })] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: titleStyle, children: "Welcome Aboard," }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: name, children: fullname }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: text, children: ["Your Advocaid account has been created and is ready to use. We\u2019re glad to have you as part of the team working toward", " ", (0, jsx_runtime_1.jsx)("b", { children: "data-driven HIV advocacy" }), " across the Philippines."] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: text, children: "Before you can access your account, please activate your email address by clicking the button below." }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: buttonSection, children: (0, jsx_runtime_1.jsx)(components_1.Button, { href: activationUrl, style: activationButton, children: "Activate Email Address" }) }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: activationText, children: "Clicking this link will verify and activate your email address for your Advocaid account." }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: text, children: "Once your email has been activated, you can sign in using your email address. We\u2019ll send you a one-time code each time you sign in. No password needed, ever." }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: text, children: "If you have any questions or need assistance getting started, don\u2019t hesitate to reach out to your team administrator." }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: fallbackText, children: "If the button above does not work, copy and paste the following link into your browser:" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: activationUrlText, children: activationUrl })] }) }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: footerWrapper, children: (0, jsx_runtime_1.jsxs)(components_1.Container, { style: content, children: [(0, jsx_runtime_1.jsxs)(components_1.Row, { children: [(0, jsx_runtime_1.jsx)(components_1.Column, { style: logoCol, children: (0, jsx_runtime_1.jsx)(components_1.Img, { src: "https://d2i0afz2m2bklk.cloudfront.net/advocaid-logo.png", alt: "Advocaid PH", height: 80, width: 80 }) }), (0, jsx_runtime_1.jsxs)(components_1.Column, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: footerTitle, children: "ADVOCAID" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: footerSub, children: "SECURITY NOTIFICATION" })] })] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: footerText, children: "This is an automated security message from Advocaid PH. Please do not reply to this email." }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: divider2 }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: footerText, children: "RA 10173 - Data Privacy Act Compliant" })] }) })] })] }));
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
    textAlign: "center",
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
    textAlign: "center",
};
const activationText = {
    fontSize: "12px",
    color: "#555555",
    textAlign: "center",
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
    wordBreak: "break-all",
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
