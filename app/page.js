'use client';
import React,{ useState, useEffect} from "react";
import { collection, addDoc, getDoc, QuerySnapshot, query, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore"; 
import { db } from "./firebase";

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });
  const [total, setTotal] = useState(0);
  const [sortOption, setSortOption] = useState(''); // 'name' or 'quantity'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

// Add item to database
const addItem = async (e) => {
  e.preventDefault();
  if (newItem.name !== '' && newItem.quantity !== '') {
      // setItems([...items, newItem]);
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        quantity: newItem.quantity,
      });
      setNewItem({ name: '', quantity: '' });
  }
}
// Read item from database
useEffect(() => {
  const q = query(collection(db, 'items'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    let itemsArr = [];

    querySnapshot.forEach((doc) => {
      itemsArr.push({ ...doc.data(), id: doc.id });
    });

    // Apply sorting based on sortOption and sortOrder
    itemsArr.sort((a, b) => {
      if (sortOption === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortOption === 'quantity') {
        return sortOrder === 'asc' ? parseFloat(a.quantity) - parseFloat(b.quantity) : parseFloat(b.quantity) - parseFloat(a.quantity);
      }
      return 0;
    });

    setItems(itemsArr);

    // Read total from itemsArr
    const calculateTotal = () => {
      const totalQuantity = itemsArr.reduce(
        (sum, item) => sum + parseFloat(item.quantity),
        0
      );
      setTotal(totalQuantity);
    };
    calculateTotal();
    return () => unsubscribe();
  });
}, [sortOption, sortOrder]); // Re-run effect when sortOption or sortOrder changes[]);

  // Delete items from database
  const deleteItem = async (id) => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    
    if (confirmed) {
      // Proceed with deletion if confirmed
      await deleteDoc(doc(db, 'items', id));
    }
  };
// Toggle sort order
const toggleSortOrder = () => {
  setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
};

// Update the quantity of an item
const updateQuantity = async (id, newQuantity) => {
  // Convert newQuantity to a number and round it to 2 decimal places
  newQuantity = Math.round(parseFloat(newQuantity) * 100) / 100;

  // Check if newQuantity is a valid number
  if (isNaN(newQuantity)) {
    console.error("Invalid quantity");
    return;
  }

  // Prevent quantity from going below 0
  if (newQuantity < 0) {
    newQuantity = 0;
  }

  // Set a maximum quantity (e.g., 1000000)
  const MAX_QUANTITY = 1000000;
  if (newQuantity > MAX_QUANTITY) {
    newQuantity = MAX_QUANTITY;
  }

  try {
    const itemRef = doc(db, 'items', id);
    await updateDoc(itemRef, {
      quantity: newQuantity
    });
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
};
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm ">
          <h1 className='text-4xl p-4 text-center'>Pantry Tracker</h1>
          <div className="bg-slate-900 p-10 rounded-lg">
            <form className="grid grid-cols-6 items-center text-black">
              <input 
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="col-span-3 p-3 border"
                type='text'
                placeholder="Item"             
              />
              <input 
                value = {newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                className="col-span-2 p-3 border mx-3"
                type='number'
                placeholder="Quantity"             
              />
              <button
                onClick={addItem} 
                className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"  
                type = "submit"
              >
                +
              </button>
            </form>


            <div className="grid grid-cols-6 items-center text-black my-4 w-full flex justify-between">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="col-span-3 p-2 border"
              >
                <option value="" disabled>Sort By</option>  
                <option value="name">Item</option>
                <option value="quantity">Quantity</option>
              </select>
              <button
                onClick={toggleSortOrder}
                className="text-white bg-slate-950 hover:bg-slate-900 p-2 text-xl mx-3"
              >
                {sortOrder === 'asc' ? (
                  <span>↑</span>
                ) : (
                  <span>↓</span>
                )}
              </button>
            </div>

            <ul>
              {items.map((item, id) => (
                <li
                  key={id}
                  className='my-4 w-full flex justify-between bg-slate-950'
                >
                  <div className='p-4 w-full flex justify-between'>
                    <span className='capitalize'>{item.name}</span>
                    <span>{item.quantity}</span>
                  </div>
                  <div className='flex'>
                    <button
                      onClick={() => updateQuantity(item.id, parseFloat(item.quantity) - 1)}
                      className='px-5 py-2 border-l border-slate-900 hover:bg-slate-900 flex items-center justify-center text-xl'
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, parseFloat(item.quantity) + 1)}
                      className='px-5 py-2 border-l border-slate-900 hover:bg-slate-900 flex items-center justify-center text-xl'
                    >
                      +
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className='px-5 py-2 border-l border-slate-900 hover:bg-slate-900 flex items-center justify-center text-xl'
                    >
                      x
                    </button>
                  </div>
                </li>
              ))}
            </ul>
                {items.length < 1 ? ('') : (
                  <div className='flex justify-between p-3'>
                    <span>Total</span>
                    <span>{total}</span>
                  </div>
                )} 
          </div>
        </div>
        <footer className="text-white text-center text-1xl p-1 ml-2">
              <p>&copy; {new Date().getFullYear()} Prateek Chand. All rights reserved.</p>
        </footer>
      </main>
  );
}
