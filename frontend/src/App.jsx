import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar";
import Overview from "./pages/Overview";
import Explorer from "./pages/Explorer";
import Trace from "./pages/Trace";
import Compliance from "./pages/Compliance";

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/trace" element={<Trace />} />
            <Route path="/compliance" element={<Compliance />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
