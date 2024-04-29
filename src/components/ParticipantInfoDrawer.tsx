import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SessionDataType } from "@/interface/interfaces";

interface ParticipantInfoDrawerProps {
  sessionData: SessionDataType;
}

export default function ParticipantInfoDrawer({
  sessionData,
}: ParticipantInfoDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger>
        <Button
          size="lg"
          className="text-xl h-16 bg-yellow-500 text-black font-bold"
        >
          See Eveyone's Goals
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Meet New Friends</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        <div className="goals-display glass">
          {sessionData &&
            sessionData.participantsActivity?.map((item) => (
              <>
                <h4>{item.userName}</h4>
                {item.goals?.map((task) => (
                  <p>
                    {task.task} {task.isDone ? "🎉" : ""}
                  </p>
                ))}
              </>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
