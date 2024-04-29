import { useState } from "react";
import { EditableTextProps } from "../interface/interfaces";
import { updateUserData } from "../utils/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function EditableQuote({
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
        <div className="flex mt-5 w-full mb-10 relative rounded-lg border-l-8 border-l-gray-500 bg-gray-200 py-5 pl-16 pr-5 font-sans text-lg italic leading-relaxed text-gray-600 before:absolute before:left-3 before:top-3 before:font-serif before:text-6xl before:text-gray-700 before:content-['“']">
          <Input
            type="text"
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
            }}
            className="w-4/5 mr-3 text-lg h-full border-gray-400"
          />
          <Button onClick={confirmTextUpdate} className="absolute right-3">
            save quote
          </Button>
        </div>
      )}
      {!isEditing && (
        <div className="mt-5 w-full h-16 mb-10 relative rounded-lg border-l-8 border-l-gray-500 bg-gray-200 py-5 pl-16 pr-5 font-sans text-lg italic leading-relaxed text-gray-600 before:absolute before:left-3 before:top-3 before:font-serif before:text-6xl before:text-gray-700 before:content-['“']">
          {databaseContent || "Hi, I'm new here. RE:Connect with me!"}
          <Button
            className="absolute right-3"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            edit quote
          </Button>
        </div>
      )}
    </div>
  );
}
