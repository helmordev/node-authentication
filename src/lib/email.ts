import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (data: {
  to: string;
  subject: string;
  text: string;
}) => {
  try {
    await resend.emails.send({
      from: `${process.env.APP_NAME} ${process.env.FROM_EMAIL}`,
      to: data.to,
      subject: data.subject,
      text: data.text,
    });
    console.log(`Email sent successfully to ${data.to}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email");
  }
};
