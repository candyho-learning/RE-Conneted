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
  CardDescription,
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
        <div className="goals-display glass">
          {sessionData &&
            sessionData.participantsActivity?.map((item) => (
              <Card key={item.userId} className="w-80">
                <CardHeader>
                  <div className="flex items-center">
                    <CardTitle className="text-xl font-bold">
                      {item.userName}
                    </CardTitle>
                    <CardDescription className="ml-2">
                      {item?.userLocation ? `📍 ${item.userLocation}` : ""}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex">
                    <h4 className="font-semibold mr-3">Session Goals</h4>
                    {item.goals &&
                      item.goals?.length > 0 &&
                      item.goals?.every((goal) => goal.isDone) && (
                        <Badge variant="secondary">All Done 🎉</Badge>
                      )}
                  </div>
                  {item.goals?.map((task) => (
                    <p>
                      {task.task} {task.isDone ? "✅" : ""}
                    </p>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button>Visit {item.userName}'s Profile</Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
