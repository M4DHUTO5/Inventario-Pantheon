
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCo14uJEksC2yS2hGuk6tXeLqDt5sdHPVw",
  authDomain: "inventario-pantheon.firebaseapp.com",
  databaseURL: "https://inventario-pantheon-default-rtdb.firebaseio.com",
  projectId: "inventario-pantheon",
  storageBucket: "inventario-pantheon.firebasestorage.app",
  messagingSenderId: "399196337035",
  appId: "1:399196337035:web:d816bb5f34873fd205f58e",
  measurementId: "G-1RFM7J2SGS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



export { db };