import CitationCard from "./CitationCard";
import etALSearch from "../../../../OA_middleWare/etAL/etALSearch";

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

function SuggestionList({
  searchResults,
  setSearchResults,
  setEtalDataGraphRender,
}) {
  if (searchResults.waiting) {
    return <p>Waiting for Querry...</p>;
  } else if (searchResults.id) {
    return <p>Enjoy exploring {searchResults.id}</p>;
  } else {
    const renderData = arrayExtract(searchResults);

    return (
      <ul>
        {renderData.map((citation) => (
          <li key={etALSearch._extractOpenAlexID(citation.id)}>
            <CitationCard
              citationObj={citation}
              setEtalDataGraphRender={setEtalDataGraphRender}
              setSearchResults={setSearchResults}
            />
          </li>
        ))}
      </ul>
    );
  }
}

export default SuggestionList;
