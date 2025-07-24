import etALSearch from "../../../../OA_middleWare/etAL/etALSearch";

function CitationCard({ citationObj, buttonFunction }) {
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
  function clickHandler() {
    console.log(citationObj);
    buttonFunction({ ...citationObj });
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
