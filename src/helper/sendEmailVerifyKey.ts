import nodemailer from "nodemailer";

export async function SendEmailVerifyKey(recipient_email: string,key:string,limit:Date,firstName:string,lastName:string) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL, // your Gmail account
      pass: process.env.SENDER_PASS, // your Gmail password or App Password
    },
  });

  // Verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      throw new Error("" + error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  let mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: recipient_email,
    subject: "Account Verification key from Trackify",
    text: `Hello ${firstName} ${lastName} from Trackify thanks for making account here here is your key: ${key} for account verification. you can verify till ${limit}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new Error("" + error);
    }
    const response = "Email sent: " + info.response;
    console.log(response);
    return response;
  });
}
