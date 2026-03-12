import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID
    }
    })

  transporter.verify()
    .then(() => {
        console.log("Transporter is ready to send emails...");
    })
    .catch((err) => {
        console.error("Error while verifying transporter:", err);
    });


  export async function sendEmail({to, subject, html}) {
       const mailOptions = {
           from: process.env.GOOGLE_USER,
           to,
           subject,
           html,
       };
       const info =await transporter.sendMail(mailOptions);
    //    console.log("Email sent:", info);
    }

