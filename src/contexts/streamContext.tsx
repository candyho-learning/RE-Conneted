import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./authContext";
import { StreamVideoClient } from "@stream-io/video-react-sdk";

import { getStreamUserToken } from "@/utils/utils";
import { StreamChat } from "stream-chat";

const apiKey: string = import.meta.env.VITE_STREAM_API_KEY;

interface StreamContextType {
  videoClient: StreamVideoClient | undefined;
  chatClient: StreamChat | undefined; // Adjust the type of chatClient as per your requirements
}

const defaultStreamContext: StreamContextType = {
  videoClient: undefined,
  chatClient: undefined,
};

export const StreamContext = createContext(defaultStreamContext);

interface StreamContextProviderProps {
  children: ReactNode;
}

export const StreamContextProvider = ({
  children,
}: StreamContextProviderProps) => {
  const { user, userId } = useContext(AuthContext);
  const [videoClient, setVideoClient] = useState<
    StreamVideoClient | undefined
  >();
  const [chatClient, setChatClient] = useState<StreamChat | undefined>();
  //do something with the states

  //Connect with video and chat client once when the app loads

  useEffect(() => {
    console.log("stream useEffect triggered");
    if (!userId || !user) return;
    const streamUser = {
      id: userId,
      name: user?.firstName,
      image: `/avatars/avatar${user?.avatar}.png`,
    };
    let videoClient: StreamVideoClient | undefined = undefined;
    let chatClient: StreamChat | undefined = undefined;
    async function setupClients() {
      console.log("setting up video and chat client");
      const userToken = await getStreamUserToken(userId);

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds

      videoClient = new StreamVideoClient({
        apiKey,
        user: streamUser,
        token: userToken,
      });
      setVideoClient(videoClient);
      chatClient = new StreamChat(apiKey);
      //or const client = StreamChat.getInstance(apiKey);
      await chatClient.connectUser(streamUser, userToken);
      setChatClient(chatClient);
    }

    if (userId && user) setupClients();

    return () => {
      setVideoClient(undefined);
      setChatClient(undefined);
      console.log("disconnecting client in stream context");
      (async () => {
        await videoClient?.disconnectUser();
        await chatClient?.disconnectUser();
      })();
    };
  }, [userId, user]);

  //TODO update user when user or userId changes

  return (
    <StreamContext.Provider
      value={{
        videoClient,
        chatClient,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};
