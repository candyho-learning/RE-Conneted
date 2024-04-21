import { useState } from "react";
import { EditableTextProps } from "../interface/interfaces";
import { updateUserData } from "../utils/utils";

export default function EditableText({
  fieldName,
  databaseContent,
  userId,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(
    databaseContent ? databaseContent : `Add your ${fieldName}...`
  );

  async function confirmTextUpdate() {
    setIsEditing(false);
    const result = await updateUserData(userId, fieldName, textValue);
    if (result.success) {
      alert(`Updated your ${fieldName} successfully!`);
    } else {
      console.error("Failed to update user data", result.error);
    }
  }
  return (
    <div>
      {isEditing && (
        <div>
          <input
            type="text"
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
            }}
          />
          <button onClick={confirmTextUpdate}>ok</button>
        </div>
      )}
      {!isEditing && (
        <div>
          <span>"{textValue ? textValue : `Add your ${fieldName}...`}"</span>
          <button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            edit
          </button>
        </div>
      )}
    </div>
  );
}
