import { Router } from "express";
import { register , verifyEmail, login, getMe } from "../controllers/authControllers.js";
import { registerValidator , loginValidator } from "../validators/auth.validator.js";
import authMiddleware from "../middleware/auth.middleware.js";
const authRouter = Router();


// register
authRouter.post("/register", registerValidator, register);

//login 
authRouter.post("/login", loginValidator, login);

// get-me
authRouter.get("/get-me", authMiddleware, getMe);

// verify email
authRouter.get("/verify-email", verifyEmail);

export default authRouter;