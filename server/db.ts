"use server"

import { ChatOpenAI } from "@langchain/openai";

const chatModel = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateRecipes(prompt:string) {
    prompt =`Generate two recipes for a ${prompt} dish. The output should ONLY be in JSON array and each object should contain a recipe name field "name", a very short description field named "description", array of ingredients named "ingredients", and array of step by step instructions named "instructions".`
    const response = await chatModel.invoke(prompt);
    //console.log(JSON.parse(response.content as string));
    return JSON.parse(response.content as string);
}