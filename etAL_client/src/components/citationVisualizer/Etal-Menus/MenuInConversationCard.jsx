function lastNameExtractor(string) {
  const regex = /\b(\w+)$/;
  const match = string.match(regex);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}

function finalAuthorName(authorObj) {
  const authorArray = [];
  for (const author of authorObj) {
    authorArray.push(author.author.display_name);
  }
  let authorNames = [];
  if (authorArray.length > 3) {
    authorNames.push(lastNameExtractor(authorArray[0]));
    authorNames.push("et al.");
  } else if (authorArray.length !== 3) {
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

function MenuInConversationCard({ data }) {
  const uniqueID = data.id;
  const citationCount = data.centrality_score;
  const title = data.title;
  const year = data.pubDate;
  const doi = data.doi;
  const source = data.source;

  const authorObj = data.authorships;
  const finalName = finalAuthorName(authorObj);

  return <p></p>;
}

export default MenuInConversationCard;
