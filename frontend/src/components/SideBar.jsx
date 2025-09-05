import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Ayurvedic Traceability</h2>
      <nav>
        <ul>
          <li><Link to="/">Overview</Link></li>
          <li><Link to="/explorer">Explorer</Link></li>
          <li><Link to="/trace">Trace a Batch</Link></li>
          <li><Link to="/compliance">Compliance</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
