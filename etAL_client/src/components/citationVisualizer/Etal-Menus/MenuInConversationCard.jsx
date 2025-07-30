function lastNameExtractor(string) {
  const regex = /\b(\w+)$/;
  const match = string.match(regex);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}

function finalAuthorName(authorArray) {
  const authorNames = [];
  if (authorArray.length > 3) {
    authorNames.push(lastNameExtractor(authorArray[0]));
    authorNames.push(" et al.");
  } else if (authorArray.length !== 1) {
    const finalNamePosition = authorArray.length - 1;
    for (let i = 0; i < authorArray.length; i++) {
      if (i === finalNamePosition) {
        authorNames.push("and ");
        authorNames.push(authorArray[i]);
      } else {
        authorNames.push(authorArray[i]);
        authorNames.push(", ");
      }
    }
  } else {
    authorNames.push(authorArray[0]);
  }
  const finalName = authorNames.join("");
  return finalName;
}

function MenuInConversationCard({ data, setSelectedArticle }) {
  if (data.data) {
    const uniqueID = "endResults";
    const payload = data.data;

    return (
      <div id={uniqueID}>
        <p>{payload}</p>
      </div>
    );
  } else {
    const uniqueID = data.id;
    const citationCount = data.centrality_score;
    const title = data.title;
    const year = data.pubDate;
    const doi = data.doi;
    const source = data.source;

    const authorArray = Object.keys(data.authors);
    const finalName = finalAuthorName(authorArray);

    function buttonHandler() {
      setSelectedArticle({ id: uniqueID, oracle: false });
      return;
    }

    return (
      <div id={uniqueID}>
        <p>
          {citationCount} articles, citing {title}, by {finalName}
        </p>
        <button onClick={buttonHandler}>Locate in Graph</button>
        <button
          onClick={() => {
            if (doi === "No DOI on record") {
              const googleSearch = "https://www.google.com/search?q=";
              const querryPath = encodeURI(title);
              const finalPath = googleSearch + querryPath;
              window.open(finalPath, "_blank");
            } else {
              window.open(doi, "_blank");
            }
          }}
        >
          Find in New Page
        </button>
      </div>
    );
  }
}

export default MenuInConversationCard;
