import { useContext } from "react";
import { NetworkGraphContext } from "../contexts/NetworkGraphContext";
import etalCitationMapper from "../../../OA_middleWare/etAL/citationMapper";
import {
  estimateEtAlFetchTimeMS,
  GRAPH_COMPLETION_ANIMATION_MS,
  GRAPH_READY_HOLD_MS,
} from "../frontEndUtils/networkLoading";

//Calling OpenAlex internal etAl functions
/**
 * @param {OA_WorkObject} citationObj
 * @returns {etAL_frontEndPayload}
 */
async function callEtAl(citationObj) {
  const citationConversation = new etalCitationMapper();
  citationConversation.initialize(citationObj);
  console.log(
    "Handling click in citation card, setting searchResult id to",
    citationObj.title
  );

  const start = performance.now();
  console.log(
    `beginning populate conversation call for ${
      citationConversation.citation_conversation[
        citationConversation.centralCitationID
      ].title
    }`
  );
  await citationConversation.populateConversation();
  const end = performance.now();
  const duration = end - start;
  console.log(
    `finished populating conversation, performance time was ${duration} ms`
  );

  const finalPayload = {
    centralCitationID: citationConversation.centralCitationID,
    citation_conversation: citationConversation.citation_conversation,
    citations_outgoing: citationConversation.citations_outgoing,
    sorted_citation_conversation:
      citationConversation.sorted_citation_conversation,
    sorted_citations_outgoing: citationConversation.sorted_citations_outgoing,
  };
  return finalPayload;
}

function useNetworkGraphContext() {
  const { setState, loading, loadingPhase, data, timeToLoadMS, selectedArticle } =
    useContext(NetworkGraphContext);

  async function loadData(citationObj) {
    console.log("LOADING", citationObj);
    setState({
      loading: true,
      loadingPhase: "fetching",
      timeToLoadMS: estimateEtAlFetchTimeMS(citationObj.cited_by_count),
      selectedArticle: null,
    });

    try {
      const resp = await callEtAl(citationObj);
      setState({ data: resp, loadingPhase: "completing" });

      await new Promise((resolve) =>
        setTimeout(
          resolve,
          GRAPH_COMPLETION_ANIMATION_MS + GRAPH_READY_HOLD_MS
        )
      );

      console.log("SETTING LOADING FALSE");
      setState({ loading: false, loadingPhase: null });
    } catch (error) {
      setState({ loading: false, loadingPhase: null });
      throw error;
    }
  }

  function setArticle(articleId, isOracle) {
    console.log(
      "running from usenetwork graphcontext",
      articleId,
      selectedArticle
    );
    setState({
      selectedArticle: {
        id: articleId,
        oracle:
          typeof isOracle === "boolean"
            ? isOracle
            : articleId === selectedArticle?.id
            ? !selectedArticle.oracle
            : false,
      },
    });
  }

  return {
    // state data:
    loading,
    loadingPhase,
    data,
    timeToLoadMS,
    selectedArticle,

    // actions
    loadData,
    setArticle,
  };
}

export default useNetworkGraphContext;
