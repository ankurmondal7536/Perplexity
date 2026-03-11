import jwt from "jsonwebtoken";
import  userModel  from "../models/user.model.js"
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {
    const { username, email, password } = req.body;
    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    if (isUserAlreadyExist) {
        return res.status(400).json({ 
            message: "User already exists",
            success: false,
            error: "user already exists"
        });
    }
    const user = await userModel.create({
        username,
        email,
        password
    });

    await sendEmail({
        to: user.email,
        subject: "Welcome to Perplexity",
        html: `
        <p>Welcome to Perplexity, ${username}!</p>
        <p>Please verify your email to activate your account.</p>`
    })
    return res.status(201).json({
        message: "User created successfully",
        success: true,
        user : {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}
