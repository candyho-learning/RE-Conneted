import { AuthContext } from "@/context/authContext";
import { Button } from "./ui/button";
import { useContext, useState } from "react";
import { updateUserData } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";
import UserAvatar from "./UserAvatar";

export default function AvatarPicker() {
  const { user, userId } = useContext(AuthContext);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || null);
  async function confirmAvatarSelection() {
    setIsEditing(false);
    if (selectedAvatar === user?.avatar) return;
    const result = await updateUserData(userId, "avatar", selectedAvatar);
    if (result.success) {
      toast({
        title: "Avatar updated successfully!",
        description: "Great choice, looking good!",
      });
    } else {
      toast({
        variant: "destructive",
        title: "There was a problem saving the avatar.",
        description: "Please try again later.",
      });
    }
  }
  return (
    <div>
      {!isEditing && (
        <>
          <div className="w-32 h-32 my-5">
            <UserAvatar />
          </div>

          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Change Avatar
          </Button>
        </>
      )}

      {isEditing && (
        <>
          <div className="flex flex-wrap gap-5">
            {Array.from({ length: 15 }, (_, i) => (
              <>
                <div
                  className="h-32 w-32 bg-brand-mutedblue rounded-full overflow-hidden flex justify-center items-center border-2 border-white hover:cursor-pointer"
                  style={{
                    border:
                      selectedAvatar === i + 1 ? "3px solid black" : "none",
                  }}
                  onClick={() => {
                    setSelectedAvatar(i + 1);
                  }}
                >
                  <img
                    src={`/src/assets/avatars/avatar${i + 1}.png`}
                    alt="@shadcn"
                    className="w-4/5 h-4/5 object-contain"
                  />
                </div>
              </>
            ))}
          </div>
          <Button onClick={confirmAvatarSelection} className="ml-5 mt-10">
            Save
          </Button>
        </>
      )}
    </div>
  );
}
