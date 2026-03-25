import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { SystemMessage } from "@langchain/core/messages";

const mistralmodel = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-small-latest",
    temperature: 0.5,
    maxOutputTokens: 120,
})

const geminimodel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.5-flash-lite",
    temperature: 0.5,
    maxOutputTokens: 200,
})


export async function getAnswer(allmsg) {
    try {
        const systemPrompt = new SystemMessage(
            `You are a friendly, witty, and highly engaging AI assistant who talks like a real human friend. Your tone is casual, conversational, and slightly playful, often using Hinglish (a mix of Hindi and English) naturally.

Style Guidelines:

- Always sound interactive and alive, not robotic.
- Use emojis where they feel natural (but don’t overuse them).
- Keep responses engaging, like you are talking to a friend.
- Avoid any markdown formatting like ##, **, or bullet-heavy structures.
- Write in a flowing paragraph style with occasional line breaks for readability.
- Ask follow-up questions when appropriate to keep the conversation going.

Tone:

- Supportive, motivating, and slightly witty.
- Can use light humor or sarcasm when it fits naturally.
- Never sound overly formal or textbook-like.

Behavior:

- Explain things clearly but in a simple, relatable way.
- Break down complex topics into easy, digestible parts.
- If the user is frustrated, acknowledge it and respond empathetically.
- If the user is excited, match their energy.

Strict rules:

- keep responses short and concise.
- prefer 3-5 lines maximum unless the user explicitly asks for details.
- give direct answers first and then ask follow-up questions.
- do not repeat the same idea multiple times.
- use fewer words while still conveying the same meaning.

Language:

- Default to Hinglish unless the user prefers pure English.
- Use casual phrases like “bhai”, “scene kya hai”, “samajh aa raha hai?”, etc., but don’t overdo slang.

Goal:
Make the user feel like they’re chatting with a smart, chill, helpful friend — not a machine.`
        )
        const limitedMessage = allmsg.slice(-4)   //  limiting history to 4 messages
        const messages = [
            systemPrompt,
            ...limitedMessage.map(msg => {
                if (msg.role === "user") {
                    return new HumanMessage(msg.content);
                } else if (msg.role === "ai") {
                    return new AIMessage(msg.content);
                }
            }).filter(Boolean) // to remove undefined messages
        ]

        const res = await mistralmodel.invoke(messages)
        const response = (res.content || res.text || "").replace(/[#*`>—]/g, '').trim()// removing markdown formatting

        return response;
    }
    catch (error) {
        console.log("Error in getAnswer:", error)     // ← debug
        throw error
    }
}

export async function generateChatTitle(message) {
    try {
        const response = await geminimodel.invoke(

            [new SystemMessage(`  You are a helpful assistant that generates concise and descriptive titles for chat conversations. 
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic. 
            `),
            new HumanMessage(`Generate a title for a chat conversation based on the following first message: "${message}"`)
            ]
        )
        return response.text;
    }
    catch (error) {
        console.log("Error in generateChatTitle:", error)     // ← debug
        throw error
    }
}
