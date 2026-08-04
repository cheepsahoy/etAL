import etALSearch from "../../../../OA_middleWare/etAL/etALSearch";
import SuggestionList from "./SuggestionList";
import { useState } from "react";
import utils from "../../frontEndUtils/utils";
import { Search } from "lucide-react";
import { Box, TextInput } from "@mantine/core";

function SearchBar() {
  const [searchResults, setSearchResults] = useState({
    waiting: true,
    id: null,
  });
  const debounceAutoComplete = utils.debounceAsync(etALSearch.autoComplete);

  async function searchHandle(input) {
    let inputValue = input.target.value;
    if (inputValue.length !== 0) {
      const resp = await debounceAutoComplete(inputValue);
      console.log(resp);
      setSearchResults(resp);
    }
  }

  return (
    <Box className="searchArea">
      <TextInput
        id="articleSearch"
        aria-label="Search by article title"
        placeholder="Search by article title"
        leftSection={<Search size={18} strokeWidth={1.5} />}
        radius="xl"
        size="md"
        variant="filled"
        onChange={searchHandle}
      />
      <SuggestionList
        searchResults={searchResults}
        setSearchResults={setSearchResults}
      />
    </Box>
  );
}

export default SearchBar;
