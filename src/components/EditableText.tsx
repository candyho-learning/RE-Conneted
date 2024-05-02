import { useState } from "react";
import { EditableTextProps } from "../interface/interfaces";
import { updateUserData } from "../utils/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function EditableText({
  fieldName,
  databaseContent,
  userIdParam,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(
    databaseContent ? databaseContent : `Add a link...`
  );

  async function confirmTextUpdate() {
    setIsEditing(false);
    if (textValue === databaseContent) return;
    if (fieldName.includes("Link") && !textValue.includes("https://")) {
      alert("Please add a valid link!");
      setTextValue("");
      return;
    }
    const result = await updateUserData(userIdParam, fieldName, textValue);
    if (result.success) {
      alert(`Updated your ${fieldName} successfully!`);
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
          />
          <Button onClick={confirmTextUpdate} className="xl:h-full xl:text-md">
            save
          </Button>
        </div>
      )}
      {!isEditing && (
        <div className="flex xl:h-12">
          <div className="flex w-full items-center h-full rounded-md border border-input bg-transparent px-3 py-1 text-lg shadow-sm transition-colors  placeholder:text-muted-foreground mr-3">
            {textValue ? textValue : `Add your ${fieldName}...`}
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
