"use strict";

const { Contract } = require("fabric-contract-api");

class HerbContract extends Contract {
  async InitLedger(ctx) {
    console.log("HerbContract ledger initialized");
  }

  async CreateCollectionEvent(ctx, id, lat, lng, species, collectorId, timestamp) {
    const event = {
      id,
      lat,
      lng,
      species,
      collectorId,
      timestamp,
      docType: "collection",
    };
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(event)));
    return JSON.stringify(event);
  }

  async AddProcessingStep(ctx, id, batchId, stepType, params, timestamp) {
    const step = {
      id,
      batchId,
      stepType,
      params,
      timestamp,
      docType: "processing",
    };
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(step)));
    return JSON.stringify(step);
  }

  async AddQualityTest(ctx, id, batchId, testType, results, timestamp) {
    const test = {
      id,
      batchId,
      testType,
      results,
      timestamp,
      docType: "qualityTest",
    };
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(test)));
    return JSON.stringify(test);
  }

  async PackageProduct(ctx, packageId, batchId, timestamp) {
    const pkg = {
      packageId,
      batchId,
      timestamp,
      docType: "package",
    };
    await ctx.stub.putState(packageId, Buffer.from(JSON.stringify(pkg)));
    return JSON.stringify(pkg);
  }

  async GetProvenance(ctx, key) {
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
        results.push({
          txId: res.value.tx_id,
          timestamp: res.value.timestamp,
          record,
        });
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
