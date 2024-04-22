import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import Login from "./Login";
import { UserType } from "../interface/interfaces";
import EditableText from "../components/EditableText";
import TagSelector from "../components/TagSelector";
import { SETTINGS_FIELDS } from "../utils/settingsData";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function Settings() {
  //TODO get userId from authcontext
  const { isLoggedIn, userId } = useContext(AuthContext);
  const [userData, setUserData] = useState<UserType>();
  const [tags, setTags] = useState(userData?.tags || []);
  //TODO read data from database
  useEffect(() => {
    if (!userId) return;
    const unsub = onSnapshot(doc(db, "users", userId), (doc) => {
      console.log("change in user settings!");
      setUserData(doc.data() as UserType);
      setTags(doc.data()?.tags);
    });

    return () => unsub();
  }, [userId]);

  if (!isLoggedIn || !userData) return <Login context="force" />;

  return (
    <div>
      settings page placeholder text
      <h1>This is {userData?.firstName}'s settings</h1>
      {SETTINGS_FIELDS.map((field) => (
        <>
          <h3>{field.displayName}</h3>
          <EditableText
            fieldName={field.fieldName}
            databaseContent={
              userData ? userData[field.fieldName as keyof UserType] : undefined
            }
            userIdParam={userId}
          />
        </>
      ))}
      {tags && <TagSelector setTags={setTags} tags={tags} userId={userId} />}
    </div>
  );
}
