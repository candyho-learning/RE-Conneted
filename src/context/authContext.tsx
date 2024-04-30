import React, { createContext, ReactNode, useEffect, useState } from "react";
import "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

import { UserType, AuthContextType } from "../interface/interfaces";

const auth = getAuth();

async function getUserProfile(userId: string) {
  const docRef = doc(db, "users", userId);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      throw new Error(
        "Cannot get user profile because document does not exist."
      );
    }
  } catch (err) {
    console.error(err);
  }
}

const defaultAuthContext = {
  isLoggedIn: true,
  createAccount: async (_email: string, _password: string): Promise<void> => {},
  login: async (_email: string, _password: string): Promise<void> => {},
  logout: () => {},
  userId: "",
  isLoading: false,
  user: null,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    console.log("auth useEffect triggered");
    setIsLoading(true);
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(`user ${uid} is signed in`);
        setUserId(uid);
        setIsLoggedIn(true);
        setIsLoading(false);
        // ...
      } else {
        console.log("not logged in");
        setIsLoading(false);
        setUserId("");
        setIsLoggedIn(false);
        localStorage.removeItem("userCredential");
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!userId) return;
    getUserProfile(userId);
    console.log("get user profile ran");
    const unsub = onSnapshot(doc(db, "users", userId), (doc) => {
      console.log("change in user data!");
      console.log("Current data: ", doc.data());
      console.log(typeof doc.data());
      setUser(doc.data() as UserType);
    });
    return () => unsub();
  }, [userId]);

  async function createAccount(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    console.log("create account function in auth context running");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      localStorage.setItem(
        "userCredential",
        JSON.stringify(userCredential.user)
      );
      const uid = userCredential.user.uid;
      if (uid) {
        //add user document
        // Add a new document in collection "cities"
        await setDoc(doc(db, "users", uid), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          userId: uid,
          accountCreatedTimestamp: serverTimestamp(),
          quote: "",
          location: "",
          tags: [],
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function login(email: string, password: string) {
    console.log("auth log in");
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential) {
        setIsLoading(false);
        setIsLoggedIn(true);
        setUserId(userCredential.user.uid);
        localStorage.setItem(
          "userCredential",
          JSON.stringify(userCredential.user)
        );
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  }

  async function logout() {
    console.log("signing out...");
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUserId("");
      setUser(null);
      localStorage.removeItem("userCredential");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        createAccount,
        login,
        logout,
        userId,
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
