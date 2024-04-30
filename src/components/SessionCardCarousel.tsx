import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { FutureSessionDataType, SessionDataType } from "@/interface/interfaces";
import { Button } from "./ui/button";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import {
  query,
  collection,
  where,
  documentId,
  getDocs,
} from "firebase/firestore";
interface SessionCardCarouselProps {
  sessions: Array<FutureSessionDataType>;
}
import { db } from "@/firebase";

import { dateOptions, timeOptions } from "@/utils/utils";
import { useEffect } from "react";

export default function SessionCardCarousel({
  sessions,
}: SessionCardCarouselProps) {
  const [sessionDetails, setSessionDetails] = useState<SessionDataType[]>([]);
  useEffect(() => {
    (async () => {
      console.log("getting individual session data");
      const sessionIds = sessions.map((session) => session.sessionId);
      const q = query(
        collection(db, "sessions"),
        where(documentId(), "in", sessionIds)
      );

      const sessionsDocsSnap = await getDocs(q);
      let data: Array<SessionDataType> = [];

      sessionsDocsSnap.forEach((doc) => {
        data.push(doc.data() as SessionDataType);
        console.log(doc.data());
      });
      setSessionDetails(data);
    })();
  }, []);

  return (
    <div className="w-full relative px-10">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {sessions.length === 0 && (
            <h4 className="ml-10 font-semibold text-lg">
              This user isn't hosting any sessions for now.
            </h4>
          )}
          {sessionDetails &&
            sessions
              .filter((session) => session.role === "host")
              .sort((a, b) => {
                const startTimeA = a.startTime.toDate().getTime();
                const startTimeB = b.startTime.toDate().getTime();
                return startTimeB - startTimeA;
              })
              .map((session) => (
                <CarouselItem
                  key={session.sessionId}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="w-full h-full">
                      <CardHeader>
                        <img src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQyMDIyNzV8&ixlib=rb-4.0.3&q=85"></img>
                        <CardTitle className="text-xl">
                          {session.sessionName}
                        </CardTitle>
                        <CardDescription>
                          <p>Rest 15m / Deep Work 45m / Free Chat 10m</p>
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center">
                          <CalendarIcon />
                          <p className="ml-3">
                            {session.startTime
                              .toDate()
                              .toLocaleString("en-US", dateOptions)}
                          </p>
                        </div>

                        <div className="flex items-center">
                          <ClockIcon />
                          <p className="ml-3">
                            {session.startTime
                              .toDate()
                              .toLocaleString("en-US", timeOptions)}
                          </p>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <a
                          href={`/coworking-session?type=default&id=${session.sessionId}`}
                        >
                          <Button>Join</Button>
                        </a>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
