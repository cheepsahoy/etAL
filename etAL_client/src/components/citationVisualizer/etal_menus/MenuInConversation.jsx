import { useState, useMemo, useEffect } from "react";
import MenuInConversationResultsPage from "./MenuInConversationResultsPage";
import useNetworkGraphContext from "../../../hooks/useNetworkGraphContext";
import { Paper, Title } from "@mantine/core";

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
    <Paper component="section" p="md" radius="md" withBorder>
      <Title order={3} size="sm" mb="sm">
        {oracleMode ? "Oracle conversation cites" : "Internal conversation cites"}
      </Title>
      <MenuInConversationResultsPage
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        subData={subdivdedArray}
      />
    </Paper>
  );
}

export default MenuInConversation;
