// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCGPvn231zOCITbVc3dga1VxEndeeqegLw",
    authDomain: "pantry-app-c5684.firebaseapp.com",
    projectId: "pantry-app-c5684",
    storageBucket: "pantry-app-c5684.appspot.com",
    messagingSenderId: "784132953221",
    appId: "1:784132953221:web:a7f53a8e1fcd73472805ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db =getFirestore(app);


