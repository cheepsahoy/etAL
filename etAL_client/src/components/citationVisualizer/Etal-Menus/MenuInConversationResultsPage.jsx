import MenuInConversationCard from "./MenuInConversationCard";

function MenuInConversationResultsPage({
  pageNumber,
  setPageNunber,
  subData,
  setSelectedArticle,
}) {
  if (subData.length === 0) {
    return <p>Waiting on data...</p>;
  } else {
    const maxPages = subData.length;
    const releventPage = subData[pageNumber];

    return subData.map();
  }
}

export default MenuInConversationResultsPage;
