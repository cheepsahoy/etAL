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

function MenuInConversation({ oracleMode, etAlData, setSelectedArticle }) {
  const [pageNumber, setPageNumber] = useState(0);
  const subdivdedArray = useMemo(() => {
    if (etAlData.data === null) {
      return [];
    } else {
      const newArray = [...etAlData.sorted_citation_conversation];
      if (oracleMode) {
        newArray.sort((a, b) => b.oracle_score - a.oracle_score);
      }
      return arraySubdivider(newArray);
    }
  }, [etAlData]);

  return (
    <div className="menuInConversation" style={{ border: "5px solid black" }}>
      <p>
        <u>
          {oracleMode ? (
            <b> Oracle Conversation Cites</b>
          ) : (
            <b> Internal Conversation Cites</b>
          )}
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
