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

// The addItem function is used to add a new item to the database.
// 
// Parameters:
// - e: The event object representing the form submission event.
// 
// Returns: None
const addItem = async (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Check if the new item has a non-empty name and quantity
  if (newItem.name !== '' && newItem.quantity !== '') {

    // Trim any leading or trailing whitespace from the item name
    const trimmedName = newItem.name.trim();

    // Add a new document to the 'items' collection in the Firestore database
    await addDoc(collection(db, 'items'), {
      name: trimmedName, // Use the trimmed item name
      quantity: newItem.quantity, // Use the original item quantity
    });

    // Reset the newItem state to empty strings for name and quantity
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

    // Function to calculate the total quantity of all items
    // This function takes an array of items and sums up the quantity of each item
    // The quantity of each item is converted to a number using parseFloat()
    // The initial value of the sum is set to 0 using the second argument of reduce()
    const calculateTotal = () => {

      // Use the reduce() method to iterate over each item in the itemsArr array
      // The sum variable keeps track of the total quantity
      // The second argument of reduce() sets the initial value of sum to 0
      const totalQuantity = itemsArr.reduce(

        // The reduce() method calls this callback function for each item in the array
        // The first argument of the callback function is the sum variable
        // The second argument of the callback function is the current item being processed
        (sum, item) => {

          // Add the quantity of the current item to the sum
          // The quantity of each item is converted to a number using parseFloat()
          const quantityAsNumber = parseFloat(item.quantity);
          const updatedSum = sum + quantityAsNumber;

          // Return the updated sum for the next iteration
          return updatedSum;
        },

        // The initial value of the sum is set to 0 using the second argument of reduce()
        0
      );

      // Set the total state to the calculated total quantity
      setTotal(totalQuantity);
    };
    calculateTotal();
    return () => unsubscribe();
  });
}, [sortOption, sortOrder]); // Re-run effect when sortOption or sortOrder changes[]);

  // The deleteItem function is used to delete an item from the database.
  // 
  // Parameters:
  // - id: The ID of the item to be deleted.
  // 
  // This function first shows a confirmation dialog to the user, asking if they
  // are sure they want to delete the item. If the user confirms the deletion,
  // the function proceeds with deleting the item from the database.
  // 
  // The function begins by using the window.confirm() method to display a
  // confirmation dialog to the user. The dialog asks if the user is sure they
  // want to delete the item. The user's response is assigned to the confirmed
  // variable.
  // 
  // If the user confirms the deletion (i.e., confirmed is true), the function
  // proceeds to delete the item from the database. To do this, the function
  // uses the deleteDoc() method from the Firebase Firestore library. This method
  // takes the document reference for the item to be deleted as its argument.
  // The document reference is obtained by calling the doc() method with the
  // Firebase Firestore database reference and the item ID as arguments.
  const deleteItem = async (id) => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    
    if (confirmed) {
      // Proceed with deletion if confirmed
      // Get the document reference for the item to be deleted
      const itemRef = doc(db, 'items', id);
      
      // Delete the item from the database
      await deleteDoc(itemRef);
    }
  };


/**
 * Toggle Sort Order function
 * 
 * This function is responsible for toggling the sort order of the items.
 * It updates the sortOrder state variable by either changing it to 'desc'
 * if the current sortOrder is 'asc', or changing it to 'asc' if the
 * current sortOrder is 'desc'.
 * 
 * @return {void} This function does not return anything.
 */
const toggleSortOrder = () => {
  // Update the sortOrder state variable using the setSortOrder function
  // The setSortOrder function takes a function as an argument, which receives
  // the previous value of sortOrder as its parameter. The function then returns
  // the new value of sortOrder based on the previous value.
  setSortOrder((prevOrder) => {
    // If the previous sortOrder is 'asc', return 'desc' as the new sortOrder
    if (prevOrder === 'asc') {
      return 'desc';
    }
    // If the previous sortOrder is 'desc', return 'asc' as the new sortOrder
    else {
      return 'asc';
    }
  });
};

/**
 * updateQuantity function
 * 
 * This function updates the quantity of an item in the database.
 * It takes two parameters:
 * - id: the ID of the item to update
 * - newQuantity: the new quantity to set for the item
 * 
 * The function performs the following steps:
 * 1. It converts the newQuantity to a number and rounds it to 2 decimal places.
 * 2. It checks if the newQuantity is a valid number. If it is not a valid number,
 *    it logs an error message to the console and returns.
 * 3. It prevents the quantity from going below 0 by setting it to 0 if it is below 0.
 * 4. It sets a maximum quantity (e.g., 1000000) by limiting the newQuantity to 1000000
 *    if it is greater than 1000000.
 * 5. It tries to update the quantity of the item in the database using the updateDoc
 *    function from the Firestore SDK. It updates the quantity field of the item with
 *    the newQuantity value.
 * 6. If an error occurs during the update, it logs an error message to the console.
 * 
 * @param {string} id - The ID of the item to update
 * @param {string} newQuantity - The new quantity to set for the item
 * @return {Promise<void>} This function does not return anything.
 */
const updateQuantity = async (id, newQuantity) => {
  // Convert newQuantity to a number and round it to 2 decimal places
  newQuantity = Math.round(parseFloat(newQuantity) * 100) / 100;

  // Check if newQuantity is a valid number
  if (isNaN(newQuantity)) {
    // Log an error message to the console if newQuantity is not a valid number
    console.error("Invalid quantity");
    return;
  }

  // Prevent quantity from going below 0
  if (newQuantity < 0) {
    // Set newQuantity to 0 if it is below 0
    newQuantity = 0;
  }

  // Set a maximum quantity (e.g., 1000000)
  const MAX_QUANTITY = 1000000;
  if (newQuantity > MAX_QUANTITY) {
    // Set newQuantity to 1000000 if it is greater than 1000000
    newQuantity = MAX_QUANTITY;
  }

  try {
    // Get a reference to the item in the database using its ID
    const itemRef = doc(db, 'items', id);

    // Update the quantity field of the item in the database with the newQuantity value
    await updateDoc(itemRef, {
      quantity: newQuantity
    });
  } catch (error) {
    // Log an error message to the console if an error occurs during the update
    console.error("Error updating quantity:", error);
  }
};
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-8xl w-full items-center justify-between font-mono text-sm ">
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
