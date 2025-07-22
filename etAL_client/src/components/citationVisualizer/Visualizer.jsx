import NetworkGraph from "./NetworkGraph";
import etalCitationMapper from "../../../../OA_middleWare/etAL/citationMapper";
import { useState } from "react";

function VisualizerSpace({ etALObject }) {
  const [graphData, setGraphData] = useState({ data: null });
  const buttonID = etALObject.data;
  async function automateConversation(openAlexID) {
    if (openAlexID !== null) {
      const citationConversation = new etalCitationMapper();
      citationConversation.initialize(openAlexID);
      await citationConversation.populateConversation();
      setGraphData(citationConversation);
    }
  }

  return (
    <div className="visualizerSpace">
      <button
        className="initializerButton"
        onClick={automateConversation(buttonID)}
      >
        {"Initialize Selection"}
      </button>
      <NetworkGraph etAlData={graphData} />
    </div>
  );
}

export default VisualizerSpace;
