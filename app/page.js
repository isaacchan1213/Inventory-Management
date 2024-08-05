'use client'
import {useState, useEffect, useRef} from 'react'
import {firestore} from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button, Autocomplete } from '@mui/material'
import { query, getDocs, collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState([])
    const [inputValue, setInputValue] = useState('') 

    const updateInventory =  async  () => {
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      const inventoryList = []
      docs.forEach((doc)=>{
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList)
    }

    const addItem = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
          const {quantity} = docSnap.data()
          await setDoc(docRef, {quantity: quantity + 1})
        } else {
          await setDoc(docRef, {quantity: 1})
        }
        await updateInventory()
    }

    const removeItem = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const {quantity} = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef) 
        } else {
          await setDoc(docRef, {quantity: quantity - 1})
        }
      }
      await updateInventory()
    }

    useEffect(() => {
      updateInventory()
    }, [])

    const handleInputChange = (event, newInputValue) => {
      setInputValue(newInputValue);
    };

    const filteredInventory = inventory.filter(item =>
      item.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" left="50%" 
          width={400} bgcolor="white" 
          border="2px solid #999" 
          boxShadow={24} 
          p={4} 
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)" 
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button variant="outlined" onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      
      <Stack width="100%" spacing={2} direction="row" display="flex" justifyContent="center">
        <Button variant="contained" onClick={() => {
          handleOpen()
        }}>
          Add New Item
        </Button>
        <Autocomplete
          sx={{ width: '300px' }}
          id="free-solo-demo"
          freeSolo
          options={inventory.map((option) => option.name)}
          renderInput={(params) => <TextField {...params} label="Search for inventory" />}
          inputValue={inputValue}
          onInputChange={handleInputChange}
        />
      </Stack>

      <Box 
        sx={{
          border:"1px solid #333",
          width: {
              xs: 350,
              md: 800,
          }, 
        }}>
        <Box width="100%" height="100px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
          <Typography 
            sx={{
              variant: "h2",
              color: "#333",
              fontSize: {
                xs: 24,
                md: 40,
              }
          }}>
            Inventory Items
          </Typography>
        </Box>
      <Stack width="100%" height="300px" spacing={2} overflow="auto"> 
        {filteredInventory.map(({name, quantity}) => (
            <Box key={name} width="100%" minHeight="150px" display="flex" alignItems="center" justifyContent="space-between" bgcolor="#f0f0f0" padding={2}>
              <Typography 
                sx={{
                  variant:"h3",
                  color:"#333",
                  textAlign:"center",
                  fontSize: {
                    xs: 25,
                    md: 40,
                  }
                }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography 
                sx={{
                  variant:"h3",
                  color:"#333",
                  textAlign:"center",
                  fontSize: {
                    xs: 25,
                    md: 40,
                  }
                }}>
                  {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => {
                  addItem(name)
                }}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => {
                  removeItem(name)
                }}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
      </Stack>
      </Box>
    </Box>
  )
}
