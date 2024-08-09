'use client'
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import { TextField, Autocomplete } from '@mui/material'
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
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center gap-2">
      <div className="relative">
      {open && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-4 border border-gray-400 shadow-lg rounded-lg relative">
            <h2 className="text-lg font-semibold mb-4">Add Item</h2>
            <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
              <button
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded border border-transparent hover:shadow-m hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <button
              onClick={handleClose}
              className="bg-red-500 text-white w-full mt-2 rounded hover:shadow-m hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
      
      <div className='w-full space-x-2 flex flex-row justify-center'>
        <button className='rounded bg-blue-600 px-4 py-2 text-lg text-white hover:shadow-xl hover:bg-blue-700' onClick={() => {
          handleOpen()
        }}>
          <p className='text-[14px]'>Add New Item</p>
        </button>
        <Autocomplete
          sx={{ width: '300px' }}
          id="free-solo-demo"
          freeSolo
          options={inventory.map((option) => option.name)}
          renderInput={(params) => <TextField {...params} label="Search for inventory" />}
          inputValue={inputValue}
          onInputChange={handleInputChange}
        />
      </div>

      <div className="border border-gray-800 w-[350px] md:w-[800px]">
        <div className="w-full h-[100px] bg-[#ADD8E6] flex items-center justify-center">
          <h2 className="text-[#333] text-[24px] md:text-[40px]">
              Inventory Items
          </h2>
        </div>
        <div className="w-full h-[400px] overflow-auto flex flex-col gap-4"> 
          {filteredInventory.map(({name, quantity}) => (
            <div key={name} className="w-full min-h-[150px] flex items-center justify-between bg-[#f0f0f0] p-2">
              <h3 className="text-[#333] text-[25px] md:text-[40px] text-center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </h3>
              <h3 className="text-[#333] text-[25px] md:text-[40px] text-center">
                {quantity}
              </h3>
              <div className='flex flex-row gap-2'>
                  <button className='bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400' onClick={() => {
                    addItem(name)
                  }}>
                    Add
                  </button>
                  <button className='bg-red-600 text-white py-2 px-4 rounded shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400' onClick={() => {
                    removeItem(name)
                  }}>
                    Remove
                  </button>
              </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  )
}
