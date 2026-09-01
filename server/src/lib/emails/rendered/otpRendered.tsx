import { render } from "@react-email/render";
import AdvocaidOTP from "../templates/advocaid-otp";

export const renderOTPTemplate = (fullname: string, code: string) => {
    return render(
        <AdvocaidOTP fullname={fullname} code={code} />
    );
};