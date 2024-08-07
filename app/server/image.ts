"use server"
import OpenAI from "openai";

export async function generateImages(x: string) {
  const openai = new OpenAI({
    //apiKey: process.env.NEXT_PUBLIC_API_KEY,
    apiKey: process.env.OPENAI_API_KEY
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