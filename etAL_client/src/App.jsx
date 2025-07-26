import Navbar from "./components/searchFunctions/Navbar";
import NetworkGraph from "./components/citationVisualizer/NetworkGraph";
import { useState } from "react";

function App() {
  const [etalData, setEtalData] = useState({ data: null, loading: false });
  const [selectedArticle, setSelectedArticle] = useState({
    id: null,
    oracle: false,
  });
  const [viewPortSize, setViewPortSize] = useState({ width: 400, height: 400 });
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
          height: viewPortSize.height.toString(),
          width: viewPortSize.width.toString(),
          flexDirection: "row",
        }}
      >
        <NetworkGraph
          etAlData={etalData}
          selectedArticle={selectedArticle}
          setSelectedArticle={setSelectedArticle}
          setViewPortSize={setViewPortSize}
        />
      </div>
    </div>
  );
}

export default App;

/**
 *       <CitationCard
        title={"The 'ideograph': A link between rhetoric and ideology"}
        author={"Michael Calvin McGee"}
        doi={"https://doi.org/10.1080/00335638009383499"}
        pubDate={"1980-02-01"}
        source={"Quarterly Journal of Speech"}
        id={"https://openalex.org/W2014083076"}
      />
 */
