import { useState } from "react";
import { EditableTextProps } from "../interface/interfaces";

export default function EditableText({ placeholder }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(placeholder);
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
          <button
            onClick={() => {
              setIsEditing(false);
            }}
          >
            ok
          </button>
        </div>
      )}
      {!isEditing && (
        <div>
          <span>"{textValue}"</span>
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
