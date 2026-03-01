import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SEND_GRID_API_KEY as string);

type Sendgrid = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export function SendToMail({ from, to, subject, html }: Sendgrid) {
  try {
    sendgrid.send({
      from,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error(err);
  }
}
