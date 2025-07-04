import CitationCard from "./CitationCard";
import etALSearch from "../../../../OA_middleWare/etAL/etALSearch";

function SuggestionList({ object }) {
  let extractedArray = [];
  let suggestionArray = [];
  if (object.results.length >= 5) {
    suggestionArray = object.results.slice(0, 5);
  } else {
    suggestionArray = object.results;
  }

  if (suggestionArray.length !== 0) {
    for (const item of suggestionArray) {
      let template = {};
      template.title = item.title;
      template.doi = item.doi || "Unknown";
      template.pubDate = item.publication_date;
      template.source = item.primary_location.source
        ? item.primary_location.source.display_name
        : "";
      template.id = etALSearch._extractOpenAlexID(item.id);
      template.author = "";

      for (const authorObj of item.authorships) {
        template.author += `${authorObj.author.display_name}, `;
      }
      const fixedName = template.author.slice(0, -2);
      template.author = fixedName;
      extractedArray.push(template);
    }
  } else {
    return (
      <ul>
        <li key={"loading"}>Waiting for Querry...</li>
      </ul>
    );
  }

  return (
    <ul>
      {extractedArray.map((citation) => (
        <li key={citation.id}>
          <CitationCard
            title={citation.title}
            author={citation.author}
            doi={citation.doi}
            pubDate={citation.pubDate}
            source={citation.source}
            id={citation.id}
          />
        </li>
      ))}
    </ul>
  );
}

export default SuggestionList;
