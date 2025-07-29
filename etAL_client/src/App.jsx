import Navbar from "./components/searchFunctions/Navbar";
import NetworkGraph from "./components/citationVisualizer/NetworkGraph";
import NetworkMenus from "./components/citationVisualizer/NetworkMenus";
import { useState } from "react";

function App() {
  const [etalData, setEtalData] = useState({ data: null, loading: false });
  const [selectedArticle, setSelectedArticle] = useState({
    id: null,
    oracle: false,
  });

  //need to integrate renderFinished into components. Logic: should be set to true after D3 finishes its simulation. setRenderFinished should  be passed as prop NetworkGraph and called when D3 finishes on render useEffect. Should also be passed to be passed to navBar -> citationCard so each new 'search' sets render to false. Network Menus should recieve renderFinished and only populate the menus after the render is finished.
  const [renderFinished, setRenderFinished] = useState(false);

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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <NetworkMenus
          etAlData={etalData}
          selectedArticle={selectedArticle}
          setSelectedArticle={setSelectedArticle}
        />
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
