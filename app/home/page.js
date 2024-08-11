'use client'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation';
import { auth, firestore } from '@/firebase'; // Ensure you import Firestore
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { TextField, Autocomplete } from '@mui/material'
import { query, getDocs, collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import axios from 'axios';

export default function Home() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState('')
    const [itemCalories, setItemCalories] = useState([])
    const [inputValue, setInputValue] = useState('') 
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // Router instance for redirection

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push('/'); // Redirect to login if not authenticated
        } else {
          updateInventory(); // Fetch data if user is authenticated
          setLoading(false); // Set loading to false when done
        }
      });
  
      return () => unsubscribe(); // Clean up subscription on unmount
    }, [router]);

    const updateInventory =  async  () => {
      const userId = auth.currentUser?.uid; // Get the current user ID
      if (!userId) return; // Exit if no user is authenticated

      try {
        const snapshot = query(collection(firestore, `users/${userId}/inventory`))
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach((doc)=>{
          inventoryList.push({
            name: doc.id,
            ...doc.data(),
          });
        });
        setInventory(inventoryList)
      } catch(error) {
        console.error('Error updating inventory:', error);
      }
    }

    const addItem = async (item, cals) => {
      const userId = auth.currentUser?.uid; // Get the current user ID
      if (!userId) return; // Exit if no user is authenticated

      try {
        const docRef = doc(collection(firestore, `users/${userId}/inventory`), item)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const quantity = docSnap.data().quantity
            const calories = Number(docSnap.data().calories)
            await setDoc(docRef, {quantity: quantity + 1, calories: calories + Number(cals)})
          } else {
            await setDoc(docRef, {quantity: 1, calories: Number(cals)})
          }
          await updateInventory()
      } catch(error) {
        console.error('Error adding item or updating cals:', error);
      }
    }

    const removeItem = async (item, cals) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      try {
        const docRef = doc(collection(firestore, `users/${userId}/inventory`), item)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const {quantity, calories} = docSnap.data()
          if (quantity === 1) {
            await deleteDoc(docRef) 
          } else {
            await setDoc(docRef, {quantity: quantity - 1, calories: calories - Number(cals)})
          }
        }
        await updateInventory()
      } catch(error) {
        console.error('Error removing item:', error);
      }
    }

    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.push('/'); // Redirect to login page after logout
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

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

    const getAISuggestion = async () => {
      try {
          const response = await axios.post('https://inventory-management-eta-lime.vercel.app/api/get-calories', {
              food: itemName
          });
          setItemCalories(response.data.response || ''); 
      } catch (error) {
          console.error(error.response.data);
      }
    };

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
                placeholder='Food Name'
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-[75%]"
              />
              <style>
                {`
                  input[type="number"]::-webkit-inner-spin-button,
                  input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                  }

                  input[type="number"] {
                    -moz-appearance: textfield;
                  }
                `}
              </style>
              <input
                type="number"
                value={itemCalories}
                onChange={(e) => setItemCalories(e.target.value)}
                placeholder='Calories'
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-[25%]"
                inputMode="numeric"
                min="0"
                step="1"
              />
              <button
                onClick={() => {
                  addItem(itemName, itemCalories);
                  setItemName('');
                  setItemCalories('')
                  handleClose();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded border border-transparent hover:shadow-m hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <p>Don&apos;t know the calories?</p>
            <button
                  onClick={getAISuggestion} 
                  className="bg-green-600 text-white px-2 py-2 rounded border border-transparent hover:shadow-m hover:bg-green-700"
              >
                  Get AI Suggestion
            </button>
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
      
      <div className='flex-col items-center gap-2 w-full space-x-2 flex sm:flex-row justify-center'>
        <button className='h-full rounded bg-blue-600 px-4 py-2 text-lg text-white hover:shadow-xl hover:bg-blue-700' onClick={() => {
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
      
      <div className='absolute top-2 right-2'>
        <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-lg text-white hover:shadow-xl hover:bg-red-700"
          >
            Logout
        </button>
      </div>

      <div className='border border-gray-800 w-[350px] md:w-[800px] rounded-md'>
        <div className='w-full h-[100px] bg-[#a4b5fd] flex items-center justify-center rounded-md'>
          <h2 className='text-[#333] text-[24px] md:text-[40px]'>
              Start tracking your food now!
          </h2>
        </div>
        <div className='w-full h-[400px] overflow-auto flex flex-col gap-4 rounded-md'> 
          {filteredInventory.map(({name, quantity, calories}) => (
            <div key={name} className='w-full min-h-[150px] flex items-center justify-between bg-[#f0f0f0] p-2'>
              <div className='flex flex-col items-start'>
                <h3 className='text-[#333] text-[25px] md:text-[40px]'>
                  {name.charAt(0).toUpperCase() + name.slice(1) + ':'}
                </h3>
                <h3 className='text-[#333] text-[25px] md:text-[40px] text-center w-full'>
                  {quantity}
                </h3>
              </div>
              <div className='text-[#333] text-[25px] md:text-[40px] text-center w-full'>
                {calories + ' cals'}
              </div>
              <div className='flex flex-row gap-2'>
                  <button className='bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400' onClick={() => {
                    addItem(name, calories)
                  }}>
                    Add
                  </button>
                  <button className='bg-red-600 text-white py-2 px-4 rounded shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400' onClick={() => {
                    removeItem(name, calories)
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
