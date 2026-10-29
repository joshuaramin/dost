import { jsx as _jsx } from "react/jsx-runtime";
import { render } from "@react-email/render";
import AdvocaidOTP from "../templates/advocaid-otp.js";
export const renderOTPTemplate = (fullname, code) => {
    return render(_jsx(AdvocaidOTP, { fullname: fullname, code: code }));
};
