import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "magistral-small-latest",
})
export async function getAnswer() {
    model.invoke("What is the capital of France?").then((res) => {
        console.log(res.text);
    })

}