function CitationCard({ title, author, doi, pubDate, source, id }) {
  return (
    <div
      className="selection"
      style={{ display: "flex", flexDirection: "row" }}
    >
      <div
        className="citationCard"
        id={id}
        style={{
          display: "flex",
          flexDirection: "column",
          borderStyle: "solid",
          margin: "0",
          gap: "0",
          padding: "0",
        }}
      >
        <h4 style={{ marginBottom: "0" }}>{title}</h4>
        <p style={{ marginTop: "0", marginBottom: "0", fontStyle: "italic" }}>
          {author}
        </p>
        <p style={{ marginTop: "5px", marginBottom: "0" }}>
          {pubDate}, {source}, DOI: {doi}
        </p>
      </div>
      <button>Choose me!</button>
    </div>
  );
}

export default CitationCard;
