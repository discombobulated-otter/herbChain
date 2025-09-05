import { useState } from "react";

export default function Compliance() {
  const [filter, setFilter] = useState("all");
  const [records] = useState([
    { id: "col1", species: "Ashwagandha", status: "Valid", date: "2025-05-05" },
    { id: "col2", species: "Tulsi", status: "Invalid", date: "2025-05-06" },
    { id: "col3", species: "Neem", status: "Valid", date: "2025-05-07" },
    { id: "col4", species: "Amla", status: "Valid", date: "2025-05-08" },
  ]);

  const filtered = filter === "all"
    ? records
    : records.filter(r => r.status.toLowerCase() === filter);

  // quick stats
  const total = records.length;
  const valid = records.filter(r => r.status === "Valid").length;
  const invalid = total - valid;

  return (
    <div>
      <h1>Compliance Monitor</h1>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ padding: "15px", background: "#e6f7e6", borderRadius: "8px", flex: 1 }}>
          <h3>Total Records</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>{total}</p>
        </div>
        <div style={{ padding: "15px", background: "#d1f0ff", borderRadius: "8px", flex: 1 }}>
          <h3>Valid</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "green" }}>{valid}</p>
        </div>
        <div style={{ padding: "15px", background: "#ffe1e1", borderRadius: "8px", flex: 1 }}>
          <h3>Invalid</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}>{invalid}</p>
        </div>
      </div>

      {/* Filter */}
      <label>
        Filter by Status:{" "}
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="valid">Valid</option>
          <option value="invalid">Invalid</option>
        </select>
      </label>

      {/* Styled Table */}
      <table style={{
        marginTop: "20px",
        borderCollapse: "collapse",
        width: "100%",
        border: "1px solid #ccc"
      }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>ID</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Species</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Status</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((rec, i) => (
            <tr key={i}>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>{rec.id}</td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>{rec.species}</td>
              <td style={{
                padding: "10px",
                border: "1px solid #ccc",
                color: rec.status === "Valid" ? "green" : "red",
                fontWeight: "bold"
              }}>
                {rec.status}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>{rec.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
