import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { getAnswer, generateChatTitle } from "../services/ai.service.js";


export async function sendMessage(req, res) {
    const { message, chat: chatId } = req.body;

    let title = null
    let chat = null
    if (!chatId) {
        title = await generateChatTitle(message);
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
    }

    // user messages
    const userMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: message,
        role: "user"
    })

    // all messages
    const allmsg = await messageModel.find({
        chat: chatId
    })

    // ai response based on history
    const response = await getAnswer(allmsg);
    // ai message
    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: response,
        role: "ai"
    })

    // console.log("Messages:", allmsg)     <-- debug all messages

    // response on postman
    res.status(201).json({
        title,
        chat,
        userMessage,
        aiMessage
    })










    //     res.status(201).json({
    //         title,
    //         chat,
    //         userMessage,
    //         aiMessage
    //     })
}

export async function getChats(req, res) {
    const user = req.user
    const chat = await chatModel.find({
        user: user.id
    })
    res.status(200).json(
        {
            message: "chats retrieved",
            chat
        }
    )
}

export async function getMessages(req, res) {
    const { chatId } = req.params
    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })
    if (!chat) {
        return res.status(404).json({
            message: "chat not found"
        })
    }
    const messages = await messageModel.find({
        chat: chatId
    })
    return res.status(200).json({
        message: "messages retrieved",
        messages
    })
}

export async function deleteChat(req, res) {

    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    return res.status(200).json({
        message: "Chat deleted successfully"
    })
}