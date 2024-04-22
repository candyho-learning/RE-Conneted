import { TagSelectorProps } from "../interface/interfaces";
import { TAGS } from "../utils/settingsData";
import { useState } from "react";
import { updateUserData } from "../utils/utils";

export default function TagSelector({
  setTags,
  tags,
  userId,
}: TagSelectorProps) {
  console.log(userId);
  const [isEditing, setIsEditing] = useState(false);

  function toggleSelectedTags(tagName: string) {
    console.log(tagName);
    if (tags.includes(tagName)) {
      //tag already selected -> remove from list
      setTags(tags.filter((tag) => tag !== tagName));
    } else {
      //tag not yet selected -> add to list
      if (tags.length >= 5) return;

      setTags((prevList) => [...prevList, tagName]);
    }
  }

  async function confirmTagSelection() {
    setIsEditing(false);
    console.log(userId);
    const result = await updateUserData(userId, "tags", tags);
    if (result.success) {
      alert(`Updated your tags successfully!`);
    } else {
      console.error("Failed to update user data", result.error);
    }
  }
  return (
    <>
      <h3>Choose Up to 5 Tags</h3>

      <h4>You have selected {tags?.length} tags</h4>
      {!isEditing && (
        <>
          <button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit Tags
          </button>
          <div className="tag-selector">
            {tags.map((tag) => (
              <div key={tag} className="tag">
                {tag}
              </div>
            ))}
          </div>
        </>
      )}

      {isEditing && (
        <>
          <div className="tag-selector">
            {TAGS.map((tag) => (
              <div
                key={tag}
                className="tag"
                onClick={() => {
                  toggleSelectedTags(tag);
                }}
                style={{
                  border: tags.includes(tag) ? "2px solid black" : "none",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <button onClick={confirmTagSelection}>Confirm Tags</button>
        </>
      )}
    </>
  );
}
