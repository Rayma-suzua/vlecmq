import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDoRa8vf2rjzgRG4nhf46Ps0rfsy7Vkj14",
    authDomain: "vlecmq.firebaseapp.com",
    projectId: "vlecmq",
    storageBucket: "vlecmq.firebasestorage.app",
    messagingSenderId: "730050177884",
    appId: "1:730050177884:web:d4c7c17614b6aa51c96f99",
    measurementId: "G-F0Y4L7PS28"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);