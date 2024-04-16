import { TimeBlockProps } from "../interface/interfaces";

export default function TimeBlockInput({
  id,
  setTimeBlocks,
  timeBlocks,
}: TimeBlockProps) {
  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log("selection changed");
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
    console.log("minuted edited");
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
    console.log("deleting this time block");
    setTimeBlocks(timeBlocks.filter((block) => block.id !== id));
  }

  const currentBlock = timeBlocks.find((block) => block.id === id);
  return (
    <div style={{ display: "flex" }}>
      <select onChange={handleSelectChange} value={currentBlock?.type}>
        <option value="deep-work">Deep Work</option>
        <option value="rest">Rest</option>
        <option value="free-chat">Free Chat</option>
        <option value="ice-breaking">Ice-Breaking</option>
      </select>
      <input
        type="number"
        name="minute"
        min={1}
        max={180}
        required
        onChange={handleDurationChange}
        value={currentBlock?.duration}
      />
      <button onClick={handleDeleteTimeBlock}>delete</button>
    </div>
  );
}
