import { useEffect, useRef, useState } from "react";
import { searchUnsplash } from "../utils/utils";
import {
  BackgroundPickerProps,
  UnsplashResponse,
} from "../interface/interfaces";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function BackgroundPicker({
  setBackgroundImage,
  backgroundImage,
}: BackgroundPickerProps) {
  const [searchTerm, setSearchTerm] = useState("living room");
  const [searchResults, setSearchResults] = useState<Array<UnsplashResponse>>(
    []
  );
  const searchPage = useRef(1);
  useEffect(() => {
    (async () => {
      const resultPlaceholder = await searchUnsplash("living room");
      console.log(resultPlaceholder);
      setSearchResults(resultPlaceholder.results);
    })();
  }, []);

  function submitSearch(e: React.MouseEvent) {
    e.preventDefault();
    console.log(searchTerm);
    if (!searchTerm) return;
    (async () => {
      const searchResult = await searchUnsplash(searchTerm);
      setSearchResults(searchResult.results);
    })();
  }

  function loadMore(e: React.MouseEvent) {
    e.preventDefault();
    if (!searchTerm) return;

    searchPage.current += 1;
    console.log("loading more images");
    (async () => {
      const searchResult = await searchUnsplash(searchTerm, searchPage.current);
      setSearchResults((prevResults) => [
        ...prevResults,
        ...searchResult.results,
      ]);
    })();
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Change Selection</Button>
      </SheetTrigger>
      <SheetContent className="w-[460px] sm:max-w-none 2xl:w-[520px]">
        <SheetHeader>
          <SheetTitle>Search on Unsplash</SheetTitle>
          <SheetDescription>
            Set up a vibe for your virtual coworking space.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <form className="grid grid-cols-4 items-center gap-4">
            <Input
              type="text"
              name="bg-image-search"
              placeholder="search anything..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="col-span-3"
            />
            <Button onClick={submitSearch} variant="outline">
              Search
            </Button>
          </form>
          <ScrollArea className="search-results w-full h-80 xl:h-[540px] 2xl:h-[700px]">
            <div className="flex flex-wrap justify-between gap-2">
              {searchResults &&
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setBackgroundImage(item.urls.full);
                    }}
                    className="m-0"
                  >
                    <div
                      className={`w-44 h-28 rounded-md ${
                        backgroundImage === item.urls.full
                          ? " border-4 border-primary"
                          : "none"
                      }`}
                    >
                      <img
                        src={item.urls.thumb}
                        className="object-cover w-full h-full rounded-md"
                      ></img>
                    </div>
                    <div>
                      <a href={item.urls.thumb}>
                        <p className="text-gray-400 font-thin text-xs italic">
                          By {item.user.username}
                        </p>
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
          <Button variant="outline" onClick={loadMore}>
            Load More
          </Button>
        </div>
        <SheetFooter className="relative bottom-0 w-full">
          <SheetClose asChild>
            <Button className="w-full">Confirm Selection</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    // <div className="background-picker">
    //   <h4>background picker</h4>
    //   <input
    //     type="text"
    //     name="bg-image-search"
    //     value={searchTerm}
    //     onChange={(e) => {
    //       setSearchTerm(e.target.value);
    //     }}
    //   />
    //   <button onClick={submitSearch}>search</button>

    //   <div className="search-results">
    //     {searchResults &&
    //       searchResults.map((item) => (
    //         <div
    //           key={item.id}
    //           onClick={() => {
    //             setBackgroundImage(item.urls.full);
    //           }}
    //         >
    //           <div
    //             className="image-frame"
    //             style={{
    //               border:
    //                 backgroundImage === item.urls.full
    //                   ? "2px solid red"
    //                   : "1px solid grey",
    //             }}
    //           >
    //             <img
    //               src={item.urls.thumb}
    //               style={{
    //                 objectFit: "cover",
    //                 width: "100%",
    //                 height: "100%",
    //               }}
    //             ></img>
    //           </div>
    //           <a href={item.urls.thumb}>
    //             <p>By {item.user.username}</p>
    //           </a>
    //         </div>
    //       ))}
    //   </div>
    //   <button onClick={loadMore}>load more</button>
    // </div>
  );
}
