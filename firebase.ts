// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcF1-6FdqL9Th6XtRE2wj2BF_PJGrzXLM",
  authDomain: "inventory-management-538eb.firebaseapp.com",
  projectId: "inventory-management-538eb",
  storageBucket: "inventory-management-538eb.appspot.com",
  messagingSenderId: "932033180492",
  appId: "1:932033180492:web:d3b05868d8c68a3c17d5e9",
  measurementId: "G-KHN603GVKX"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

const firestore: Firestore = getFirestore(app);

export { firestore, analytics };