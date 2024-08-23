import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Arenas from "./Components/Arenas/Arenas.tsx";
import Events from "./Components/Events/Events.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h4>Home</h4>} />
        <Route path="/arenas" element={<Arenas />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </Router>
  );

}

export default App
