import { useState } from "react";
import { EditableTextProps } from "../interface/interfaces";
import { updateUserData } from "../utils/utils";

export default function EditableText({
  fieldName,
  databaseContent,
  userIdParam,
  isProfileOwner,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(
    databaseContent ? databaseContent : `Add your ${fieldName}...`
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
          {fieldName === "quote" ? (
            <em>
              <strong>
                "{textValue ? textValue : `Add your ${fieldName}...`}"
              </strong>
            </em>
          ) : textValue ? (
            textValue
          ) : (
            `Add your ${fieldName}...`
          )}{" "}
          {isProfileOwner && (
            <button
              onClick={() => {
                setIsEditing(true);
              }}
            >
              edit
            </button>
          )}
        </div>
      )}
    </div>
  );
}
