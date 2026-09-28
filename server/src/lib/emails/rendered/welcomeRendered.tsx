import { render } from "@react-email/render";
import AdvocaidWelcome from "../templates/welcome";

export const renderWelcome = async (
  fullname: string,
  activationUrl: string,
) => {
  return await render(
    AdvocaidWelcome({
      fullname,
      activationUrl,
    }),
  );
};
