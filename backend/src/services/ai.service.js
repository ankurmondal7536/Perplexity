import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage , AIMessage } from "@langchain/core/messages";
import { SystemMessage } from "@langchain/core/messages";

const mistralmodel = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-small-latest",
})

const geminimodel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.5-flash-lite",
})

export async function getAnswer(allmsg) {
    const response = await geminimodel.invoke(allmsg.map(msg=>{

        if (msg.role === "user") {
            return new HumanMessage(msg.content);
        } else if (msg.role === "ai") {
            return new AIMessage(msg.content);
        }
    }))

    return response.text;
}

export async function generateChatTitle(message) {
    const response = await mistralmodel.invoke(

        [new SystemMessage(`  You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic. 
            `),
        new HumanMessage(`Generate a title for a chat conversation based on the following first message: "${message}"`)
        ]
    )
    return response.text;
}
