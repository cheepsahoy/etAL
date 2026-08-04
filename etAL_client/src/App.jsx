import Navbar from "./components/searchFunctions/Navbar";
import NetworkGraph from "./components/citationVisualizer/NetworkGraph";
import NetworkMenus from "./components/citationVisualizer/NetworkMenus";
import NetworkGraphProvider from "./contexts/NetworkGraphContext";
import { useState } from "react";

function App() {
  const [isCitationMenuOpen, setIsCitationMenuOpen] = useState(false);
  const [citationMenuWidth, setCitationMenuWidth] = useState(0);

  return (
    <NetworkGraphProvider>
      <div className="appShell">
        <Navbar />
        <main className="visualizerShell">
          <NetworkGraph
            isCitationMenuOpen={isCitationMenuOpen}
            citationMenuWidth={citationMenuWidth}
          />
        </main>
        <NetworkMenus
          isOpen={isCitationMenuOpen}
          setIsOpen={setIsCitationMenuOpen}
          onWidthChange={setCitationMenuWidth}
        />
      </div>
    </NetworkGraphProvider>
  );
}

export default App;
