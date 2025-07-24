import Navbar from "./components/searchFunctions/Navbar";
import VisualizerSpace from "./components/citationVisualizer/Visualizer";
import { useState } from "react";

function App() {
  const [visualizer, setVisualizer] = useState({ data: null });
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Navbar buttonFunction={setVisualizer} />
      <VisualizerSpace etALObject={visualizer} />
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
