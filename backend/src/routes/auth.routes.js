import { Router } from "express";
import { register , verifyEmail, login } from "../controllers/authControllers.js";
import { registerValidator , loginValidator } from "../validators/auth.validator.js";
const authRouter = Router();


// register
authRouter.post("/register", registerValidator, register);

//login 
authRouter.post("/login", loginValidator, login);

// verify email
authRouter.get("/verify-email", verifyEmail);

export default authRouter;