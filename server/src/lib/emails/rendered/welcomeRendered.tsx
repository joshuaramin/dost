import { render } from "@react-email/render";
import AdvocaidWelcome from "../templates/welcome";

export const renderOTPTemplate = (fullname: string, code: string) => {
    return render(
        <AdvocaidWelcome fullname={fullname} />
    );
};