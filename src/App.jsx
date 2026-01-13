import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Interactive from "./pages/Interactive";
import History from "./pages/History";
import RiverTest from "./components/RiverTest";
import { DataProvider } from "./context/DataContext";
import GlobalEffects from "./components/GlobalEffects";

function App() {
  return (
    <DataProvider>
      <GlobalEffects />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Interactive" element={<Interactive />} />
          <Route path="/RiverTest" element={<RiverTest />} />
          <Route path="/:id" element={<History />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
