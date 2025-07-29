import etALSearch from "../../../../OA_middleWare/etAL/etALSearch";
import SuggestionList from "./SuggestionList";
import { useState } from "react";
import utils from "../../frontEndUtils/utils";
import { Search } from "lucide-react";

function SearchBar({ setEtalDataGraphRender }) {
  const [searchResults, SetSearchResults] = useState({
    waiting: true,
    id: null,
  });
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
        <Search size={28} color="#ffffff" strokeWidth={1} />
        <input
          id="articleSearch"
          type="text"
          placeholder="Search by Article Title"
          onChange={searchHandle}
        />
        <button></button>
      </div>
      <SuggestionList
        searchResults={searchResults}
        setEtalDataGraphRender={setEtalDataGraphRender}
        setSearchResults={SetSearchResults}
      />
    </div>
  );
}

export default SearchBar;
