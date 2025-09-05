import { useState } from "react";
// import { QrScanner } from "@yudiel/react-qr-scanner";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function TestQR() {
  const [result, setResult] = useState("");

  return (
    <div>
      <h1>QR Scanner Test</h1>
      <Scanner
        onDecode={(data) => setResult(data)}
        onError={(err) => console.error("QR Error:", err)}
        style={{ width: "300px" }}
      />
      <p>Result: {result}</p>
    </div>
  );
}
