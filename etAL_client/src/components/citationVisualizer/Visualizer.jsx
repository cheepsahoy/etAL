import NetworkGraph from "./NetworkGraph";
import etalCitationMapper from "../../../../OA_middleWare/etAL/citationMapper";
import { useState } from "react";

function VisualizerSpace({ etALObject }) {
  console.log(etALObject);
  const [graphData, setGraphData] = useState({ data: null });
  const automateConversation = async () => {
    const citationConversation = new etalCitationMapper();
    citationConversation.initialize(etALObject);
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
    console.log(`finished populating conversation with length of ${duration}`);
    setGraphData(citationConversation);
  };

  return (
    <div className="visualizerSpace">
      <button key="initializerButton" onClick={automateConversation}>
        {"Initialize Selection"}
      </button>
      <NetworkGraph etAlData={graphData} />
    </div>
  );
}

export default VisualizerSpace;
