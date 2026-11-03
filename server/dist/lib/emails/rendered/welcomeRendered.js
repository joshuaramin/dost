import { render } from "@react-email/render";
import AdvocaidWelcome from "../templates/welcome.js";
export const renderWelcome = async (fullname, activationUrl) => {
    return await render(AdvocaidWelcome({
        fullname,
        activationUrl,
    }));
};
