import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js"
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

    const emailVerificationToken = jwt.sign({
        email: user.email

    }, process.env.JWT_SECRET);


    await sendEmail({
        to: user.email,
        subject: "Welcome to Perplexity",
        html: `
        <p>Welcome to JNX AI, ${username}!</p>
        <p>Please verify your email by clicking the following link:</p>
        <a href="https://perplexity-jnxai.onrender.com/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        `
    })

    return res.status(201).json({
        message: "User created successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

export async function login(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({
        email: email
    }).select("+password");
    
    if (!user) {
        return res.status(400).json({
            message: "User not found",
            success: false,
            error: "User not found"
        })
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return res.status(400).json({
            message: "Incorrect password",
            success: false,
            error: "Incorrect password"
        })
    }
    if (!user.verified) {
        return res.status(400).json({
            message: "Email not verified, try veryfying your email",
            success: false,
            error: "Email not verified"
        })
    }
    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.JWT_SECRET);

    res.cookie("token", token)

    return res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },

    })
}

export async function getMe(req, res) {
    const userId = req.user.id

    const user = await userModel.findById(userId).select("-password");
    
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            error: "User not found"
        });
    }
    return res.status(200).json({
        message: "User found",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

export async function verifyEmail(req, res) {
    const { token } = req.query;
    console.log("Token received:", token);  // debug

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded:", decoded);  // ← debug
        const user = await userModel.findOne({ email: decoded.email })
        //    console.log("User found:", user);  // ← debug

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }

        user.verified = true;
        await user.save();
        const html = `
        <h1>Email Verified Successfully!</h1>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="https://perplexity-jnxai.onrender.com/login">Go to Login</a> 
    ` // * the a tag needs to be changed after deployment.
    
        return res.send(html);
    } catch (err) {
        console.log("Exact Error:", err.message);
        res.status(400).json({
            message: "Invalid token",
            success: false,
            error: "user not found"
        });
    }

}

