import { TimeBlockProps } from "../interface/interfaces";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TimeBlockInput({
  id,
  setTimeBlocks,
  timeBlocks,
}: TimeBlockProps) {
  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newType = e.target.value;
    setTimeBlocks(
      timeBlocks.map((block) => {
        if (block.id === id) {
          return { ...block, type: newType };
        } else {
          return block;
        }
      })
    );
  }
  function handleDurationChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDuration =
      e.target.value === "" ? e.target.value : Number(e.target.value);
    setTimeBlocks(
      timeBlocks.map((block) => {
        if (block.id === id) {
          return { ...block, duration: newDuration };
        } else {
          return block;
        }
      })
    );
  }

  function handleDeleteTimeBlock() {
    setTimeBlocks(timeBlocks.filter((block) => block.id !== id));
  }

  const currentBlock = timeBlocks.find((block) => block.id === id);
  return (
    <div style={{ display: "flex" }}>
      <Select defaultValue={currentBlock?.type}>
        <SelectTrigger className="w-[180px]">
          <SelectValue onChange={handleSelectChange} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="deep-work">Deep Work</SelectItem>
          <SelectItem value="rest">Rest</SelectItem>
          <SelectItem value="free-chat">Free Chat</SelectItem>
          <SelectItem value="ice-breaking">Ice-Breaking</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        name="minute"
        required
        onChange={handleDurationChange}
        value={currentBlock?.duration}
        className="w-16 ml-2"
      />
      <Button
        onClick={handleDeleteTimeBlock}
        variant="destructive"
        size="sm"
        className="ml-2"
      >
        remove
      </Button>
    </div>
  );
}
