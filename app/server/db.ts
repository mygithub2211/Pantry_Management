"use server" // tells Next.js that this file contains a server-side function

import OpenAI from "openai" // imports OpenAI SDK

const openai = new OpenAI() // creates an instance of OpenAI class. Automatically use the OPENAI_API_KEY from .env.local file

// this is an asynchronous function that generates 2 recipes based on a user-provided dish type
export async function generateRecipes(prompt: string) { 
    // formats the user's prompt to instruct the model to return exactly 2 recipes in a specific JSON format
    // the output will be a JSON array which include 2 objects. Each object will be 1 recipe which has name, description, ingredients, instructions
    const formattedPrompt = `Generate two recipes for a ${prompt} dish. The output should ONLY be in JSON array and each object should contain a recipe name field "name", a very short description field named "description", array of ingredients named "ingredients", and array of step by step instructions named "instructions".`
    
    // send the formattedPrompt to the OpenAI chat completion endpoint using the GPT-4o-mini model
    // the model will output an array of 2 objects (2 recipes)
    // response will include model, choices. Inside choices, there is message. Inside message, there is content (output for formattedPrompt)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // model is used to generate output
      messages: [{ role: "user", content: formattedPrompt }], // send the formattedPrompt as a message from the "user"
    })
  
    // to access the content variable which is the formatted string of JSON array which contains 2 objects (2 recipes)
    // content: `[{recipe1}, {recipe2}]` 
    // answer = `[{recipe1}, {recipe2}]`
    let answer = response.choices[0].message.content 

    if (answer) { // means we have recipes
        answer = answer.trim().replace(/```json|```/g, '') // remove any potential code block markers (```json and ```)

        try {
            const final_ans = JSON.parse(answer) // converts the formatted string JSON array to a regular JSON array (array of objects)
            console.log(final_ans) // testing purposes
            return final_ans // returns the array of object
        } 
        catch (err) {
            console.error("Failed to parse JSON:")
            throw new Error("Failed to parse JSON from OpenAI API response")
        }
    } 
    else { // means there was nothing in the content variable
        throw new Error("No content received from OpenAI API")
    }
}

// this is an asynchronous function that generates pictures coresponding to user's input
export async function generateImages(x: string) {
  const image = await openai.images.generate(
    { 
        model: "dall-e-3", 
        prompt: x,
        n: 1
  })
  console.log("Searching for Images")
  console.log(image.data)
  console.log(image.data[0].url)
  return(image.data[0].url as string)
}
