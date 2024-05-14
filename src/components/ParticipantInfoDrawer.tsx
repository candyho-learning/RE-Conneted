import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardTitle,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionDataType } from "@/interface/interfaces";
import { Badge } from "./ui/badge";

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
      <SheetContent side="top">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-2xl font-extrabold">
            Session Partners
          </SheetTitle>
          <SheetDescription>
            Meet new friends, see what's they're up to in this session and focus
            together!
          </SheetDescription>
        </SheetHeader>
        <div className="goals-display glass flex space-x-3">
          {sessionData &&
            sessionData.participantsActivity?.map((item) => (
              <Card key={item.userId} className="w-80">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    {item.userName}'s Session Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-36 overflow-y-scroll mb-4">
                  <div>
                    {item.goals &&
                      item.goals?.length > 0 &&
                      item.goals?.every((goal) => goal.isDone) && (
                        <Badge
                          variant="secondary"
                          className="w-28 h-8 text-md mb-2"
                        >
                          All Done 🎉
                        </Badge>
                      )}
                  </div>

                  {item.goals?.map((task) => (
                    <p>
                      {task.task} {task.isDone ? "✅" : ""}
                    </p>
                  ))}
                  {item.goals?.length === 0 && (
                    <p className="text-gray-400">
                      {item.userName} hasn't shared any goals yet.
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <a href={`/connect/${item.userId}`} target="_blank">
                    <Button>
                      Visit {item.userName}'s Profile
                      <i className="fa-solid fa-arrow-up-right-from-square ml-1"></i>
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
