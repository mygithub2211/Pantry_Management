"use server"

import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
    //apiKey: process.env.NEXT_PUBLIC_API_KEY,
});


// Generate Recipes Function
export async function generateRecipes(prompt: string) {
    const formattedPrompt = `Generate two recipes for a ${prompt} dish. The output should ONLY be in JSON array and each object should contain a recipe name field "name", a very short description field named "description", array of ingredients named "ingredients", and array of step by step instructions named "instructions".`;
  
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: formattedPrompt }],
    });
  
    const answer = response.choices[0].message.content;
    if (answer) {
        const final_ans= JSON.parse(answer);
        console.log(final_ans);
        return final_ans;
    } else {
        throw new Error("No content received from OpenAI API");
    }
}

export async function generateImages(x: string) {
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
