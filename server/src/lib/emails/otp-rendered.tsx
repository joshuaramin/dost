import { render } from "@react-email/render";
import AdvocaidOTP from "./templates/advocaid-otp.js";

export const renderOTPTemplate = async (fullname: string, code: string) => {
  return await render(<AdvocaidOTP fullname={fullname} code={code} />);
};
