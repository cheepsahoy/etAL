import Navbar from "./components/searchFunctions/Navbar";
import NetworkGraph from "./components/citationVisualizer/NetworkGraph";
import NetworkLoadingOverlay from "./components/citationVisualizer/NetworkLoadingOverlay";
import NetworkMenus from "./components/citationVisualizer/NetworkMenus";
import SelectedArticleViewBox from "./components/citationVisualizer/SelectedArticleViewBox";
import WelcomeScreen from "./components/welcome/WelcomeScreen";
import NetworkGraphProvider from "./contexts/NetworkGraphContext";
import useNetworkGraphContext from "./hooks/useNetworkGraphContext";
import { useState } from "react";

function AppContent() {
  const [isCitationMenuOpen, setIsCitationMenuOpen] = useState(false);
  const [citationMenuWidth, setCitationMenuWidth] = useState(0);
  const { data, loading, loadingPhase, timeToLoadMS } = useNetworkGraphContext();
  const hasGraph = data !== null;

  return (
    <div className="appShell">
      {hasGraph && <Navbar />}
      <main className="visualizerShell">
        {hasGraph ? (
          <NetworkGraph
            isCitationMenuOpen={isCitationMenuOpen}
            citationMenuWidth={citationMenuWidth}
          />
        ) : (
          <WelcomeScreen />
        )}
      </main>
      {hasGraph && (
        <NetworkMenus
          isOpen={isCitationMenuOpen}
          setIsOpen={setIsCitationMenuOpen}
          onWidthChange={setCitationMenuWidth}
        />
      )}
      {hasGraph && <SelectedArticleViewBox leftOffset="var(--mantine-spacing-lg)" />}
      {loading && (
        <NetworkLoadingOverlay
          estimatedLoadingTimeMS={timeToLoadMS}
          loadingPhase={loadingPhase}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <NetworkGraphProvider>
      <AppContent />
    </NetworkGraphProvider>
  );
}

export default App;
