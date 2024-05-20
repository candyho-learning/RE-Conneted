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
  query,
  where,
  documentId,
} from "firebase/firestore";

import {
  UserSessionDataType,
  GoalsType,
  SessionDataType,
  UserActivityType,
  UserType,
} from "../interface/interfaces";
import { toast } from "@/components/ui/use-toast";

//TODO check error handling for each function

export async function createNewSession(sessionData: SessionDataType) {
  const { sessionId } = sessionData;
  try {
    await setDoc(doc(db, "sessions", sessionId), {
      ...sessionData,
      createdTimestamp: serverTimestamp(),
    });
    toast({
      title: "Session created successfully!",
      description:
        "Redirecting you to your dashboard. Copy the session code to share with friends!",
    });
  } catch (err) {
    console.error(err);
  }
}

export async function addUserSession(
  userId: string,
  userSessionData: UserSessionDataType
) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      sessions: arrayUnion(userSessionData),
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
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
      return docSnap.data();
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function searchUnsplash(searchTerm: string, page: number = 1) {
  const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;
  const URL = `https://api.unsplash.com/search/photos?query=${searchTerm}&client_id=${UNSPLASH_API_KEY}&orientation=landscape&per_page=10&page=${page}`;
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
    return { success: false, error: err };
  }
}

export const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const timeOptions = {
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
};

export function hyphenatedToReadable(hyphenatedString: string) {
  return hyphenatedString
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function sortSessions(arr: Array<SessionDataType>) {
  return arr.sort((a, b) => {
    const dateA = a.startTime?.toDate(); // Convert Firestore timestamp to JavaScript Date object
    const dateB = b.startTime?.toDate(); // Convert Firestore timestamp to JavaScript Date object
    const diffA = Math.abs(dateA.getTime() - Date.now()); // Calculate difference in milliseconds
    const diffB = Math.abs(dateB.getTime() - Date.now()); // Calculate difference in milliseconds
    return diffA - diffB; // Sort by closest start time first
  });
}

export function hidePastSessions(arr: Array<SessionDataType>) {
  return arr.filter((session) => {
    const timestamp = session.startTime.toDate(); // Convert Firestore timestamp to JavaScript Date object
    return timestamp > new Date(); // Compare with current time
  });
}

export function getDaysFromNow(date: any) {
  const now = new Date();
  const start = date.toDate();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTargetDate = new Date(start);
  startOfTargetDate.setHours(0, 0, 0, 0);

  const diffTime = startOfTargetDate.getTime() - startOfToday.getTime();

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "today";
  } else if (diffDays === 1) {
    return "tomorrow";
  } else if (diffDays > 1) {
    return `${diffDays} days from now`;
  } else {
    // diffDays is negative
    return "expired";
  }
}

export async function getMultipleSessionDetails(sessionIdArr: Array<string>) {
  try {
    const q = query(
      collection(db, "sessions"),
      where(documentId(), "in", sessionIdArr)
    );
    const sessionsDocsSnap = await getDocs(q);
    let data: Array<SessionDataType> = [];
    sessionsDocsSnap.forEach((doc) => {
      data.push(doc.data() as SessionDataType);
    });
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function markSessionAsExpired(sessionId: string) {
  const docRef = doc(db, "sessions", sessionId);
  try {
    await updateDoc(docRef, {
      ended: true,
    });
    toast({
      title: "The host has ended this session.",
      description:
        "Redirecting you to your dashboard. Copy the session code to share with friends!",
    });
  } catch (err) {
    console.error("failed to mark session as ended");
  }
}
