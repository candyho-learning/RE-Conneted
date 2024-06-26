import { useState } from "react";
import { EditableTextProps } from "../interface/interfaces";
import { updateUserData } from "../utils/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

export default function EditableText({
  fieldName,
  databaseContent,
  userIdParam,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(
    databaseContent ? databaseContent : ""
  );

  async function confirmTextUpdate() {
    setIsEditing(false);
    if (textValue === databaseContent) return;
    if (fieldName.includes("Link") && !textValue.includes("https://")) {
      toast({
        variant: "destructive",
        title: "Are you sure this is the correct link?",
        description: "Valid links should contain https:// ",
      });
      setTextValue("");
      return;
    }
    const result = await updateUserData(userIdParam, fieldName, textValue);
    if (result.success) {
      toast({
        title: "Update successful!",
        description: `Your ${fieldName} was saved!`,
      });
    } else {
      console.error("Failed to update user data", result.error);
    }
  }
  return (
    <div>
      {isEditing && (
        <div className="flex xl:h-12">
          <Input
            type="text"
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
            }}
            className="mr-3 w-full text-lg h-full"
            placeholder={`Add your ${fieldName}`}
          />
          <Button onClick={confirmTextUpdate} className="xl:h-full xl:text-md">
            save
          </Button>
        </div>
      )}
      {!isEditing && (
        <div className="flex xl:h-12">
          <div className="flex w-full items-center h-full rounded-md border border-input bg-transparent px-3 py-1 text-lg shadow-sm transition-colors  placeholder:text-muted-foreground mr-3">
            {textValue ? textValue : ""}
          </div>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
            variant="secondary"
            className="xl:h-full xl:text-md"
          >
            edit
          </Button>
        </div>
      )}
    </div>
  );
}
