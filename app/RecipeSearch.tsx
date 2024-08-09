"use client"
import React, { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { Card, CardContent, List, ListItem, ListItemText, styled } from "@mui/material"
import { generateRecipes } from "./server/db"

// Styled ListItem with custom spacing
const BulletListItem = styled(ListItem)(({ theme }) => ({
  padding: '4px 0', // Adjust vertical padding
  margin: 0,
  '&::before': {
    content: '"•"',
    color: theme.palette.text.primary,
    fontSize: '1.2rem',
    marginRight: theme.spacing(1),
  }
}))

function RecipeSearch() {
  const [prompt, setPrompt] = useState<string>("")
  const [recipes, setRecipes] = useState<any[]>([])

  async function handleSearch() {
    console.log("Searching for:", prompt)
    let r = await generateRecipes(prompt)
    setRecipes(r)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
     handleSearch()
    }
  }

  return (
    <Box 
      width="100vw" 
      height="100vh"
      padding={2} 
      display="flex" 
      flexDirection="column" 
      alignItems="center"
      >
      <TextField
        variant="outlined"
        value={prompt}
        placeholder="Enter recipe name..."
        onKeyDown={handleKeyPress}
        onChange={(e) => setPrompt(e.target.value)}
        sx={{ 
          width: "60%",
          marginBottom: 2
        }}
      />
      <Button type="submit" variant="contained" onClick={handleSearch}>Search</Button>
      <Box display="flex" flexDirection="row" flexWrap="wrap" marginTop={3} gap={2}>
        {/* LOOP THROUGH AN ARRAY OF OBJECTS, EACH OBJECT IS A RECIPE */}
        {recipes.length > 0 && recipes.map((recipe, i) => (
          <Card 
            key={i}
            sx={{ 
              border: "1px solid #000", 
              borderRadius: 2,
              width: 400
            }}
          >
            <CardContent>
              {/* RECIPE NAME */}
              <Typography variant="h6">{recipe.name}</Typography>
              {/* DESCRIPTION */}
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.875rem',  // Adjust the size as needed (e.g., "small", "medium", "large", etc.)
                  color: 'gray'          // You can use a specific color code or name
                }}
              >
                {recipe.description}
              </Typography>
              {/* INGREDIENTS */}
              <List>
                <ListItemText primary={<span style={{ fontWeight: 'bold' }}>Ingredients:</span>} />
                {recipe.ingredients.map((ingredient: string, j: number) => (
                  <BulletListItem key={j}>
                    <ListItemText primary={ingredient} />
                  </BulletListItem>
                ))}
                {/* INSTRUCTIONS */}
                <ListItemText primary={<span style={{ fontWeight: 'bold' }}>Instructions:</span>} />
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

export { RecipeSearch }
