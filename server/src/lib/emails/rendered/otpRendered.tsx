import { render } from "@react-email/render";
import AdvocaidOTP from "../templates/advocaid-otp.js";

const renderOTPTemplate = (fullname: string, code: string) => {
  return render(<AdvocaidOTP fullname={fullname} code={code} />);
};

export default renderOTPTemplate;
