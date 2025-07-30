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

    function backWardsHandler() {
      if (pageNumber === 0) {
        return;
      } else {
        setPageNunber((prev) => prev - 1);
      }
    }

    function forwardsHandler() {
      if (pageNumber === maxPages) {
        return;
      } else {
        setPageNunber((prev) => prev + 1);
      }
    }

    return (
      <div
        className="inConversationResults"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ul>
          {releventPage.map((article) => {
            const uniqueID = article.id;
            return (
              <li key={uniqueID}>
                <MenuInConversationCard
                  data={article}
                  setSelectedArticle={setSelectedArticle}
                />
              </li>
            );
          })}
        </ul>
        <div
          className="menuBUttons"
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <button onClick={backWardsHandler}>Page Back</button>
          <button onClick={forwardsHandler}>Page Forward</button>
        </div>
      </div>
    );
  }
}

export default MenuInConversationResultsPage;
