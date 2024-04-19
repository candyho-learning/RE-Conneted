import { useEffect, useState } from "react";
import { searchUnsplash } from "../utils/utils";
import { UnsplashResponse } from "../interface/interfaces";

export default function BackgroundPicker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Array<UnsplashResponse>>(
    []
  );
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
    (async () => {
      const searchResult = await searchUnsplash(searchTerm);
      setSearchResults(searchResult.results);
    })();
  }

  function loadMore(e: React.MouseEvent) {
    e.preventDefault();
    console.log("loading more images");
  }
  return (
    <div className="background-picker">
      <h4>background picker</h4>
      <input
        type="text"
        name="bg-image-search"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <button onClick={submitSearch}>search</button>

      <div className="search-results">
        {searchResults &&
          searchResults.map((item) => (
            <div>
              <div className="image-frame">
                <img
                  key={item.id}
                  src={item.urls.thumb}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                ></img>
              </div>
              <a href={item.urls.thumb}>
                <p>By {item.user.username}</p>
              </a>
            </div>
          ))}
      </div>
      <button onClick={loadMore}>load more</button>
    </div>
  );
}
