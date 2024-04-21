import { db } from "../firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";

import {
  FutureSessionDataType,
  GoalsType,
  SessionDataType,
  UserActivityType,
  UserType,
} from "../interface/interfaces";

//TODO check error handling for each function

export async function createNewSession(sessionData: SessionDataType) {
  const { sessionId } = sessionData;
  try {
    await setDoc(doc(db, "sessions", sessionId), {
      ...sessionData,
      createdTimestamp: serverTimestamp(),
    });
    alert("Session created successfully!");
  } catch (err) {
    console.error(err);
  }
}

export async function addFutureSession(
  futureSessionData: FutureSessionDataType
) {
  const { userId } = futureSessionData;
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    futureSessions: arrayUnion(futureSessionData),
  });
  console.log("added to future sessions");
}

export async function getCollection(collectionName: string) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const data: Array<UserType> = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data.push(doc.data() as UserType);
  });
  return data;
}

export async function getStreamUserToken(userId: string): Promise<string> {
  try {
    console.log(
      `making a request to https://stream-token-api-server.onrender.com/token/${userId}`
    );
    const response = await fetch(
      `https://stream-token-api-server.onrender.com/token/${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }
    const token = await response.text();
    console.log("token fetched and returned!");
    return token;
  } catch (err) {
    console.error(err);
    throw new Error("Unable to retrieve token");
  }
}

export async function getSessionData(sessionId: string) {
  const docRef = doc(db, "sessions", sessionId);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      throw new Error(
        "Cannot get session data because document does not exist."
      );
    }
  } catch (err) {
    console.error(err);
  }
}

export async function searchUnsplash(searchTerm: string) {
  const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;
  const URL = `https://api.unsplash.com/search/photos?query=${searchTerm}&client_id=${UNSPLASH_API_KEY}&orientation=landscape&per_page=9`;
  console.log("searching on unsplash");
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error("cannot get search results from Unsplash");
    }
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function updateUserSessionGoal(
  sessionId: string,
  userId: string,
  goalArr: Array<GoalsType>,
  userName: string
) {
  const docRef = doc(db, "sessions", sessionId);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      //find field: participantsActivity
      const participantsActivityCopy =
        docSnap.data()?.participantsActivity || [];

      //find object with userId -> exist vs doesn't exist
      let newUserActivity: UserActivityType;
      let newParticipantsActivityCopy;
      const index = participantsActivityCopy.findIndex(
        (item: UserActivityType) => item.userId === userId
      );
      //replace goals with goalArr

      if (index === -1) {
        newUserActivity = {
          userName,
          userId,
          goals: goalArr,
        };
        newParticipantsActivityCopy = [
          ...participantsActivityCopy,
          newUserActivity,
        ];
      } else {
        newUserActivity = {
          ...participantsActivityCopy[index],
          goals: goalArr,
        };
        newParticipantsActivityCopy = participantsActivityCopy.map(
          (item: UserActivityType) => {
            if (item.userId === userId) {
              return newUserActivity;
            } else {
              return item;
            }
          }
        );
      }

      //update with new data
      await updateDoc(docRef, {
        participantsActivity: newParticipantsActivityCopy,
      });

      console.log("user goals updated on firebase!!");
    } else {
      throw new Error("Session data for this sessionId doesn't exist.");
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getUserData(userId: string) {
  const docRef = doc(db, "users", userId);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      throw new Error("Cannot get user data because document does not exist.");
    }
  } catch (err) {
    console.error(err);
  }
}

export async function updateUserData(
  userId: string,
  fieldName: string,
  data: any
) {
  const docRef = doc(db, "users", userId);
  try {
    await updateDoc(docRef, {
      [fieldName]: data,
    });
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}
