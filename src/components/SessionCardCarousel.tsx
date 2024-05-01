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
import { hidePastSessions } from "@/utils/utils";

import { hyphenatedToReadable } from "@/utils/utils";
interface SessionCardCarouselProps {
  sessions: Array<FutureSessionDataType>;
}
import { db } from "@/firebase";

import { dateOptions, timeOptions } from "@/utils/utils";
import { useEffect } from "react";
import { sortSessions } from "@/utils/utils";

export default function SessionCardCarousel({
  sessions,
}: SessionCardCarouselProps) {
  const [hostingSessionDetails, setHostingSessionDetails] = useState<
    SessionDataType[]
  >([]);
  useEffect(() => {
    (async () => {
      console.log("getting individual session data");
      try {
        const hostingSessionIds = sessions
          .filter((session) => session.role === "host")
          .map((session) => session.sessionId);
        const q = query(
          collection(db, "sessions"),
          where(documentId(), "in", hostingSessionIds)
        );

        const sessionsDocsSnap = await getDocs(q);
        let data: Array<SessionDataType> = [];

        sessionsDocsSnap.forEach((doc) => {
          data.push(doc.data() as SessionDataType);
          console.log(doc.data());
        });
        setHostingSessionDetails(data);
      } catch (err) {
        console.error(err);
      }
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
          {hostingSessionDetails &&
            hidePastSessions(sortSessions(hostingSessionDetails)).map(
              (session) => (
                <CarouselItem
                  key={session.sessionId}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="w-full h-full">
                      <CardHeader>
                        <img
                          src={session.backgroundImageUrl}
                          className="w-full h-60 object-cover bg-gray-200"
                        ></img>

                        <CardTitle className="text-2xl">
                          {session.sessionName}
                        </CardTitle>
                        <CardDescription className="min-h-12">
                          {session.timeBlocks.map((block, i) => {
                            if (i === session.timeBlocks.length - 1) {
                              return (
                                <span>
                                  {hyphenatedToReadable(block.type)}{" "}
                                  {block.duration}m{" "}
                                </span>
                              );
                            } else {
                              return (
                                <span>
                                  {hyphenatedToReadable(block.type)}{" "}
                                  {block.duration}m / <>&nbsp;</>
                                </span>
                              );
                            }
                          })}
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
              )
            )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
