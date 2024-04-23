import { useState } from "react";
import { EditableTextProps } from "../interface/interfaces";
import { updateUserData } from "../utils/utils";

export default function EditableText({
  fieldName,
  databaseContent,
  userIdParam,
  isProfileOwner = true,
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
        <div className="editable-field-wrapper">
          {fieldName === "quote" ? (
            <em>
              <strong>
                "{textValue ? textValue : `Add your ${fieldName}...`}"
              </strong>
            </em>
          ) : fieldName.includes("Link") && !textValue.includes("Add your") ? (
            <a href={textValue} target="_blank" rel="noopener noreferrer">
              {textValue}
            </a>
          ) : textValue ? (
            textValue
          ) : (
            `Add your ${fieldName}...`
          )}
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
