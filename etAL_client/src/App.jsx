import Navbar from "./components/Navbar";
import VisualizerSpace from "./components/Visualizer";
import { useState, useRef } from "react";

function App() {
  const [visualizer, setVisualizer] = useState({ placeholder: true });
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Navbar />
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
