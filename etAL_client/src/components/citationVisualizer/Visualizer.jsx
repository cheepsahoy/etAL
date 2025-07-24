import NetworkGraph from "./NetworkGraph";
import etalCitationMapper from "../../../../OA_middleWare/etAL/citationMapper";
import { useState } from "react";

function VisualizerSpace({ etALObject }) {
  console.log(etALObject);
  const [graphData, setGraphData] = useState({ data: null });
  const automateConversation = async () => {
    const citationConversation = new etalCitationMapper();
    citationConversation.initialize(etALObject);
    console.log(citationConversation.centralCitationID);
    await citationConversation.populateConversation();
    console.log("finished populating conversation");
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
