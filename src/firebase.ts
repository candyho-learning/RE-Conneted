import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsO8qFbbOTOKbM5JyhxTxD-sffWDD_GdM",
  authDomain: "reconnected-coworking.firebaseapp.com",
  projectId: "reconnected-coworking",
  storageBucket: "reconnected-coworking.appspot.com",
  messagingSenderId: "386511901310",
  appId: "1:386511901310:web:b29162b0376ea5d367fe2f",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
