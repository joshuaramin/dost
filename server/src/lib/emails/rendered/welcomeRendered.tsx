import { render } from "@react-email/render";
import AdvocaidWelcome from "../templates/welcome";

export const renderWelcome = (fullname: string) => {
    return render(
        <AdvocaidWelcome fullname={fullname} />
    );
};