import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Interactive from "./pages/Interactive";
import History from "./pages/History";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Interactive" element={<Interactive />} />
          <Route path="/:id" element={<History />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
