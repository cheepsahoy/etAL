import etALSearch from "../../../../OA_middleWare/etAL/etALSearch";
import SuggestionList from "./SuggestionList";
import { useEffect, useState } from "react";

function debounceAsync(fn, delay = 1000) {
  let timeout;
  return (...args) =>
    new Promise((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const result = await fn(...args);
        resolve(result);
      }, delay);
    });
}

const testQuerry = debounceAsync((text) => {
  console.log(text);
});

function SearchBar() {
  const [searchResults, SetSearchResults] = useState({ results: [] });
  const debounceAutoComplete = debounceAsync(etALSearch.autoComplete);

  async function searchHandle(input) {
    let inputValue = input.target.value;
    if (inputValue.length !== 0) {
      const resp = await debounceAutoComplete(inputValue);
      console.log(resp);
      SetSearchResults(resp);
    }
  }

  return (
    <div className="searchArea">
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search by Article Title"
          onChange={searchHandle}
        />
        <button></button>
      </div>
      <SuggestionList object={searchResults} />
    </div>
  );
}

export default SearchBar;
