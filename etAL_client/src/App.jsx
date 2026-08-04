import Navbar from "./components/searchFunctions/Navbar";
import NetworkGraph from "./components/citationVisualizer/NetworkGraph";
import NetworkMenus from "./components/citationVisualizer/NetworkMenus";
import NetworkGraphProvider from "./contexts/NetworkGraphContext";

function App() {
  return (
    <NetworkGraphProvider>
      <div className="appShell">
        <Navbar />
        <main className="visualizerShell">
          <NetworkGraph />
        </main>
        <NetworkMenus />
      </div>
    </NetworkGraphProvider>
  );
}

export default App;
