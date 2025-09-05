"use strict";

const { Contract } = require("fabric-contract-api");

class HerbContract extends Contract {
  // Initialize ledger
  async InitLedger(ctx) {
    console.log("HerbContract ledger initialized");
  }

  // Create a collection event, tied to the submitting org
  async CreateCollectionEvent(ctx, id, lat, lng, species, collectorId, timestamp) {
    const mspId = ctx.clientIdentity.getMSPID(); // Get submitting org's MSP ID
    const event = {
      id,
      lat,
      lng,
      species,
      collectorId,
      timestamp,
      org: mspId,      // Store org ownership
      docType: "collection",
    };
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(event)));
    return JSON.stringify(event);
  }

  // Add processing step, only if org owns the batch
  async AddProcessingStep(ctx, id, batchId, stepType, params, timestamp) {
    const mspId = ctx.clientIdentity.getMSPID();

    const batchAsBytes = await ctx.stub.getState(batchId);
    if (!batchAsBytes || batchAsBytes.length === 0) {
      throw new Error(`Batch ${batchId} does not exist`);
    }

    const batch = JSON.parse(batchAsBytes.toString());
    if (batch.org !== mspId) {
      throw new Error(`Org ${mspId} is not authorized to add steps to this batch`);
    }

    const step = {
      id,
      batchId,
      stepType,
      params,
      timestamp,
      org: mspId,
      docType: "processing",
    };
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(step)));
    return JSON.stringify(step);
  }

  // Add quality test, only if org owns the batch
  async AddQualityTest(ctx, id, batchId, testType, results, timestamp) {
    const mspId = ctx.clientIdentity.getMSPID();

    const batchAsBytes = await ctx.stub.getState(batchId);
    if (!batchAsBytes || batchAsBytes.length === 0) {
      throw new Error(`Batch ${batchId} does not exist`);
    }

    const batch = JSON.parse(batchAsBytes.toString());
    if (batch.org !== mspId) {
      throw new Error(`Org ${mspId} is not authorized to add tests to this batch`);
    }

    const test = {
      id,
      batchId,
      testType,
      results,
      timestamp,
      org: mspId,
      docType: "qualityTest",
    };
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(test)));
    return JSON.stringify(test);
  }

  // Package product, only if org owns the batch
  async PackageProduct(ctx, packageId, batchId, timestamp) {
    const mspId = ctx.clientIdentity.getMSPID();

    const batchAsBytes = await ctx.stub.getState(batchId);
    if (!batchAsBytes || batchAsBytes.length === 0) {
      throw new Error(`Batch ${batchId} does not exist`);
    }

    const batch = JSON.parse(batchAsBytes.toString());
    if (batch.org !== mspId) {
      throw new Error(`Org ${mspId} is not authorized to package this batch`);
    }

    const pkg = {
      packageId,
      batchId,
      timestamp,
      org: mspId,
      docType: "package",
    };
    await ctx.stub.putState(packageId, Buffer.from(JSON.stringify(pkg)));
    return JSON.stringify(pkg);
  }

  // Get provenance for a key (history)
  async GetProvenance(ctx, key) {
    const mspId = ctx.clientIdentity.getMSPID();
    const iterator = await ctx.stub.getHistoryForKey(key);
    const results = [];

    while (true) {
      const res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        let record;
        try {
          record = JSON.parse(res.value.value.toString("utf8"));
        } catch (err) {
          record = res.value.value.toString("utf8");
        }
        // Only return records owned by the same org
        if (record.org === mspId) {
          results.push({
            txId: res.value.tx_id,
            timestamp: res.value.timestamp,
            record,
          });
        }
      }
      if (res.done) {
        await iterator.close();
        break;
      }
    }

    return JSON.stringify(results);
  }
}

module.exports = HerbContract;
