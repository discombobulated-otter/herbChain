"use strict";

/**
 * backend/server.js
 *
 * Express server that connects to Hyperledger Fabric (Org1) and exposes REST endpoints:
 *  POST /collection    -> CreateCollectionEvent
 *  POST /process       -> AddProcessingStep
 *  POST /quality       -> AddQualityTest
 *  POST /package       -> PackageProduct (returns QR data URL)
 *  GET  /provenance/:id -> GetProvenance
 *
 * Place this file at: ~/fabric-samples/backend/server.js
 * Ensure: connection-org1.json is in same folder and wallet contains 'appUser' identity.
 *
 * Required npm packages:
 *   npm install express fabric-network fabric-ca-client dotenv qrcode
 */

const express = require("express");
const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");
require("dotenv").config();

const APP_USER = process.env.APP_USER || "appUser";
const PORT = process.env.PORT || 5000;
const CHANNEL_NAME = process.env.CHANNEL_NAME || "provenance";
const CHAINCODE_NAME = process.env.CHAINCODE_NAME || "herb";

const connectionProfilePath = path.resolve(__dirname, "connection-org1.json");
if (!fs.existsSync(connectionProfilePath)) {
  console.error("Missing connection-org1.json in backend folder. Copy from test-network organizations.");
  process.exit(1);
}
const ccp = JSON.parse(fs.readFileSync(connectionProfilePath, "utf8"));

const walletPath = path.join(__dirname, "wallet");

let gateway; // will hold connected gateway
let contract; // cached contract

async function initFabric() {
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const identity = await wallet.get(APP_USER);
  if (!identity) {
    console.error(`Identity '${APP_USER}' not found in wallet. Run enrollAdmin.js and registerUser.js first.`);
    process.exit(1);
  }

  gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: APP_USER,
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork(CHANNEL_NAME);
  contract = network.getContract(CHAINCODE_NAME);
  console.log(`✅ Connected to Fabric network, contract '${CHAINCODE_NAME}' on channel '${CHANNEL_NAME}'`);
}

async function submitTx(fnName, ...args) {
  if (!contract) throw new Error("Fabric contract not initialized");
  const result = await contract.submitTransaction(fnName, ...args);
  return result ? result.toString() : null;
}

async function evaluateTx(fnName, ...args) {
  if (!contract) throw new Error("Fabric contract not initialized");
  const result = await contract.evaluateTransaction(fnName, ...args);
  return result ? result.toString() : null;
}

/* ---------- Express app ---------- */
const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.post("/collection", async (req, res) => {
  try {
    const { id, lat, lng, species, collectorId, timestamp } = req.body;
    if (!id || !lat || !lng || !species || !collectorId || !timestamp) {
      return res.status(400).json({ error: "Missing required fields: id, lat, lng, species, collectorId, timestamp" });
    }
    const result = await submitTx(
      "CreateCollectionEvent",
      String(id),
      String(lat),
      String(lng),
      String(species),
      String(collectorId),
      String(timestamp)
    );
    return res.json(result ? JSON.parse(result) : { result: null });
  } catch (err) {
    console.error("Error /collection:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/process", async (req, res) => {
  try {
    const { id, batchId, stepType, params, timestamp } = req.body;
    if (!id || !batchId || !stepType || !timestamp) {
      return res.status(400).json({ error: "Missing required fields: id, batchId, stepType, timestamp" });
    }
    const paramsStr = typeof params === "string" ? params : JSON.stringify(params || {});
    const result = await submitTx(
      "AddProcessingStep",
      String(id),
      String(batchId),
      String(stepType),
      String(paramsStr),
      String(timestamp)
    );
    return res.json(result ? JSON.parse(result) : { result: null });
  } catch (err) {
    console.error("Error /process:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/quality", async (req, res) => {
  try {
    const { id, batchId, testType, results, timestamp } = req.body;
    if (!id || !batchId || !testType || !timestamp) {
      return res.status(400).json({ error: "Missing required fields: id, batchId, testType, timestamp" });
    }
    const resultsStr = typeof results === "string" ? results : JSON.stringify(results || {});
    const result = await submitTx(
      "AddQualityTest",
      String(id),
      String(batchId),
      String(testType),
      String(resultsStr),
      String(timestamp)
    );
    return res.json(result ? JSON.parse(result) : { result: null });
  } catch (err) {
    console.error("Error /quality:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/package", async (req, res) => {
  try {
    const { packageId, batchId, timestamp } = req.body;
    if (!packageId || !batchId || !timestamp) {
      return res.status(400).json({ error: "Missing required fields: packageId, batchId, timestamp" });
    }
    const result = await submitTx("PackageProduct", String(packageId), String(batchId), String(timestamp));
    // generate QR that points to consumer scan URL
    const host = req.get("host");
    const protocol = req.protocol;
    const scanUrl = `${protocol}://${host}/scan/${encodeURIComponent(packageId)}`;
    const qrDataUrl = await QRCode.toDataURL(scanUrl);
    return res.json({
      result: result ? JSON.parse(result) : { result: null },
      qr: qrDataUrl,
      scanUrl,
    });
  } catch (err) {
    console.error("Error /package:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.get("/provenance/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id param" });
    const data = await evaluateTx("GetProvenance", String(id));
    if (!data) return res.json([]);
    return res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error /provenance/:id", err);
    return res.status(500).json({ error: err.message });
  }
});

/* Optional: consumer-friendly scan endpoint that wraps provenance */
app.get("/scan/:packageId", async (req, res) => {
  try {
    const packageId = req.params.packageId;
    if (!packageId) return res.status(400).send("Missing packageId");
    // For package -> find batchId from package record via GetProvenance(packageId) or evaluate package state directly
    const prov = await evaluateTx("GetProvenance", String(packageId));
    if (!prov) return res.status(404).send("Not found");
    const parsed = JSON.parse(prov);
    // return a simple HTML page for quick demo (works without frontend)
    let html = `<h2>Provenance for ${packageId}</h2><pre>${JSON.stringify(parsed, null, 2)}</pre>`;
    return res.send(html);
  } catch (err) {
    console.error("Error /scan/:packageId", err);
    return res.status(500).send(err.message);
  }
});

/* ---------- Startup / Shutdown ---------- */
async function main() {
  try {
    await initFabric();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Backend listening on http://localhost:${PORT}`);
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received: disconnecting gateway and shutting down");
      try {
        if (gateway) await gateway.disconnect();
      } catch (e) {
        console.error("Error disconnecting gateway:", e);
      }
      server.close(() => process.exit(0));
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

main();
