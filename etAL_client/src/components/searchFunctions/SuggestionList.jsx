import CitationCard from "./CitationCard";
import etALSearch from "../../../../OA_middleWare/etAL/etALSearch";
import { Paper, Stack, Text } from "@mantine/core";

function arrayExtract(object) {
  let smallerArray = [];
  if (object.results.length === 0) {
    return object.results;
  }
  if (object.results.length >= 5) {
    smallerArray = object.results.slice(0, 5);
  } else {
    smallerArray = object.results;
  }
  return smallerArray;
}

function SuggestionList({ searchResults, setSearchResults }) {
  if (searchResults.waiting) {
    return null;
  } else if (searchResults.id) {
    return (
      <Paper className="searchSuggestions" p="md" radius="md" shadow="lg">
        <Text size="sm">Enjoy exploring {searchResults.id}</Text>
      </Paper>
    );
  } else {
    const renderData = arrayExtract(searchResults);

    return (
      <Paper className="searchSuggestions" p="xs" radius="md" shadow="lg">
        <Stack gap="xs">
        {renderData.map((citation) => (
          <div key={etALSearch._extractOpenAlexID(citation.id)}>
            <CitationCard
              citationObj={citation}
              setSearchResults={setSearchResults}
            />
          </div>
        ))}
        </Stack>
      </Paper>
    );
  }
}

export default SuggestionList;
