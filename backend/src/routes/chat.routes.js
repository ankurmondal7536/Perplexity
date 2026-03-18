import { Router } from "express";
import { sendMessage, getChats, getMessages, deleteChat } from "../controllers/chat.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const chatRouter = Router();

// using auth middleware to check if user is logged in
chatRouter.post("/message", authMiddleware, sendMessage);

chatRouter.get("/", authMiddleware, getChats);

chatRouter.get("/:chatId/messages", authMiddleware, getMessages);

chatRouter.delete("/delete/:chatId", authMiddleware, deleteChat);

export default chatRouter;