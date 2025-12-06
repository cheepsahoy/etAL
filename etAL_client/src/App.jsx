import Navbar from "./components/searchFunctions/Navbar";
import NetworkGraph from "./components/citationVisualizer/NetworkGraph";
import NetworkMenus from "./components/citationVisualizer/NetworkMenus";
import { useState } from "react";
import NetworkGraphProvider from "./contexts/NetworkGraphContext";

function App() {
  return (
    <NetworkGraphProvider>
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <NetworkMenus />
          <NetworkGraph />
        </div>
      </div>
    </NetworkGraphProvider>
  );
}

export default App;
