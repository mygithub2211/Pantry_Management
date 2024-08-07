// Home.tsx
"use client"
import React, { useState, useEffect, KeyboardEvent } from "react";
import { firestore } from "@/firebase";
import { DocumentData } from "firebase/firestore";
import { Box, Button, Stack, TextField, Typography, Paper, Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { RecipeSearch } from "./RecipeSearch";
//import { generateImages } from "./server/db";
import { POST } from "./server/db";
// USE THIS
// Define types for inventory items
interface InventoryItem {
  name: string;
  picture: string;
  quantity: number;
}

export default function Home() {
  // Define types for state variables
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [itemName, setItemName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [showRecipeSearch, setShowRecipeSearch] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isHomePage, setIsHomePage] = useState<boolean>(true); // State to toggle between home page and main page

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList: InventoryItem[] = [];

    docs.forEach((doc) => {
      const data = doc.data() as DocumentData;
      inventoryList.push({
        name: doc.id,
        picture: data.picture,
        quantity: data.quantity || 0 // Default to 0 if quantity is not defined
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item: string) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    let quantityToAdd = 1; // Default to 1 if amount is not a valid number

    // Check if amount is a valid number
    if (!isNaN(Number(amount)) && Number(amount) > 0) {
      quantityToAdd = Number(amount);
    }

    if (docSnap.exists()) {
      const data = docSnap.data() as { quantity: number, picture: string };
      await setDoc(docRef, { quantity: data.quantity + quantityToAdd, picture: data.picture }); // quantity: and picture: are the name for fields in a document
    } else {
      const img = await POST(item);
      await setDoc(docRef, { quantity: quantityToAdd, picture: img });
    }
    await updateInventory();
  };

  const removeItem = async (item: string) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as { quantity: number, picture: string };
      if (data.quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: data.quantity - 1, picture: data.picture });
      }
    }
    await updateInventory();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (itemName.trim() && amount.trim()) {
        addItem(itemName);
        setItemName("");
        setAmount("");
      }
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

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
      {isHomePage ? (
        // Home Page Content
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="h2" mb={4}>Welcome to Pantry Tracker</Typography>
          <Button variant="contained" size="large" onClick={() => setIsHomePage(false)}>Get Started</Button>
        </Box>
      ) : (
        <>
          {/* SIDE MENU */}
          <Button sx={{ position: "absolute", left: 0, top: 0, margin: 1 }} onClick={() => setDrawerOpen(true)}><MenuIcon /></Button>
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Box sx={{ width: "250px" }} role="presentation" onClick={() => setDrawerOpen(false)} onKeyDown={() => setDrawerOpen(false)}>
              <List>
                <ListItem>
                  <ListItemText primary="Home" onClick={() => setIsHomePage(true)} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Logout" onClick={() => setIsHomePage(true)}/>
                </ListItem>
              </List>
            </Box>
          </Drawer>

          {/* MAIN */}
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="80%">
            <Typography variant="h2">
              Pantry Tracker
            </Typography>
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
                <TextField
                  variant="outlined"
                  value={itemName}
                  placeholder="Enter item name..."
                  onKeyDown={handleKeyPress}
                  onChange={(e) => setItemName(e.target.value)}
                  sx={{ 
                    width: "40%",
                    "& .MuiOutlinedInput-root": {
                      height: "40px"
                    }
                  }} 
                />
                <TextField
                  variant="outlined"
                  value={amount}
                  placeholder="Enter quantity..."
                  onKeyDown={handleKeyPress}
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
                      addItem(itemName);
                      setItemName("");
                      setAmount("");
                    }
                  }}
                >
                  ADD
                </Button>
              </Stack>
            </Box>
          </Box>

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
                  {inventory.map(({ name, picture, quantity }) => (
                    <TableRow key={name} sx={{ borderBottom: "1px solid #000" }}>
                      <TableCell component="th" scope="row">
                        {picture ? (<img src={picture} alt={name} width={50} height={50} style={{ objectFit: "cover" }} />) : ("No Image")}
                      </TableCell>
                      <TableCell align="right">{quantity}</TableCell>
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
  );
}