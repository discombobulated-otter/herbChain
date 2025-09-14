"use strict";

/**
 * backend/server.js
 *
 * Express server with:
 *   - Fabric integration (Org1 network, Herb provenance chaincode)
 *   - Herb summary retrieval from Groq models
 *
 * Endpoints:
 *   GET  /health
 *   POST /collection
 *   POST /process
 *   POST /quality
 *   POST /package
 *   GET  /provenance/:id
 *   GET  /scan/:packageId
 *   POST /herbSummary
 */

import express from "express";
import cors from "cors";
import { Gateway, Wallets } from "fabric-network";
import path from "path";
import fs from "fs";
import QRCode from "qrcode";
import dotenv from "dotenv";
import { Groq } from "groq-sdk";

dotenv.config();

const APP_USER = process.env.APP_USER || "appUser";
const PORT = process.env.PORT || 5000;
const CHANNEL_NAME = process.env.CHANNEL_NAME || "provenance";
const CHAINCODE_NAME = process.env.CHAINCODE_NAME || "herb";

const connectionProfilePath = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "connection-org1.json"
);
if (!fs.existsSync(connectionProfilePath)) {
  console.error("❌ Missing connection-org1.json in backend folder.");
  process.exit(1);
}
const ccp = JSON.parse(fs.readFileSync(connectionProfilePath, "utf8"));

const walletPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "wallet"
);

let gateway;
let contract;

// ---- Fabric init ----
async function initFabric() {
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const identity = await wallet.get(APP_USER);
  if (!identity) {
    console.error(
      `❌ Identity '${APP_USER}' not found in wallet. Run enrollAdmin.js and registerUser.js first.`
    );
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
  console.log(
    `✅ Connected to Fabric network, contract '${CHAINCODE_NAME}' on channel '${CHANNEL_NAME}'`
  );
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

// ---- Express app ----
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));

// Health
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Fabric-backed endpoints
app.post("/collection", async (req, res) => {
  try {
    const { id, lat, lng, species, collectorId, timestamp } = req.body;
    if (!id || !lat || !lng || !species || !collectorId || !timestamp) {
      return res
        .status(400)
        .json({ error: "Missing required fields: id, lat, lng, species, collectorId, timestamp" });
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
      return res
        .status(400)
        .json({ error: "Missing required fields: id, batchId, stepType, timestamp" });
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
      return res
        .status(400)
        .json({ error: "Missing required fields: id, batchId, testType, timestamp" });
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
      return res
        .status(400)
        .json({ error: "Missing required fields: packageId, batchId, timestamp" });
    }
    const result = await submitTx("PackageProduct", String(packageId), String(batchId), String(timestamp));
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

app.get("/scan/:packageId", async (req, res) => {
  try {
    const packageId = req.params.packageId;
    if (!packageId) return res.status(400).send("Missing packageId");
    const prov = await evaluateTx("GetProvenance", String(packageId));
    if (!prov) return res.status(404).send("Not found");
    const parsed = JSON.parse(prov);
    return res.send(`<h2>Provenance for ${packageId}</h2><pre>${JSON.stringify(parsed, null, 2)}</pre>`);
  } catch (err) {
    console.error("Error /scan/:packageId", err);
    return res.status(500).send(err.message);
  }
});

// ---- Groq integration ----
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/herbSummary", async (req, res) => {
  try {
    const { herbSpecies } = req.body;
    if (!herbSpecies) return res.status(400).json({ error: "Missing herbSpecies" });

    const herbName = herbSpecies.split("(")[0].trim();

    const prompt = `
You are a knowledge retriever for medicinal plants. When provided with the name of a herb, return a concise structured medical summary using only standardized terminology. Do not provide unrelated information. If information is unavailable, return "No reliable data available".

Herb: ${herbName}

Output Format (JSON):
{
  "HerbName": "<exact herb name>",
  "ScientificName": "<Latin binomial>",
  "Family": "<plant family>",
  "CommonUses": [...],
  "ActiveConstituents": [...],
  "PharmacologicalEffects": [...],
  "SafetyAndToxicity": "...",
  "References": [...]
}`;

    const chatCompletion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b", // or "openai/gpt-oss-120b"
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_completion_tokens: 1024,
      top_p: 1,
    });

    const output = chatCompletion.choices[0]?.message?.content;
    return res.json({ result: output ? JSON.parse(output) : {} });
  } catch (err) {
    console.error("Error /herbSummary:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ---- Startup / Shutdown ----
async function main() {
  try {
    await initFabric();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
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
