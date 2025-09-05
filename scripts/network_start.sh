#!/bin/bash
# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Assume fabric-samples are in ~/fabric-samples
FABRIC_SAMPLES="${HOME}/fabric-samples"
TEST_NETWORK="${FABRIC_SAMPLES}/test-network"

if [ ! -d "$TEST_NETWORK" ]; then
    echo "ERROR: Fabric test-network not found at $TEST_NETWORK"
    echo "Please clone https://github.com/hyperledger/fabric-samples and download binaries."
    exit 1
fi

cd "$TEST_NETWORK"

# Start the network and create channel
./network.sh up createChannel -c mychannel -ca

echo "Fabric test-network started."

