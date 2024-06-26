import { useContext } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { AuthContext } from "@/contexts/authContext";

export default function UserAvatar() {
  const { user } = useContext(AuthContext);
  return (
    <Avatar className="w-full h-full static bg-brand-mutedblue border-2 border-white flex justify-center items-center my-5">
      <AvatarImage
        src={`/avatars/avatar${user?.avatar}.png`}
        alt="user avatar"
        className="w-4/5 h-4/5 object-contain"
      />
      <AvatarFallback className="text-brand-dark">
        {user?.firstName[0]} {user?.lastName[0]}
      </AvatarFallback>
    </Avatar>
  );
}
