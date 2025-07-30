import { useState, useMemo } from "react";
import MenuInConversationResultsPage from "./MenuInConversationResultsPage";

function arraySubdivider(array) {
  const subdivdedArray = [];
  let arraySlice = [];

  for (const entry of array) {
    if (arraySlice.length < 10) {
      arraySlice.push(entry);
    } else {
      subdivdedArray.push(arraySlice);
      arraySlice = [entry];
    }
  }
  arraySlice.push({ data: "End of results" });
  subdivdedArray.push(arraySlice);

  return subdivdedArray;
}

function MenuInConversation({ etAlData, setSelectedArticle }) {
  const [pageNumber, setPageNumber] = useState(0);
  const subdivdedArray = useMemo(() => {
    if (etAlData.data === null) {
      return [];
    } else {
      return arraySubdivider(etAlData.sorted_citation_conversation);
    }
  }, [etAlData]);

  return (
    <div className="menuInConversation" style={{ border: "5px solid black" }}>
      <p>
        <u>
          <b>Internal Conversation Cites</b>
        </u>
      </p>
      <MenuInConversationResultsPage
        pageNumber={pageNumber}
        setPageNunber={setPageNumber}
        subData={subdivdedArray}
        setSelectedArticle={setSelectedArticle}
      />
    </div>
  );
}

export default MenuInConversation;
