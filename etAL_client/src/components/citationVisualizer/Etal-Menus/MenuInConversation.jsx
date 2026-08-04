import { useState, useMemo, useEffect } from "react";
import MenuInConversationResultsPage from "./MenuInConversationResultsPage";
import useNetworkGraphContext from "../../../hooks/useNetworkGraphContext";

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

function MenuInConversation({ oracleMode }) {
  const [pageNumber, setPageNumber] = useState(0);
  const { data } = useNetworkGraphContext();
  const subdivdedArray = useMemo(() => {
    if (data === null) {
      return [];
    } else {
      const newArray = [...data.sorted_citation_conversation];
      if (oracleMode) {
        newArray.sort((a, b) => b.oracle_score - a.oracle_score);
      }
      return arraySubdivider(newArray);
    }
  }, [data, oracleMode]);

  useEffect(() => {
    setPageNumber(0);
  }, [data, oracleMode]);

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
        setPageNumber={setPageNumber}
        subData={subdivdedArray}
      />
    </div>
  );
}

export default MenuInConversation;
