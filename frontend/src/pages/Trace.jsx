import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function Trace() {
  const [batchId, setBatchId] = useState("");
  const [provenance, setProvenance] = useState(null);
  const [qrVisible, setQrVisible] = useState(false);

  const fetchProvenance = () => {
    console.log("Fetching provenance for:", batchId);

    setProvenance({
      id: batchId,
      events: [
        { type: "Collection", location: "28.61,77.23", actor: "farmer123", time: "2025-05-05" },
        { type: "Processing", step: "Drying", actor: "processor45", time: "2025-05-06" },
        { type: "Lab Test", test: "Pesticide", result: "Pass", actor: "lab9", time: "2025-05-07" },
        { type: "Packaging", packer: "packUnit22", time: "2025-05-08" },
      ]
    });
  };

  return (
    <div>
      <h1>Trace a Batch</h1>

      <input
        type="text"
        placeholder="Enter Batch ID"
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
      />
      <button onClick={fetchProvenance}>Trace</button>
      <button onClick={() => setQrVisible(true)}>Generate QR</button>

      {provenance && (
        <div style={{ marginTop: "20px" }}>
          <h2>Provenance for Batch {provenance.id}</h2>
          <ul>
            {provenance.events.map((ev, i) => (
              <li key={i}>
                <strong>{ev.type}</strong> — {JSON.stringify(ev)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {qrVisible && (
        <div style={{ marginTop: "20px" }}>
          <h3>QR Code</h3>
          <QRCodeCanvas value={`https://yourapp.com/provenance/${batchId}`} size={200} />
        </div>
      )}
    </div>
  );
}
