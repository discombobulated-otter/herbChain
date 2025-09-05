#!/bin/bash
# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Assume fabric-samples are in ~/fabric-samples
FABRIC_SAMPLES="${HOME}/fabric-samples"
TEST_NETWORK="${FABRIC_SAMPLES}/test-network"

CHAINCODE_DIR="${SCRIPT_DIR}/../chaincode/mycc"

if [ ! -d "$CHAINCODE_DIR" ]; then
    echo "ERROR: Chaincode directory not found at $CHAINCODE_DIR"
    exit 1
fi

cd "$TEST_NETWORK"

# Deploy chaincode
./network.sh deployCC -ccn mycc -ccp "$CHAINCODE_DIR" -ccl javascript

echo "Chaincode deployed successfully."

