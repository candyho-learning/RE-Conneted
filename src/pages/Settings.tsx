import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/authContext";
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
import AvatarPicker from "@/components/AvatarPicker";
import Loading from "@/components/Loading";

export default function Settings() {
  //TODO get userId from authcontext
  const { userId, isLoading } = useContext(AuthContext);
  const [userData, setUserData] = useState<UserType>();
  const [tags, setTags] = useState(userData?.tags || []);
  //TODO read data from database
  useEffect(() => {
    if (!userId) return;
    const unsub = onSnapshot(doc(db, "users", userId), (doc) => {
      setUserData(doc.data() as UserType);
      setTags(doc.data()?.tags || []);
    });

    return () => unsub();
  }, [userId]);

  if (isLoading) {
    return <Loading />;
  }

  // if (!isLoggedIn) {
  //   return <Login />;
  // }

  if (userData)
    return (
      <main
        className="px-20 xl:px-60 py-20 max-w-screen mx-auto h-screen"
        // style={{ backgroundImage: `url(${Background})` }}
      >
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
          <TabsList className="flex-col h-full w-1/4 shrink-0 items-start justify-start mr-20 bg-transparent">
            <TabsTrigger
              value="account"
              className="text-lg font-semibold py-3 w-full justify-start  data-[state=active]:bg-gray-300"
            >
              <h4>Account</h4>
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="text-lg font-semibold py-3 w-full justify-start  data-[state=active]:bg-gray-300"
            >
              <h4>Contact</h4>
            </TabsTrigger>
            <TabsTrigger
              value="tags"
              className="text-lg font-semibold py-3 w-full justify-start  data-[state=active]:bg-gray-300"
            >
              <h4>My Tags</h4>
            </TabsTrigger>
            <TabsTrigger
              value="avatar"
              className="text-lg font-semibold py-3 w-full justify-start  data-[state=active]:bg-gray-300"
            >
              <h4>My Avatar</h4>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="grow">
            {ACCOUNT_SETTINGS_FIELDS.map((field) => (
              <div className="mb-5 w-full" key={field.fieldName}>
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
              <div className="mb-5 w-full" key={field.fieldName}>
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
          <TabsContent value="avatar" className="grow">
            <AvatarPicker />
          </TabsContent>
        </Tabs>
      </main>
    );
}
