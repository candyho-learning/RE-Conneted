import { TagSelectorProps } from "../interface/interfaces";
import { TAGS } from "../utils/settingsData";
import { useState } from "react";
import { updateUserData } from "../utils/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

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
      toast({
        title: "Updated your tags successfully!",
        description:
          "Now you can expect to meet like-minded people in the community for sure!",
      });
    } else {
      console.error("Failed to update user data", result.error);
    }
  }
  return (
    <>
      <h3 className="text-sm xl:text-xl font-semibold">Choose Up to 5 Tags</h3>
      <h4 className="text-gray-500">
        This helps other users with similar interest find you.
      </h4>

      <h4 className="text-gray-500">You have selected {tags?.length} tags</h4>
      {!isEditing && (
        <>
          <div className="tag-selector my-10">
            {tags.map((tag) => (
              <Badge
                className="mr-4 my-2 h-[28px] text-[16px] rounded-lg"
                variant="secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit Tags
          </Button>
        </>
      )}

      {isEditing && (
        <>
          <div className="tag-selector w-3/5 my-10">
            {TAGS.map((tag) => (
              <Badge
                key={tag}
                className="mr-4 my-2 h-[28px] text-[16px] rounded-lg hover:cursor-pointer"
                variant="secondary"
                onClick={() => {
                  toggleSelectedTags(tag);
                }}
                style={{
                  border: tags.includes(tag) ? "2px solid black" : "none",
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <Button onClick={confirmTagSelection}>Confirm Tags</Button>
        </>
      )}
    </>
  );
}
