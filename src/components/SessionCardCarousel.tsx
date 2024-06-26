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
import { UserSessionDataType, SessionDataType } from "@/interface/interfaces";
import { Button } from "./ui/button";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { getMultipleSessionDetails, hidePastSessions } from "@/utils/utils";

import { hyphenatedToReadable } from "@/utils/utils";
interface SessionCardCarouselProps {
  sessions: Array<UserSessionDataType>;
  isProfileOwner: boolean;
}

import { dateOptions, timeOptions } from "@/utils/utils";
import { useEffect } from "react";
import { sortSessions } from "@/utils/utils";
import BookSessionDialog from "./BookSessionDialog";

export default function SessionCardCarousel({
  sessions,
  isProfileOwner,
}: SessionCardCarouselProps) {
  const [hostingSessionDetails, setHostingSessionDetails] = useState<
    SessionDataType[]
  >([]);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    (async () => {
      const hostingSessionIds = sessions
        .filter((session) => session.role === "host")
        .map((session) => session.sessionId);
      if (hostingSessionIds.length > 0) {
        const data = await getMultipleSessionDetails(hostingSessionIds);
        if (data) {
          setHostingSessionDetails(data);
        } else {
          setErrorMessage("Error ");
        }
      } else {
        setErrorMessage("This user isn't hosting any sessions for now.");
      }
    })();
  }, []);

  if (
    hidePastSessions(sortSessions(hostingSessionDetails)).filter(
      (session) => session?.ended !== true
    ).length === 0
  )
    return <p>This user isn't hosting any sessions for now.</p>;

  return (
    <div className="w-full relative px-0">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {sessions.length === 0 && (
            <p className="ml-10 font-semibold text-lg">{errorMessage}</p>
          )}
          {hostingSessionDetails &&
            hidePastSessions(sortSessions(hostingSessionDetails))
              .filter((session) => session?.ended !== true)
              .map((session) => (
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

                        <CardTitle className="text-xl 2xl:text-2xl truncate hover:text-clip">
                          {session.sessionName}
                        </CardTitle>
                        <CardDescription className="min-h-12 line-clamp-2">
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
                          {hidePastSessions(sortSessions(hostingSessionDetails))
                            .length === 0 && <p>nope</p>}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center truncate">
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
                        {isProfileOwner && (
                          <Button variant="secondary">You are the Host</Button>
                        )}
                        {!isProfileOwner && (
                          <BookSessionDialog sessionId={session.sessionId} />
                        )}
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
