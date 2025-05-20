"use server"
import OpenAI from "openai"

const openai = new OpenAI()

// Generate Recipes Function
export async function generateRecipes(prompt: string) {
    const formattedPrompt = `Genrate two recipes for a ${prompt} dish. The output should ONLY be in JSON array and each object should contain a recipe name field "name", a very short description field named "description", array of ingredients named "ingredients", and array of step by step instructions named "instructions".`
  
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: formattedPrompt }],
    })
  
    let answer = response.choices[0].message.content
    if (answer) {
        // Remove any potential code block markers (```json and ```)
        answer = answer.trim().replace(/```json|```/g, '')

        try {
            const final_ans = JSON.parse(answer)
            console.log(final_ans)
            return final_ans
        } catch (err) {
            console.error("Failed to parse JSON:")
            throw new Error("Failed to parse JSON from OpenAI API response")
        }
    } else {
        throw new Error("No content received from OpenAI API")
    }
}

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
