"use strict";

const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

async function main() {
  try {
    const ccpPath = path.resolve(__dirname, "connection-org1.json");
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
    const ca = new FabricCAServices(caURL);

    const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, "wallet"));

    const userIdentity = await wallet.get("appUser");
    if (userIdentity) {
      console.log("User 'appUser' already exists in the wallet");
      return;
    }

    const adminIdentity = await wallet.get("admin");
    if (!adminIdentity) {
      console.log("Admin identity not found in wallet. Run enrollAdmin.js first.");
      return;
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");

    const secret = await ca.register(
      {
        affiliation: "org1.department1",
        enrollmentID: "appUser",
        role: "client",
      },
      adminUser
    );

    const enrollment = await ca.enroll({
      enrollmentID: "appUser",
      enrollmentSecret: secret,
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };
    await wallet.put("appUser", x509Identity);
    console.log("✅ Successfully registered and enrolled user 'appUser' and imported into the wallet");
  } catch (error) {
    console.error(`Failed to register user: ${error}`);
    process.exit(1);
  }
}

main();

