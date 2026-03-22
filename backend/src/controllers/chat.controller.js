import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { getAnswer, generateChatTitle } from "../services/ai.service.js";


export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId } = req.body;
        // console.log('message:', message) 
        // console.log('received chatId:', chatId) // ← debug

    let title = null
    let chat = null
    if (!chatId) {
        // console.log("creating new chat")  <-- debug
        title = await generateChatTitle(message);
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
        // console.log("new chat created:")  // ← debug
    }
    
    else {
        // console.log('✅ Fetching existing chat:', chatId)  <-- debug
            // Existing chat fetch
            chat = await chatModel.findById(chatId)
            if(!chat){
                // console.log("❌ Chat not found:")  // ← debug
            }
            // console.log("chat found:", chat._id)  // ← debug
        }

    // user messages
    const userMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: message,
        role: "user"
    })

    // all messages
    const allmsg = await messageModel.find({
        chat: chatId || chat._id
    })
    // console.log("all messages before follow up:", allmsg.length)     //for debug

    // ai response based on history
    const response = await getAnswer(allmsg);
    // ai message
    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: response,
        role: "ai",
        model: "Gemini"
    })

    const updatedMessages = await messageModel.find({
        chat: chatId || chat._id
    }).sort({ createdAt: 1 })

    // console.log('Total messages after follow up', updatedMessages.length, 'messages') <-- debug
    // console.log('✅ Chat ID in response:', chat._id) // ← debug

    
    // console.log("Messages:", allmsg)     <-- debug all messages

    // response on postman
    res.status(201).json({
        success: true,
        title,
        chat: {
            _id: chat._id,
            messages: updatedMessages // updated messages after follow up
        },
        userMessage,
        aiMessage
    })
    }
    catch(error){
        console.error("Error:", error)     // ← debug
        res.status(500).json({
            message: "Error fetching chats",
            error: error.message
        })
    }
}

export async function getChats(req, res) {

    try {
        const user = req.user
        const chats = await chatModel.find({
            user: user.id
        })
        // fetchng last message for each chat
        const chatsWithLastMessage = await Promise.all(
            chats.map(async (chat) => {
                const lastMessage = await messageModel.findOne({ chat: chat._id })
                    .sort({ createdAt: -1 })  // Latest message
                return {
                    ...chat.toObject(),
                    lastMessage: lastMessage?.content || 'No messages yet'
                }
            }))
        res.status(200).json(
            {
                message: "chats retrieved",
                chats: chatsWithLastMessage,    // chats add kr dena agar koi dikkat aayi to
                success: true
            }
        )
    }
    catch (error) {
        console.log("Error:", error)
        res.status(500).json({
            message: "Error fetching chats",
            error: error
        })
    }
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
        chat: chatId || chat._id
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