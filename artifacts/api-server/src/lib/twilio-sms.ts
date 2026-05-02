import twilio from "twilio";

export async function sendAlertSms(input: {
  accountSid: string;
  authToken: string;
  from: string;
  to: string;
  message: string;
}): Promise<void> {
  const client = twilio(input.accountSid, input.authToken);
  await client.messages.create({
    body: input.message,
    from: input.from,
    to: input.to,
  });
}
