// Home.tsx
"use client" // enables client-side function

// Import React hooks and Firebase Firestore utilities
import { useState, useEffect } from "react"
import { firestore } from "@/firebase" 
import { DocumentData } from "firebase/firestore" 
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore"

// Import Material UI components and icons for UI
import { Box, Button, Stack, TextField, Typography, Paper, Drawer, List, ListItem, ListItemText, Divider } from "@mui/material"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"

// Import custom components and functions
import { RecipeSearch } from "./RecipeSearch" // used to generate recipes
import { generateImages } from "./server/db" // used to generate image for each item


// define types for inventory items
interface InventoryItem {
  name: string
  picture: string
  quantity: number
}

export const maxDuration = 60 // configuration for server-side runtime limit
 
export default function Home() {
  // React state hooks for UI control and inventory data
  // InventoryItem[] is the type of the state means inventory is an array of InventoryItem objects
  // [] is an intial value, meaning the inventory starts out as an empty array
  const [inventory, setInventory] = useState<InventoryItem[]>([]) // stores inventory array (array of objects)
  const [itemName, setItemName] = useState<string>("") // input field for item name
  const [amount, setAmount] = useState<string>("") // input field for item quantity
  const [showRecipeSearch, setShowRecipeSearch] = useState<boolean>(false) // toggle recipe search UI
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false) // toggle for side menu drawer
  const [isWelcomePage, setIsWelcomePage] = useState<boolean>(true) // toggle between welcome and home page

  // update inventory array
  const updateInventory = async () => {
    const docRef = query(collection(firestore, "inventories")) // query to access "inventories" collection in Firestore database
    const allDocuments = await getDocs(docRef) // fetch ALL documents from "inventories" collection
    const inventoryList: InventoryItem[] = [] // inventoryList array to store documents (array of objects)

    // loop through each document
    allDocuments.forEach((eachDocument) => {
      const data = eachDocument.data() as DocumentData // retrieve document data
      inventoryList.push({ // add document to inventoryList array  
        name: eachDocument.id, // eachDocument.id is the field in database
        picture: data.picture, // data.picture is the field in database
        quantity: data.quantity || 0 // default to 0 if quantity is not defined
      })
    })
    setInventory(inventoryList)
  }

  // add new item to "inventories" collection or update existing item
  const addItem = async (item: string) => {
    const docRef = doc(collection(firestore, "inventories"), item) // get the document reference
    const document = await getDoc(docRef) // fetch the document "item" from "inventories" collection
    let quantityToAdd = 1

    // check if amount is a valid number
    if (!isNaN(Number(amount)) && Number(amount) > 0) {
      quantityToAdd = Number(amount)
    }

    if (document.exists()) { // if item already exists
      const data = document.data() as DocumentData // retrieve document data
      await setDoc(docRef, { quantity: data.quantity + quantityToAdd, picture: data.picture }) // quantity: and picture: are the name for fields in a document in the database
    } 
    else { // new item
      const img = await generateImages(item) // get the image 
      await setDoc(docRef, { quantity: quantityToAdd, picture: img }) // set quantity and image for our new item
    }
    await updateInventory() // update inventory array
  }

  // remove item from the "inventories" collection
  const removeItem = async (item: string) => {
    const docRef = doc(collection(firestore, "inventories"), item) // get the document reference
    const document = await getDoc(docRef) // fetch the document "item" from "inventories" collection

    if (document.exists()) { // if item exists
      const data = document.data() as { quantity: number, picture: string } // retrieve document data
      if (data.quantity === 1) {
        await deleteDoc(docRef) // delete the item if quantity is only 1
      } 
      else {
        await setDoc(docRef, { quantity: data.quantity - 1, picture: data.picture }) // delete amount of 1 at a tim
      }
    }
    await updateInventory() // update inventory array
  }

  // handle key press "Enter"
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (itemName.trim() && amount.trim()) {
        addItem(itemName)
        setItemName("") // reset field item name to empty
        setAmount("") // reset field amount to empty
      }
    }
  }

  // load data from inventory array
  useEffect(() => {
    updateInventory()
  }, [])

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      gap={2}
      display="flex" 
      justifyContent="flex-start" 
      alignItems="center"
      flexDirection="column"
      padding={2}
      sx={{ 
        background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
        overflow: "auto"
      }}
    >
      {isWelcomePage ? (
        // welcome page
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="h2" mb={4}>Welcome to Pantry Tracker</Typography>
          <Button variant="contained" size="large" onClick={() => setIsWelcomePage(false)}>Get Started</Button>
        </Box>
      ) : ( 
        <>
          {/* side menu
              click on the hamburger icon (onClick), setDrawerOpen will set drawerOpen to true which will open the menu
              if we click outside the menu (onClose), or ESC key, setDrawerOpen will set drawerOpen to false which will close the menu window
          */}
          <Button sx={{ position: "absolute", left: 0, top: 0, margin: 1 }} onClick={() => setDrawerOpen(true)}><MenuIcon /></Button>
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            {/* if we click on either Home or Logout  
                (onClick <Box>), setDrawerOpen will set drawerOpen to false which will close the menu
                (onClick Home, Logout), setIsWelcomePage will set IsWelcomePage to true which will open the Welcome Page
            */}
            <Box sx={{ width: "250px" }} role="presentation" onClick={() => setDrawerOpen(false)} >
              <List>
                <ListItem>
                  <ListItemText primary="Home" onClick={() => setIsWelcomePage(true)} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Logout" onClick={() => setIsWelcomePage(true)}/>
                </ListItem>
              </List>
            </Box>
          </Drawer>

          {/* top */}
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="80%">
            {/* title */}
            <Typography variant="h2"> Pantry Tracker </Typography>
            {/* where user will enter item name and amount  */}
            <Box
              width="80%"
              border="1px solid #000"
              borderRadius={2}
              boxShadow={15}
              p={2}
              display="flex"
              flexDirection="column"
              gap={2}
              mt={4}
            >
              <Typography variant="h6">Add Item</Typography>
              <Stack 
                width="100%" 
                height={20} 
                spacing={3}
                direction="row" 
                alignItems="center"
                marginBottom={2}
              >
                {/* enter item name - whatever entered in the TextField will become string */}
                <TextField
                  variant="outlined"
                  value={itemName}
                  placeholder="Enter item name..."
                  onKeyDown={handleKeyPress} // responsible for Enter key
                  onChange={(e) => setItemName(e.target.value)}
                  sx={{ 
                    width: "40%",
                    "& .MuiOutlinedInput-root": {
                      height: "40px"
                    }
                  }} 
                />
                {/* enter amount - whatever entered in the TextField will become string */}
                <TextField
                  variant="outlined"
                  value={amount}
                  placeholder="Enter quantity..."
                  onKeyDown={handleKeyPress} // responsible for Enter key
                  onChange={(e) => setAmount(e.target.value)}
                  sx={{ 
                    width: "40%",
                    "& .MuiOutlinedInput-root": {
                      height: "40px"
                    }
                  }} 
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (itemName.trim() && amount.trim()) {
                      addItem(itemName)
                      setItemName("") // reset field item name to empty
                      setAmount("") // reset field amount to empty
                    }
                  }}
                >
                  ADD
                </Button>
              </Stack>
            </Box>
          </Box>
          
          {/* the table where items are displayed */}
          <Box width="80%" border="1px solid #000" borderRadius={2} boxShadow={15} mt={3}>
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {inventory.map(({name, picture, quantity}) => (
                    <TableRow key={name} sx={{ borderBottom: "1px solid #000" }}>
                      {/* picture and quantity */}
                      <TableCell component="th" scope="row">
                        {picture ? (<img src={picture} alt={name} width={50} height={50} style={{ objectFit: "cover" }} />) : ("No Image")}
                      </TableCell>
                      <TableCell align="right">{quantity}</TableCell>

                      {/* add and remove buttons */}
                      <TableCell align="right">
                        <Stack direction="row" spacing={2} display="flex" justifyContent="flex-end">
                          <Button variant="contained" onClick={() => addItem(name)}>
                            Add
                          </Button>
                          <Button variant="contained" onClick={() => removeItem(name)}>
                            Remove
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Button variant="contained" onClick={() => setShowRecipeSearch(!showRecipeSearch)}>
            Looking For a Recipe?
          </Button>
          {showRecipeSearch && <RecipeSearch />}
        </>
      )}
    </Box>
  )
}