import { render } from "@react-email/render";
import AdvocaidWelcome from "../templates/welcome";

export const renderWelcome = (link: string, fullname: string) => {
  return render(<AdvocaidWelcome activationUrl={link} fullname={fullname} />);
};
