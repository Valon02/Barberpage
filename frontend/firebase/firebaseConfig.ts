

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDIpVhHteXFUug8DOnLobg5jOsSyISwLLQ",
  authDomain: "barbershop-booking-44252.firebaseapp.com",
  projectId: "barbershop-booking-44252",
  storageBucket: "barbershop-booking-44252.firebasestorage.app",
  messagingSenderId: "1029279878018",
  appId: "1:1029279878018:web:f4dc30a5148f1c201fdd9b"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
