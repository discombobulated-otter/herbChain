import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar";
import Overview from "./pages/Overview";
import Explorer from "./pages/Explorer";
import Trace from "./pages/Trace";
import Compliance from "./pages/Compliance";

function App() {
  return (
    <Router>
      <div className="app flex flex-row">
        <aside className="sidebar" style={{ width: "240px", minHeight: "100vh", position: "fixed", left: 0, top: 0, zIndex: 10 }}>
          <Sidebar />
        </aside>
        <main className="content" style={{ marginLeft: "240px", width: "100%" }}>
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
