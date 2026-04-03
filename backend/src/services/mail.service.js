import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // ✅ App password (no expiration),
        
    }
})

transporter.verify()
    .then(() => {
        console.log("Transporter is ready to send emails...");
    })
    .catch((err) => {
        console.error("Error while verifying transporter:", err);
    });


export async function sendEmail({ to, subject, html }) {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
    };
    const info = await transporter.sendMail(mailOptions);
    //    console.log("Email sent:", info);
}

