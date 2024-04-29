import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import Login from "./Login";
import { UserType } from "../interface/interfaces";
import EditableText from "../components/EditableText";
import TagSelector from "../components/TagSelector";
import {
  ACCOUNT_SETTINGS_FIELDS,
  SOCIAL_LINKS_SETTINGS_FIELDS,
} from "../utils/settingsData";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditableQuote from "@/components/EditableQuote";

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
      setTags(doc.data()?.tags || []);
    });

    return () => unsub();
  }, [userId]);

  if (!isLoggedIn || !userData) return <Login context="force" />;

  return (
    <main className="px-20 xl:px-28 py-20 max-w-screen-2xl mx-auto">
      <h1 className="text-3xl xl:text-4xl font-bold">
        This is {userData?.firstName}'s settings
      </h1>
      <p className="text-gray-500 mb-5 text-lg xl:text-xl">
        Manage what people see on your public profile
      </p>
      <Separator />
      <EditableQuote
        databaseContent={userData.quote}
        fieldName="quote"
        userIdParam={userId}
      />
      <Tabs defaultValue="account" className="flex mt-10 h-[500px]">
        <TabsList className="flex-col h-full w-1/4 shrink-0 items-start justify-start mr-20 bg-white">
          <TabsTrigger
            value="account"
            className="text-lg font-semibold py-3 w-full justify-start  data-[state=active]:bg-gray-200"
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="text-lg font-semibold py-3 w-full justify-start  data-[state=active]:bg-gray-200"
          >
            Contact
          </TabsTrigger>
          <TabsTrigger
            value="tags"
            className="text-lg font-semibold py-3 w-full justify-start  data-[state=active]:bg-gray-200"
          >
            Tag
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="grow">
          {ACCOUNT_SETTINGS_FIELDS.map((field) => (
            <div className="mb-5 w-full">
              <h3 className="text-sm xl:text-xl font-semibold">
                {field.displayName}
              </h3>
              <EditableText
                fieldName={field.fieldName}
                databaseContent={
                  userData
                    ? userData[field.fieldName as keyof UserType]
                    : undefined
                }
                userIdParam={userId}
              />
            </div>
          ))}
        </TabsContent>
        <TabsContent value="contact" className="grow">
          {SOCIAL_LINKS_SETTINGS_FIELDS.map((field) => (
            <div className="mb-5 w-full">
              <h3 className="text-sm xl:text-xl font-semibold">
                {field.displayName}
              </h3>
              <EditableText
                fieldName={field.fieldName}
                databaseContent={
                  userData
                    ? userData[field.fieldName as keyof UserType]
                    : undefined
                }
                userIdParam={userId}
              />
            </div>
          ))}
        </TabsContent>
        <TabsContent value="tags" className="grow">
          <TagSelector setTags={setTags} tags={tags} userId={userId} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
