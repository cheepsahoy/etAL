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

  let finalArray = [];
  for (const item of smallerArray) {
    let template = {};
    template.title = item.title;
    template.doi = item.doi ? item.doi : "No DOI found";
    template.pubDate = item.publication_date
      ? item.publication_date
      : "No publication date found.";
    template.source = item.primary_location.source
      ? item.primary_location.source.display_name
      : "No source found";
    template.id = etALSearch._extractOpenAlexID(item.id);
    template.author = "";

    for (const authorObj of item.authorships) {
      template.author += `${authorObj.author.display_name}, `;
    }
    const fixedName = template.author.slice(0, -2);
    template.author = fixedName;
    finalArray.push(template);
  }
  return finalArray;
}

function SuggestionList({ object }) {
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
