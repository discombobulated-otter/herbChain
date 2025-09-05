import { useEffect, useState } from "react";
import axios from "axios";

export default function Overview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch basic overview stats from backend
    axios.get("http://localhost:5000/overview")
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching overview:", err));
  }, []);

  return (
    <div>
      <h1>Overview</h1>
      
      {!stats ? (
        <p>Loading stats...</p>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Collections</h3>
            <p>{stats.totalCollections}</p>
          </div>
          <div className="stat-card">
            <h3>Total Processing Steps</h3>
            <p>{stats.totalProcessing}</p>
          </div>
          <div className="stat-card">
            <h3>Total Lab Tests</h3>
            <p>{stats.totalQualityTests}</p>
          </div>
          <div className="stat-card">
            <h3>Total Packaged Batches</h3>
            <p>{stats.totalPackages}</p>
          </div>
        </div>
      )}

      <section>
        <h2>Compliance Summary</h2>
        <ul>
          <li>Valid Harvests: {stats?.compliance?.validHarvests || 0}</li>
          <li>Invalid Harvests: {stats?.compliance?.invalidHarvests || 0}</li>
          <li>Compliance %: {stats?.compliance?.rate || 0}%</li>
        </ul>
      </section>
    </div>
  );
}
