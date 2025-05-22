"use client" // enables client-side function

import { useState } from "react" // import the useState hook for managing component state
import { Box, Button, TextField, Typography } from "@mui/material" 
import { Card, CardContent, List, ListItem, ListItemText, styled } from "@mui/material"
import { generateRecipes } from "./server/db" // import generateRecipes

// Styled MUI ListItem to show bullet points with spacing
const BulletListItem = styled(ListItem)(({ theme }) => ({
  padding: "4px 0", // Adjust vertical spacing inside the list item
  margin: 0,
  "&::before": {
    content: "'•'", // Adds a bullet point before each item
    color: theme.palette.text.primary,
    fontSize: "1.2rem",
    marginRight: theme.spacing(1),
  }
}))

// Search for recipe
export function RecipeSearch() {
  const [prompt, setPrompt] = useState<string>("") // State to hold the input prompt 
  const [recipes, setRecipes] = useState<any[]>([]) // State to hold the array of recipe objects returned from the server db.ts

  async function handleSearch() { // asynchronous function runs when search is performed
    console.log("Searching for:", prompt) 
    let result = await generateRecipes(prompt) // the array of objects
    setRecipes(result) // store the array of objects to recipes state
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {// responsible for the "Enter" key on keyboard
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // JSX components
  return (
    <Box width="100vw" height="100vh" padding={2} display="flex" flexDirection="column" alignItems="center">
      {/* the input box to enter recipe name */}
      <TextField
        variant="outlined"
        value={prompt}
        placeholder="Enter recipe name..."
        onKeyDown={handleKeyPress}
        onChange={(e) => setPrompt(e.target.value)} //set user input for prompt state
        sx={{ 
          width: "60%",
          marginBottom: 2
        }}
        /> 

      <Button type="submit" variant="contained" onClick={handleSearch}>Search</Button> {/* search button */}

      <Box display="flex" flexDirection="row" flexWrap="wrap" marginTop={3} gap={2}> {/* cards position */}
        {recipes.length > 0 && recipes.map((recipe, index) => ( // loop through an array of objects that was returned by db.ts, recipe will be each object
          <Card 
            key={index}
            sx={{ 
              border: "1px solid #000", 
              borderRadius: 2,
              width: 400
            }} 
          >
            <CardContent>
              {/* recipe name */}
              <Typography variant="h6">{recipe.name}</Typography>

              {/* description */}
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: "0.875rem",  // size for the words
                  color: "gray"          // color for the words
                }}
              >
                {recipe.description}
              </Typography>

              {/* ingredients */}
              <List>
                <ListItemText primary={<span style={{ fontWeight: "bold" }}>Ingredients:</span>} />
                {recipe.ingredients.map((ingredient: string, j: number) => (
                  <BulletListItem key={j}>
                    <ListItemText primary={ingredient} />
                  </BulletListItem>
                ))}
              </List>
              
              {/* instructions */}
              <List>
                <ListItemText primary={<span style={{ fontWeight: "bold" }}>Instructions:</span>} />
                {recipe.instructions.map((instruction: string, j: number) => (
                  <BulletListItem key={j}>
                    <ListItemText primary={instruction} />
                  </BulletListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}


