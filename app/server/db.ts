"use server"
import { ChatOpenAI } from "@langchain/openai";

export async function generateRecipes(prompt:string) {
    const chatModel = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY
        //apiKey: process.env.NEXT_PUBLIC_API_KEY
    });
    prompt =`Generate two recipes for a ${prompt} dish. The output should ONLY be in JSON array and each object should contain a recipe name field "name", a very short description field named "description", array of ingredients named "ingredients", and array of step by step instructions named "instructions".`
    const response = await chatModel.invoke(prompt);
    //console.log(JSON.parse(response.content as string));
    return JSON.parse(response.content as string);
}

import OpenAI from "openai";

export async function POST(x: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
    //apiKey: process.env.NEXT_PUBLIC_API_KEY,
  });
  const image = await openai.images.generate(
    { 
        model: "dall-e-3", 
        prompt: x,
        n: 1
    });
  console.log("Searching for Images")
  console.log(image.data);
  console.log(image.data[0].url);
  return(image.data[0].url as string);
}
