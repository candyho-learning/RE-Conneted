import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { Button } from "./ui/button";

export default function ChatWindow(chatClient: any, chatChannel: any) {
  return (
    <Sheet>
      <SheetTrigger>
        <Button>Open Chat Window</Button>
      </SheetTrigger>
      <SheetContent>
        <div className="chat-window">
          <Chat client={chatClient} theme="str-chat__theme-light">
            <Channel channel={chatChannel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </SheetContent>
    </Sheet>
  );
}
