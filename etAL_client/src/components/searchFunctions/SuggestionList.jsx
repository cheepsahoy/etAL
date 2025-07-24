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

function SuggestionList({ object, buttonFunction }) {
  const renderData = arrayExtract(object);
  if (renderData.length === 0) {
    return (
      <ul>
        <li key={"loading"}>Waiting for Querry...</li>
      </ul>
    );
  }

  return (
    <ul>
      {renderData.map((citation) => (
        <li key={etALSearch._extractOpenAlexID(citation.id)}>
          <CitationCard
            citationObj={citation}
            buttonFunction={buttonFunction}
          />
        </li>
      ))}
    </ul>
  );
}

export default SuggestionList;
