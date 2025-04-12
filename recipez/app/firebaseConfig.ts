// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYhaFWcf3r_4TS4UJSpVPXyAUrA08WpkQ",
  authDomain: "recipez-8f202.firebaseapp.com",
  projectId: "recipez-8f202",
  storageBucket: "recipez-8f202.firebasestorage.app",
  messagingSenderId: "173668052895",
  appId: "1:173668052895:web:4215d2f4c93a90184117aa",
  measurementId: "G-SPR6V3977Y",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Export initialized services
export { app, db, storage };
