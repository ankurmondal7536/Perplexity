import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { SystemMessage } from "@langchain/core/messages";
import { searchInternet } from "./internet.service.js";
import * as z from "zod";
import { tool } from "langchain";
import { createAgent } from "langchain";





const mistralmodel = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-small-latest",
    temperature: 0.7,
    maxOutputTokens: 200,
})

const geminimodel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.5-flash-lite",
    temperature: 0.5,
    maxOutputTokens: 200,
})

// Define tool with Zod schema
const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look on the internet")
        })
    }
)

const agent = createAgent({
    tools: [searchInternetTool],
    model: mistralmodel,
})



export async function getAnswer(allmsg) {
    try {        
        const systemPrompt = new SystemMessage(
            `You are a friendly, witty, and highly engaging AI assistant who talks like a real human friend. Your tone is casual, conversational, and slightly playful, often using Hinglish (a mix of Hindi and English) naturally.

Style Guidelines:
- Always sound interactive and alive, not robotic.
- Use emojis where they feel natural (but don't overuse them).
- Keep responses engaging, like you are talking to a friend.
- Avoid any markdown formatting like ##, **, or bullet-heavy structures.
- Write in a flowing paragraph style with occasional line breaks for readability.
- Ask follow-up questions when appropriate to keep the conversation going.

Table Rules (Very Important):
- When sharing schedules, matches, or lists, use a "Plain Text Table" format.
- ONLY use pipes (|) for columns and dashes (-) for separators. 
- DO NOT use bold (**) or headers (#) inside or outside the table, basically these 4 characters ( # * > (backtik)  ) will be removed from regex.
- Keep the table simple and compact so it looks clean in a chat window.
- Example: 
  Team A | Team B | Time
  -------|--------|-----
  RCB    | CSK    | 7:30 PM

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
- Use casual phrases like "haa","bilkul bhai","bro",“bhai”, “scene kya hai”, “samajh aa raha hai?”, etc., but don't overdo slang.

Additionally, you can use the searchInternet tool to search the internet for current information. The tool takes a query as input and returns a JSON object with the source and results of the search.

Goal:
Make the user feel like they are chatting with a smart, chill, helpful friend — not a machine.`
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

        const res = await agent.invoke({
            messages: messages
        })
        const lastMessage = res.messages[res.messages.length - 1]

        let response = (lastMessage.output||lastMessage.content || lastMessage.text || "").replace(/[#*`>]/g, '' && /[—]/g, "-").trim()// removing markdown formatting

        // console.log('📊 Full response:', res);  // <-- debug
        // console.log('📊 Response keys:', Object.keys(res));  // <-- debug
        // console.log('📊 Final Response:', response);  // <-- debug
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
