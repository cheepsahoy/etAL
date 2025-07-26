import etALSearch from "../../../../OA_middleWare/etAL/etALSearch";
import etalCitationMapper from "../../../../OA_middleWare/etAL/citationMapper";

//callEtAl can be moved to the backend
/**
 *
 * @param {OA_WorkObject} citationObj
 * @returns {etAL_frontEndPayload}
 */
async function callEtAl(citationObj) {
  const citationConversation = new etalCitationMapper();
  citationConversation.initialize(citationObj);
  console.log(
    "Handling click in citation card, setting searchResult id to",
    citationObj.title
  );

  const start = performance.now();
  console.log(
    `beginning populate conversation call for ${
      citationConversation.citation_conversation[
        citationConversation.centralCitationID
      ].title
    }`
  );
  await citationConversation.populateConversation();
  const end = performance.now();
  const duration = end - start;
  console.log(
    `finished populating conversation, performance time was ${duration} ms`
  );

  const finalPayload = {
    centralCitationID: citationConversation.centralCitationID,
    citation_conversation: citationConversation.citation_conversation,
    citations_outgoing: citationConversation.citations_outgoing,
    sorted_citation_conversation:
      citationConversation.sorted_citation_conversation,
    sorted_citations_outgoing: citationConversation.sorted_citations_outgoing,
  };
  return finalPayload;
}

function CitationCard({
  citationObj,
  setEtalDataGraphRender,
  setSearchResults,
}) {
  //Populating template for CitationCard
  const template = {};
  template.title = citationObj.title ?? "No primary title on record";
  template.doi = citationObj.doi ?? "No DOI on record";
  template.pubDate =
    citationObj.publication_date ?? "No publication date on record.";
  template.source =
    citationObj?.primary_location?.source?.display_name ??
    "No primary source on record";
  template.id = etALSearch._extractOpenAlexID(citationObj.id);
  template.author = "";

  for (const authorObj of citationObj.authorships) {
    template.author += `${authorObj.author.display_name}, `;
  }
  const fixedName = template.author.slice(0, -2);
  template.author = fixedName;

  //Creating clickHandler function
  async function clickHandler() {
    setSearchResults({
      waiting: false,
      id: citationObj.title,
    });
    setEtalDataGraphRender({ data: null, loading: true });

    const citationConversation = await callEtAl(citationObj);

    setEtalDataGraphRender(citationConversation);
  }

  return (
    <div
      className="selection"
      style={{ display: "flex", flexDirection: "row" }}
    >
      <div
        className="citationCard"
        id={template.id}
        style={{
          display: "flex",
          flexDirection: "column",
          borderStyle: "solid",
          margin: "0",
          gap: "0",
          padding: "0",
        }}
      >
        <h4 style={{ marginBottom: "0" }}>{template.title}</h4>
        <p style={{ marginTop: "0", marginBottom: "0", fontStyle: "italic" }}>
          {template.author}
        </p>
        <p style={{ marginTop: "5px", marginBottom: "0" }}>
          {template.pubDate}, {template.source}, {template.doi}
        </p>
      </div>
      <button id={template.id} onClick={clickHandler}>
        Visualize this Article
      </button>
    </div>
  );
}

export default CitationCard;
