import etALSearch from "../../../../OA_middleWare/etAL/etALSearch";
import SuggestionList from "./SuggestionList";
import { useState } from "react";
import utils from "../../frontEndUtils/utils";

function SearchBar() {
  const [searchResults, SetSearchResults] = useState({ results: [] });
  const debounceAutoComplete = utils.debounceAsync(etALSearch.autoComplete);

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
