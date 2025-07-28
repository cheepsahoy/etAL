import Navbar from "./components/searchFunctions/Navbar";
import NetworkGraph from "./components/citationVisualizer/NetworkGraph";
import { useState } from "react";

function App() {
  const [etalData, setEtalData] = useState({ data: null, loading: false });
  const [selectedArticle, setSelectedArticle] = useState({
    id: null,
    oracle: false,
  });
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Navbar setEtalDataGraphRender={setEtalData} />
      <div>
        <NetworkGraph
          etAlData={etalData}
          selectedArticle={selectedArticle}
          setSelectedArticle={setSelectedArticle}
        />
      </div>
    </div>
  );
}

export default App;
